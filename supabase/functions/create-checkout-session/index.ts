import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase client with service role key for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { submissionId } = await req.json();
    if (!submissionId) {
      throw new Error("Missing submissionId");
    }
    logStep("Request parsed", { submissionId });

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

    if (amountInFils <= 0) {
      throw new Error("Invalid amount");
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
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel?submission_id=${submissionId}`,
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

    return new Response(JSON.stringify({ 
      sessionId: session.id, 
      checkoutUrl: session.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});