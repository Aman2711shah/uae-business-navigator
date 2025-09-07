import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROFILE-AVATAR] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Avatar upload function started");

    // Create Supabase client using service role key
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
    
    logStep("User authenticated", { userId: user.id });

    if (req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("avatar") as File;
      
      if (!file) {
        throw new Error("No file provided");
      }

      logStep("File received", { 
        name: file.name, 
        size: file.size, 
        type: file.type 
      });

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.");
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      logStep("Uploading to storage", { filePath });

      // Delete existing avatar if any
      try {
        await supabaseClient.storage
          .from('avatars')
          .remove([`profiles/${user.id}/avatar.jpg`, `profiles/${user.id}/avatar.png`, `profiles/${user.id}/avatar.webp`]);
      } catch (deleteError) {
        // Ignore delete errors for non-existing files
        logStep("Previous avatar cleanup attempted");
      }

      // Upload new avatar
      const { error: uploadError } = await supabaseClient.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabaseClient.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;
      
      logStep("File uploaded successfully", { avatarUrl });

      // Update profile with new avatar URL
      const { error: updateError } = await supabaseClient
        .from("profiles")
        .upsert({
          user_id: user.id,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (updateError) throw updateError;

      logStep("Profile updated with new avatar");

      return new Response(
        JSON.stringify({
          ok: true,
          avatar_url: avatarUrl,
          message: "Avatar uploaded successfully"
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