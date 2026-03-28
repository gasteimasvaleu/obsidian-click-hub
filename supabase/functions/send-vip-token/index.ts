import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, fullName } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const signupToken = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Check if subscriber already exists
    const { data: existing } = await adminClient
      .from("subscribers")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      await adminClient
        .from("subscribers")
        .update({
          full_name: fullName || null,
          product_source: "vip",
          subscription_status: "pending",
          signup_token: signupToken,
          signup_token_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await adminClient.from("subscribers").insert({
        email: email.toLowerCase(),
        full_name: fullName || null,
        product_source: "vip",
        subscription_status: "pending",
        signup_token: signupToken,
        signup_token_expires_at: expiresAt.toISOString(),
      });
    }

    // Send email via Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const appUrl = "https://app.bibliatoonkids.com";
    const signupUrl = `${appUrl}/cadastro?token=${signupToken}`;
    const displayName = fullName || "Convidado(a)";

    const { error: emailError } = await resend.emails.send({
      from: "Biblia Toon Kids <bibliatoonkids@bibliatoonkids.com>",
      to: [email],
      subject: "🎉 Você recebeu um convite VIP - Biblia Toon Kids",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; border: 1px solid #a855f7;">
            <h1 style="color: #a855f7; text-align: center; margin-bottom: 24px;">
              🎉 Convite VIP - Biblia Toon Kids!
            </h1>
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
              Olá, <strong>${displayName}</strong>!
            </p>
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
              Você recebeu um acesso VIP à Biblia Toon Kids! Complete seu cadastro para ter acesso a todo o conteúdo exclusivo.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${signupUrl}" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                Completar Cadastro
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 14px; text-align: center;">
              ⚠️ Este link expira em <strong>48 horas</strong>
            </p>
            <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;">
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              Caso o botão não funcione, copie e cole este link no navegador:<br>
              <a href="${signupUrl}" style="color: #a855f7; word-break: break-all; text-decoration: underline;">${signupUrl}</a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Error sending VIP email:", emailError);
      return new Response(
        JSON.stringify({ error: "Token criado mas erro ao enviar email", details: emailError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("VIP token sent to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Token VIP enviado com sucesso!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
