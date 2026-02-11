import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  return cleaned.startsWith('55') ? cleaned : '55' + cleaned;
}

interface ValidateTokenRequest {
  action: "validate";
  token: string;
}

interface CompleteSignupRequest {
  action: "complete";
  token: string;
  password: string;
  fullName: string;
  phone?: string;
}

type RequestBody = ValidateTokenRequest | CompleteSignupRequest;

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: RequestBody = await req.json();
    console.log("Received request:", body.action);

    if (body.action === "validate") {
      // Validate token
      const { data: subscriber, error: fetchError } = await supabase
        .from("subscribers")
        .select("id, email, full_name, phone, subscription_status, signup_token_expires_at")
        .eq("signup_token", body.token)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching subscriber:", fetchError);
        throw fetchError;
      }

      if (!subscriber) {
        return new Response(
          JSON.stringify({ valid: false, reason: "invalid", message: "Token inválido" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (subscriber.subscription_status === "active") {
        return new Response(
          JSON.stringify({ valid: false, reason: "already_active", message: "Esta conta já está ativa" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const expiresAt = new Date(subscriber.signup_token_expires_at);
      if (expiresAt < new Date()) {
        return new Response(
          JSON.stringify({ valid: false, reason: "expired", message: "Token expirado", email: subscriber.email }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({
          valid: true,
          subscriber: {
            email: subscriber.email,
            fullName: subscriber.full_name,
            phone: subscriber.phone,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (body.action === "complete") {
      // Validate token first
      const { data: subscriber, error: fetchError } = await supabase
        .from("subscribers")
        .select("*")
        .eq("signup_token", body.token)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching subscriber:", fetchError);
        throw fetchError;
      }

      if (!subscriber) {
        return new Response(
          JSON.stringify({ success: false, message: "Token inválido" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (subscriber.subscription_status === "active") {
        return new Response(
          JSON.stringify({ success: false, message: "Esta conta já está ativa" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const expiresAt = new Date(subscriber.signup_token_expires_at);
      if (expiresAt < new Date()) {
        return new Response(
          JSON.stringify({ success: false, message: "Token expirado" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Validate password
      if (!body.password || body.password.length < 6) {
        return new Response(
          JSON.stringify({ success: false, message: "A senha deve ter pelo menos 6 caracteres" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: subscriber.email,
        password: body.password,
        email_confirm: true,
        user_metadata: {
          full_name: body.fullName || subscriber.full_name,
          phone: body.phone || subscriber.phone,
        },
      });

      if (authError) {
        console.error("Error creating auth user:", authError);
        
        if (authError.message.includes("already been registered")) {
          return new Response(
            JSON.stringify({ success: false, message: "Este email já possui uma conta. Tente fazer login." }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        
        throw authError;
      }

      console.log("Created auth user:", authData.user.id);

      // Update subscriber record
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({
          user_id: authData.user.id,
          full_name: body.fullName || subscriber.full_name,
          phone: normalizePhone(body.phone || subscriber.phone || ''),
          subscription_status: "active",
          signup_token: null,
          signup_token_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscriber.id);

      if (updateError) {
        console.error("Error updating subscriber:", updateError);
        // Try to clean up created user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw updateError;
      }

      console.log("Signup completed successfully for:", subscriber.email);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Conta criada com sucesso!",
          email: subscriber.email,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
