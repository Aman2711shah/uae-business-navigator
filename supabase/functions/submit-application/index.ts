import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBMIT-APPLICATION] ${step}${detailsStr}`);
};

interface SubmitApplicationRequest {
  user_email: string;
  user_name?: string;
  payload: Record<string, any>;
}

interface SubmissionRecord {
  request_id: string;
  user_email: string;
  user_name?: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    logStep("Method not allowed", { method: req.method });
    return new Response(JSON.stringify({ 
      ok: false,
      error: "Only POST method is allowed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    logStep("Function started");

    // Get client IP for rate limiting and security logging
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Parse request body with size limit
    const bodyText = await req.text();
    if (bodyText.length > 50000) { // 50KB limit
      logStep("Request too large", { size: bodyText.length });
      return new Response(JSON.stringify({ 
        ok: false,
        error: "Request body too large (max 50KB)" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 413,
      });
    }

    // Parse request body
    let requestData: SubmitApplicationRequest;
    try {
      requestData = JSON.parse(bodyText);
      logStep("Request parsed", { 
        hasEmail: !!requestData.user_email,
        hasName: !!requestData.user_name,
        hasPayload: !!requestData.payload,
        clientIP: clientIP
      });
    } catch (error) {
      logStep("JSON parse error", error);
      return new Response(JSON.stringify({ 
        ok: false,
        error: "Invalid JSON format" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate required fields
    if (!requestData.user_email) {
      logStep("Validation error: missing user_email");
      return new Response(JSON.stringify({ 
        ok: false,
        error: "user_email is required" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!requestData.payload || typeof requestData.payload !== 'object') {
      logStep("Validation error: missing or invalid payload");
      return new Response(JSON.stringify({ 
        ok: false,
        error: "payload is required and must be an object" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestData.user_email)) {
      logStep("Validation error: invalid email format");
      return new Response(JSON.stringify({ 
        ok: false,
        error: "Invalid email format" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Sanitize inputs
    const sanitizedEmail = requestData.user_email.trim().toLowerCase().substring(0, 254);
    const sanitizedName = requestData.user_name ? requestData.user_name.trim().substring(0, 100) : null;
    
    // Additional payload validation
    if (typeof requestData.payload !== 'object' || Array.isArray(requestData.payload)) {
      logStep("Validation error: payload must be an object");
      return new Response(JSON.stringify({ 
        ok: false,
        error: "Payload must be a valid object" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Generate human-readable request ID
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const requestId = `WZ-${dateStr}-${randomNum}`;
    
    logStep("Generated request ID", { requestId });

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert into submissions table with sanitized data
    const submissionData: Partial<SubmissionRecord> = {
      request_id: requestId,
      user_email: sanitizedEmail,
      user_name: sanitizedName,
      payload: requestData.payload,
    };

    const { data: submission, error: submissionError } = await supabaseClient
      .from('submissions')
      .insert(submissionData)
      .select()
      .single();

    if (submissionError) {
      logStep("Error inserting submission", submissionError);
      return new Response(JSON.stringify({ 
        ok: false,
        error: `Failed to save submission: ${submissionError.message}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    logStep("Submission saved", { id: submission.id });

    // Send email via SendGrid
    try {
      await sendEmailNotification(requestId, requestData);
      logStep("Email sent successfully");
    } catch (error) {
      logStep("Email sending failed", error);
      // Don't fail the entire request if email fails
      console.warn("Email notification failed:", error);
    }

    // Send Slack notification
    try {
      await sendSlackNotification(requestId, requestData);
      logStep("Slack notification sent successfully");
    } catch (error) {
      logStep("Slack notification failed", error);
      // Don't fail the entire request if Slack fails
      console.warn("Slack notification failed:", error);
    }

    logStep("Application submitted successfully", { requestId });

    return new Response(JSON.stringify({ 
      ok: true,
      requestId: requestId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    // Don't expose internal details in production
    const isDev = Deno.env.get('ENVIRONMENT') === 'development';
    
    return new Response(JSON.stringify({ 
      ok: false,
      error: "Internal server error",
      details: isDev ? errorMessage : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function sendEmailNotification(requestId: string, requestData: SubmitApplicationRequest) {
  const apiKey = Deno.env.get("SENDGRID_API_KEY");
  const fromEmail = Deno.env.get("SENDGRID_FROM");

  if (!apiKey || !fromEmail) {
    throw new Error("SendGrid configuration missing");
  }

  // Create payload summary
  const payloadSummary = Object.entries(requestData.payload)
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join('\n');

  const emailBody = {
    personalizations: [
      {
        to: [{ email: requestData.user_email, name: requestData.user_name }],
        subject: `Wazeet — Your Request ID: ${requestId}`
      }
    ],
    from: { email: fromEmail, name: "Wazeet" },
    content: [
      {
        type: "text/html",
        value: `
          <h2>Thank you for your submission!</h2>
          <p>Dear ${requestData.user_name || 'Valued Customer'},</p>
          <p>We have received your application with the following details:</p>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <h3>Submission Details:</h3>
          <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${payloadSummary}</pre>
          <p>We will review your application and get back to you shortly.</p>
          <p>Please keep your Request ID for future reference.</p>
          <br>
          <p>Best regards,<br>The Wazeet Team</p>
        `
      }
    ]
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
  }

  logStep("SendGrid email sent", { statusCode: response.status });
}

async function sendSlackNotification(requestId: string, requestData: SubmitApplicationRequest) {
  const webhookUrl = Deno.env.get("ADMIN_SLACK_WEBHOOK");
  const adminPanelUrl = Deno.env.get("ADMIN_PANEL_URL");

  if (!webhookUrl) {
    throw new Error("Slack webhook URL not configured");
  }

  const payloadPreview = Object.keys(requestData.payload).slice(0, 5).join(', ');
  const adminLink = adminPanelUrl 
    ? `<${adminPanelUrl}/applications/${requestId}|View in Admin Panel>`
    : 'Admin panel URL not configured';

  const slackMessage = {
    text: "New Application Submitted",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🆕 New Application Submitted"
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Request ID:*\n${requestId}`
          },
          {
            type: "mrkdwn",
            text: `*Email:*\n${requestData.user_email}`
          },
          {
            type: "mrkdwn",
            text: `*Name:*\n${requestData.user_name || 'Not provided'}`
          },
          {
            type: "mrkdwn",
            text: `*Fields:*\n${payloadPreview}${Object.keys(requestData.payload).length > 5 ? '...' : ''}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: adminLink
        }
      }
    ]
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(slackMessage),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Slack webhook error: ${response.status} - ${errorText}`);
  }

  logStep("Slack notification sent", { statusCode: response.status });
}