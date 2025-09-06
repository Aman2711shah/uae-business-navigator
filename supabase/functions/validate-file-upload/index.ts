import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FILE-VALIDATION] ${step}${detailsStr}`);
};

// Validate file type based on actual content (magic numbers)
const validateFileType = async (file: ArrayBuffer, fileName: string): Promise<{ isValid: boolean; error?: string; detectedType?: string }> => {
  const bytes = new Uint8Array(file.slice(0, 8));
  const header = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Common file signatures (magic numbers)
  const signatures = {
    'pdf': ['255044462d'], // PDF
    'jpg': ['ffd8ff'], // JPEG
    'png': ['89504e47'], // PNG
    'doc': ['d0cf11e0'], // DOC
    'docx': ['504b0304'], // DOCX (ZIP-based)
  };
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  for (const [type, sigs] of Object.entries(signatures)) {
    for (const sig of sigs) {
      if (header.startsWith(sig)) {
        if (extension === type || (type === 'jpg' && extension === 'jpeg')) {
          return { isValid: true, detectedType: type };
        } else {
          return { 
            isValid: false, 
            error: `File extension .${extension} does not match detected type ${type}`,
            detectedType: type 
          };
        }
      }
    }
  }
  
  return { isValid: false, error: `Unsupported file type or corrupted file`, detectedType: 'unknown' };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    logStep("File validation started");

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const submissionId = formData.get('submissionId') as string;
    const fieldName = formData.get('fieldName') as string;

    if (!file || !submissionId || !fieldName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("File received", { 
      fileName: file.name, 
      size: file.size, 
      type: file.type,
      submissionId,
      fieldName 
    });

    // Size validation (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ 
        error: `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds maximum allowed size of 10MB` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Read file content for type validation
    const fileBuffer = await file.arrayBuffer();
    const typeValidation = await validateFileType(fileBuffer, file.name);
    
    if (!typeValidation.isValid) {
      logStep("File type validation failed", typeValidation);
      return new Response(JSON.stringify({ 
        error: typeValidation.error,
        detectedType: typeValidation.detectedType 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("File validation passed", { detectedType: typeValidation.detectedType });

    // If validation passes, store the validated file info
    const validatedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      detectedType: typeValidation.detectedType,
      isValid: true
    };

    return new Response(JSON.stringify({ 
      success: true,
      file: validatedFile,
      message: 'File validation passed'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: 'File validation failed',
      details: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});