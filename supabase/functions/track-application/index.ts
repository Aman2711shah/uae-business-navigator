import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Log error with full stack trace for debugging
 */
const logError = (context: string, error: any) => {
  console.error(`[TRACK-APPLICATION] ${context}:`, {
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

  if (req.method !== "GET") {
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

    // Get request ID from URL params
    const url = new URL(req.url);
    const requestId = url.searchParams.get("requestId");
    
    if (!requestId) {
      return new Response(JSON.stringify({ error: "Request ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate request ID format (WZT-YYYYMMDD-XXXX)
    const requestIdPattern = /^WZT-\d{8}-\d{4}$/;
    if (!requestIdPattern.test(requestId)) {
      return new Response(JSON.stringify({ error: "Invalid request ID format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase service client
    const supabaseService = createClient(
      supabaseUrl,
      serviceRoleKey,
      { auth: { persistSession: false } }
    );

    // Query onboarding submission by request ID - only return safe data
    const { data: submissionData, error: submissionError } = await supabaseService
      .from('onboarding_submissions')
      .select(`
        id,
        request_id,
        user_name,
        status,
        created_at,
        updated_at,
        contact_info
      `)
      .eq('request_id', requestId)
      .single();

    if (submissionError) {
      if (submissionError.code === 'PGRST116') {
        // Not found
        return new Response(JSON.stringify({ error: "Application not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      logError("Database query", submissionError);
      return new Response(JSON.stringify({ error: "Failed to retrieve application" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return safe data only (no sensitive info like documents)
    const safeData = {
      id: submissionData.id,
      requestId: submissionData.request_id,
      status: submissionData.status,
      submittedAt: submissionData.created_at,
      lastUpdated: submissionData.updated_at,
      contactName: submissionData.user_name,
      // Create a safe timeline based on status
      timeline: [
        {
          step: 'Application Submitted',
          status: 'completed',
          date: submissionData.created_at,
          description: 'Your application has been successfully submitted'
        },
        {
          step: 'Document Review',
          status: submissionData.status === 'pending' ? 'current' : 'completed',
          description: 'Our team is reviewing your submitted documents'
        },
        {
          step: 'Processing',
          status: submissionData.status === 'processing' ? 'current' : submissionData.status === 'completed' || submissionData.status === 'approved' ? 'completed' : 'pending',
          description: 'Application is being processed'
        },
        {
          step: 'Completion',
          status: submissionData.status === 'completed' || submissionData.status === 'approved' ? 'completed' : 'pending',
          description: 'Application process complete'
        }
      ]
    };

    console.log(`[TRACK-APPLICATION] Successfully retrieved application ${requestId}`);

    return new Response(JSON.stringify(safeData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logError("Unexpected error", error);
    
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});