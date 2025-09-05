import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
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

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("Missing sessionId");
    }
    logStep("Request parsed", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status,
      submissionId: session.metadata?.submissionId 
    });

    const submissionId = session.metadata?.submissionId;
    if (!submissionId) {
      throw new Error("No submission ID found in session metadata");
    }

    // Update submission based on payment status
    let updateData: any = {
      payment_intent_id: session.payment_intent || session.id,
      payment_metadata: {
        ...session.metadata,
        stripe_session_id: session.id,
        payment_status: session.payment_status,
        updated_at: new Date().toISOString()
      }
    };

    if (session.payment_status === 'paid') {
      updateData.payment_status = 'paid';
      updateData.status = 'confirmed'; // Update overall submission status
      logStep("Payment confirmed, updating submission to paid");
    } else if (session.payment_status === 'unpaid') {
      updateData.payment_status = 'failed';
      logStep("Payment failed, updating submission accordingly");
    } else {
      updateData.payment_status = 'pending';
      logStep("Payment still pending");
    }

    // Update the submission
    const { data: updatedSubmission, error: updateError } = await supabaseClient
      .from('submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single();

    if (updateError) {
      logStep("Error updating submission", updateError);
      throw new Error(`Failed to update submission: ${updateError.message}`);
    }

    logStep("Submission updated successfully", { 
      submissionId, 
      paymentStatus: updateData.payment_status 
    });

    return new Response(JSON.stringify({ 
      success: true,
      paymentStatus: session.payment_status,
      submission: updatedSubmission
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