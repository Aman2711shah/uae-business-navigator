import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROFILE] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started", { method: req.method });

    // Create Supabase client using service role key for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    if (req.method === "GET") {
      // Get user profile
      const { data: profile, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      logStep("Profile retrieved", { profileExists: !!profile });

      return new Response(
        JSON.stringify({
          ok: true,
          profile: profile || {
            user_id: user.id,
            email: user.email,
            full_name: null,
            display_name: null,
            phone: null,
            company: null,
            address: null,
            avatar_url: null,
            bio: null,
            headline: null,
            services: []
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (req.method === "PATCH") {
      // Update user profile
      const body = await req.json();
      logStep("Update request received", { fields: Object.keys(body) });

      // Validate and sanitize input
      const allowedFields = [
        'full_name', 'display_name', 'phone', 'company', 
        'address', 'bio', 'headline', 'services'
      ];
      
      const updateData: any = { user_id: user.id };
      
      for (const [key, value] of Object.entries(body)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updateData[key] = value;
        }
      }

      // Validate phone format if provided
      if (updateData.phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(updateData.phone.replace(/\s/g, ''))) {
          throw new Error("Invalid phone number format. Please use E.164 format.");
        }
      }

      // Validate email format if provided (though email updates should be handled separately)
      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          throw new Error("Invalid email format");
        }
      }

      logStep("Updating profile", updateData);

      const { data: updatedProfile, error } = await supabaseClient
        .from("profiles")
        .upsert(updateData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;

      logStep("Profile updated successfully", { profileId: updatedProfile.id });

      return new Response(
        JSON.stringify({
          ok: true,
          profile: updatedProfile,
          message: "Profile updated successfully"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ ok: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});