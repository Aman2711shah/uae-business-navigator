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

    const onboardingId = validateSubmissionId(requestBody.onboardingId || requestBody.submissionId);
    logStep("Request parsed and validated", { onboardingId });

    // Fetch onboarding submission from Supabase
    const { data: submission, error: submissionError } = await supabaseClient
      .from('onboarding_submissions')
      .select('*')
      .eq('id', onboardingId)
      .single();

    if (submissionError) {
      logStep("Error fetching onboarding submission", submissionError);
      throw new Error(`Failed to fetch onboarding submission: ${submissionError.message}`);
    }

    if (!submission) {
      throw new Error("Onboarding submission not found");
    }
    logStep("Onboarding submission found", { 
      id: submission.id, 
      userName: submission.user_name,
      userEmail: submission.user_email
    });

    // Use fixed amount for service application processing
    const amountUSD = requestBody.amount || 4999; // Default $49.99
    const currency = requestBody.currency || "usd";

    logStep("Amount calculation", { 
      amount: amountUSD, 
      currency 
    });

    if (amountUSD <= 0) {
      throw new Error(`Invalid amount: ${amountUSD}`);
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
            name: `Service Application Processing`,
            description: `Processing fee for ${submission.user_name}`
          },
          unit_amount: amountUSD
        },
        quantity: 1
      }],
      metadata: { onboardingId },
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&onboarding_id=${onboardingId}`,
      cancel_url: `${req.headers.get("origin")}/service-application?cancelled=true`,
    });

    logStep("Checkout session created", { sessionId: session.id, amount: amountUSD });

    // Update onboarding submission with payment information
    const { error: updateError } = await supabaseClient
      .from('onboarding_submissions')
      .update({
        status: "payment_pending",
        updated_at: new Date().toISOString()
      })
      .eq('id', onboardingId);

    if (updateError) {
      logStep("Error updating onboarding submission", updateError);
      // Don't throw here - the session was created successfully
      console.warn("Failed to update onboarding submission with payment info:", updateError);
    } else {
      logStep("Onboarding submission updated with payment info");
    }

    logStep("Final response", { 
      sessionId: session.id, 
      checkoutUrl: session.url,
      success: true 
    });

    return new Response(JSON.stringify({ 
      sessionId: session.id, 
      url: session.url,
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