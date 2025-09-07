import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Validate file metadata on server side
 */
const validateFileMetadata = (file: any): { isValid: boolean; error?: string } => {
  if (!file.name || !file.size || !file.type) {
    return { isValid: false, error: "Missing file metadata" };
  }

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type ${file.type} not allowed` };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: `File size ${file.size} exceeds 10MB limit` };
  }

  return { isValid: true };
};

/**
 * Log error with full stack trace for debugging
 */
const logError = (context: string, error: any) => {
  console.error(`[UPLOAD-DOCUMENTS] ${context}:`, {
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    name: error?.name,
    timestamp: new Date().toISOString()
  });
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Verify required environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !serviceRoleKey) {
      logError("Configuration", new Error("Missing required environment variables"));
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase clients
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseService = createClient(
      supabaseUrl,
      serviceRoleKey,
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logError("Authentication", userError);
      return new Response(JSON.stringify({ error: "Invalid authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Parse the JSON body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      logError("JSON parsing", parseError);
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { 
      userName, 
      userEmail, 
      contactInfo, 
      documents 
    } = body;

    // Validate required fields
    if (!userName || !userEmail || !contactInfo || !documents || !Array.isArray(documents)) {
      return new Response(JSON.stringify({ error: "Missing required fields: userName, userEmail, contactInfo, or documents" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate documents array
    if (documents.length === 0) {
      return new Response(JSON.stringify({ error: "At least one document is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Server-side validation of each document
    for (let i = 0; i < documents.length; i++) {
      const fileValidation = validateFileMetadata(documents[i]);
      if (!fileValidation.isValid) {
        return new Response(JSON.stringify({ error: `Document ${i + 1}: ${fileValidation.error}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Generate request ID using database function
    const { data: requestIdData, error: requestIdError } = await supabaseService
      .rpc('generate_request_id');
    
    if (requestIdError) {
      logError("Request ID generation", requestIdError);
      return new Response(JSON.stringify({ error: "Failed to generate request ID" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create onboarding submission record using service role
    const { data: onboardingData, error: onboardingError } = await supabaseService
      .from('onboarding_submissions')
      .insert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        contact_info: contactInfo,
        uploaded_documents: documents,
        request_id: requestIdData,
        status: 'pending'
      })
      .select()
      .single();

    if (onboardingError) {
      logError("Database insertion", onboardingError);
      let errorMessage = "Failed to create submission record";
      
      // Provide specific error messages for common database errors
      if (onboardingError.code === '23505') {
        errorMessage = "Duplicate submission detected";
      } else if (onboardingError.code === '23503') {
        errorMessage = "Database constraint violation";
      } else if (onboardingError.message.includes('permission')) {
        errorMessage = "Database permission error";
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[UPLOAD-DOCUMENTS] Successfully created onboarding submission ${onboardingData.id} for user ${userId}`);

    return new Response(JSON.stringify({ 
      onboardingId: onboardingData.id,
      requestId: onboardingData.request_id,
      uploaded: documents 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logError("Unexpected error", error);
    
    // Determine appropriate error message and status code
    let statusCode = 500;
    let errorMessage = "Internal server error";
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        statusCode = 408;
        errorMessage = "Request timeout. Please try again.";
      } else if (error.message.includes('network')) {
        statusCode = 503;
        errorMessage = "Network error. Please check your connection.";
      }
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});