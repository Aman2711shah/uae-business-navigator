import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      throw new Error("Missing Stripe configuration");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Get the raw body and signature
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { eventType: event.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const submissionId = session.metadata?.submissionId;
      
      logStep("Processing checkout.session.completed", { 
        sessionId: session.id, 
        submissionId 
      });

      if (!submissionId) {
        logStep("No submission ID in session metadata");
        return new Response("No submission ID found", { status: 400 });
      }

      // Create Supabase client with service role key
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Update submission with payment information
      const { error: updateError } = await supabaseClient
        .from('submissions')
        .update({
          payment_status: "paid",
          payment_amount: session.amount_total ? (session.amount_total / 100) : null,
          payment_currency: session.currency,
          payment_intent_id: session.payment_intent,
          status: "confirmed", // Update overall submission status
          payment_metadata: {
            stripe_session_id: session.id,
            payment_method_types: session.payment_method_types,
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email,
            webhook_processed_at: new Date().toISOString()
          }
        })
        .eq('id', submissionId);

      if (updateError) {
        logStep("Error updating submission", updateError);
        throw new Error(`Failed to update submission: ${updateError.message}`);
      }

      logStep("Submission updated successfully", { 
        submissionId, 
        amount: session.amount_total / 100,
        currency: session.currency 
      });

      // Optional: Send admin notification email here
      // await sendAdminNotification(submissionId, session);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});