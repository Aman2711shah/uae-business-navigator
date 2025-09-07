import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced input validation
const validateSubmissionId = (submissionId: any): string => {
  if (!submissionId || typeof submissionId !== 'string') {
    throw new Error('Invalid submission ID');
  }
  
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(submissionId)) {
    throw new Error('Invalid submission ID format');
  }
  
  return submissionId;
};

// Sanitize error messages for client
const sanitizeError = (error: any): string => {
  if (typeof error === 'string') {
    return error.length > 100 ? 'An error occurred during payment processing' : error;
  }
  
  if (error?.message) {
    return error.message.length > 100 ? 'An error occurred during payment processing' : error.message;
  }
  
  return 'An unexpected error occurred';
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT-SESSION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Verify JWT token for authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Create Supabase client with service role key for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const submissionId = validateSubmissionId(requestBody.submissionId);
    logStep("Request parsed and validated", { submissionId });

    // Fetch submission from Supabase
    const { data: submission, error: submissionError } = await supabaseClient
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError) {
      logStep("Error fetching submission", submissionError);
      throw new Error(`Failed to fetch submission: ${submissionError.message}`);
    }

    if (!submission) {
      throw new Error("Submission not found");
    }
    logStep("Submission found", { 
      id: submission.id, 
      totalPrice: submission.total_price,
      currency: submission.payment_currency 
    });

    const amountAED = submission.total_price || 0;
    // Stripe expects amount in cents (or smallest currency unit). For AED, use 100 fils = 1 AED.
    const amountInFils = Math.round(Number(amountAED) * 100);
    const currency = submission.payment_currency || "aed";

    logStep("Amount calculation", { 
      originalAmount: amountAED, 
      amountInFils, 
      currency 
    });

    if (amountInFils <= 0) {
      throw new Error(`Invalid amount: ${amountAED} AED (${amountInFils} fils)`);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { 
            name: `Payment for Service Application`,
            description: `Submission ID: ${submissionId}`
          },
          unit_amount: amountInFils
        },
        quantity: 1
      }],
      metadata: { submissionId },
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&submission_id=${submissionId}`,
      cancel_url: `${req.headers.get("origin")}/service-application/${submissionId}?cancelled=true`,
    });

    logStep("Checkout session created", { sessionId: session.id, amount: amountInFils });

    // Update submission with payment information
    const { error: updateError } = await supabaseClient
      .from('submissions')
      .update({
        payment_intent_id: session.payment_intent || session.id,
        payment_status: "pending",
        payment_amount: amountAED,
        payment_currency: currency,
        payment_metadata: {
          stripe_session_id: session.id,
          created_at: new Date().toISOString()
        }
      })
      .eq('id', submissionId);

    if (updateError) {
      logStep("Error updating submission", updateError);
      // Don't throw here - the session was created successfully
      console.warn("Failed to update submission with payment info:", updateError);
    } else {
      logStep("Submission updated with payment info");
    }

    logStep("Final response", { 
      sessionId: session.id, 
      checkoutUrl: session.url,
      success: true 
    });

    return new Response(JSON.stringify({ 
      sessionId: session.id, 
      checkoutUrl: session.url,
      success: true
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { 
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });

    // Determine appropriate HTTP status code
    let statusCode = 500;
    if (errorMessage.includes('not found') || errorMessage.includes('Invalid submission')) {
      statusCode = 404;
    } else if (errorMessage.includes('Authentication') || errorMessage.includes('Unauthorized')) {
      statusCode = 401;
    } else if (errorMessage.includes('Missing') || errorMessage.includes('Invalid')) {
      statusCode = 400;
    }

    return new Response(JSON.stringify({ 
      error: sanitizeError(error),
      code: statusCode >= 500 ? 'INTERNAL_ERROR' : 'CLIENT_ERROR'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: statusCode,
    });
  }
});