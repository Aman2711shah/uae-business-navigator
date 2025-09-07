import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBMIT-LEAD] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client with service role key for database writes
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { formName, fields, file_url, file_base64, file_name } = await req.json();
    logStep("Request parsed", { formName, fieldsKeys: Object.keys(fields || {}), hasFile: !!(file_url || file_base64) });

    if (!formName) {
      throw new Error("formName is required");
    }

    if (!fields || typeof fields !== 'object') {
      throw new Error("fields object is required");
    }

    let finalFileUrl = file_url;
    let finalFileName = file_name;

    // Handle base64 file upload if provided
    if (file_base64 && file_name) {
      logStep("Processing base64 file upload", { fileName: file_name });
      
      try {
        // Convert base64 to blob
        const base64Data = file_base64.split(',')[1] || file_base64;
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Generate unique filename
        const timestamp = Date.now();
        const extension = file_name.split('.').pop() || 'bin';
        const uniqueFileName = `lead_${timestamp}_${file_name}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('service-uploads')
          .upload(uniqueFileName, binaryData, {
            contentType: getMimeType(extension),
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          logStep("File upload error", uploadError);
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabaseClient.storage
          .from('service-uploads')
          .getPublicUrl(uniqueFileName);

        finalFileUrl = publicUrlData.publicUrl;
        finalFileName = uniqueFileName;
        logStep("File uploaded successfully", { path: uploadData.path, publicUrl: finalFileUrl });
      } catch (fileError) {
        logStep("File processing error", fileError);
        // Continue without file if upload fails
        logStep("Continuing without file upload due to error");
      }
    }

    // Prepare lead data
    const leadData = {
      form_name: formName,
      email: fields.email || null,
      firstname: fields.firstname || fields.firstName || null,
      lastname: fields.lastname || fields.lastName || null,
      phone: fields.phone || null,
      service: fields.service || null,
      notes: fields.notes || null,
      file_url: finalFileUrl || null,
      file_name: finalFileName || null,
      fields: fields // Store all fields as JSONB for flexibility
    };

    logStep("Inserting lead data", { email: leadData.email, service: leadData.service });

    // Insert lead into database
    const { data: insertedLead, error: insertError } = await supabaseClient
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (insertError) {
      logStep("Database insert error", insertError);
      throw new Error(`Failed to save lead: ${insertError.message}`);
    }

    logStep("Lead saved successfully", { leadId: insertedLead.id });

    return new Response(JSON.stringify({ 
      success: true,
      leadId: insertedLead.id,
      message: "Lead submitted successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Helper function to get MIME type from file extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain',
    csv: 'text/csv',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}