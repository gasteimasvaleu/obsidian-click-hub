import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface HotmartWebhookPayload {
  event: string;
  data: {
    buyer: {
      email: string;
      name: string;
      phone?: string;
    };
    purchase: {
      transaction: string;
      product: {
        id: string;
        name: string;
      };
      offer?: {
        code: string;
      };
    };
  };
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: HotmartWebhookPayload = await req.json();
    console.log("Received Hotmart webhook:", JSON.stringify(payload, null, 2));

    const event = payload.event;

    if (event === "PURCHASE_COMPLETE" || event === "PURCHASE_APPROVED") {
      const { buyer, purchase } = payload.data;

      // Check if subscriber already exists
      const { data: existingSubscriber } = await supabase
        .from("subscribers")
        .select("id, subscription_status")
        .eq("email", buyer.email)
        .maybeSingle();

      if (existingSubscriber) {
        // Se já está ativo, é uma RENOVAÇÃO - apenas atualizar timestamp
        if (existingSubscriber.subscription_status === "active") {
          const { error: updateError } = await supabase
            .from("subscribers")
            .update({
              hotmart_transaction_id: purchase.transaction,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSubscriber.id);

          if (updateError) {
            console.error("Error updating subscriber on renewal:", updateError);
            throw updateError;
          }

          console.log("Renewal processed for active subscriber:", buyer.email);
          return new Response(
            JSON.stringify({ success: true, message: "Renewal processed - no email sent" }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Se status é cancelled/expired/pending, reativar com novo token
        const signupToken = generateToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

        const { error: updateError } = await supabase
          .from("subscribers")
          .update({
            full_name: buyer.name,
            phone: buyer.phone || null,
            hotmart_transaction_id: purchase.transaction,
            hotmart_product_id: purchase.product.id,
            hotmart_offer_id: purchase.offer?.code || null,
            subscription_status: "pending",
            signup_token: signupToken,
            signup_token_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSubscriber.id);

        if (updateError) {
          console.error("Error updating subscriber:", updateError);
          throw updateError;
        }

        await sendSignupEmail(buyer.email, buyer.name, signupToken);
        console.log("Reactivation email sent to:", buyer.email);

        return new Response(
          JSON.stringify({ success: true, message: "Reactivation processed successfully" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      // Create new subscriber
      const signupToken = generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      const { error: insertError } = await supabase
        .from("subscribers")
        .insert({
          email: buyer.email,
          full_name: buyer.name,
          phone: buyer.phone || null,
          hotmart_transaction_id: purchase.transaction,
          hotmart_product_id: purchase.product.id,
          hotmart_offer_id: purchase.offer?.code || null,
          subscription_status: "pending",
          signup_token: signupToken,
          signup_token_expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error("Error creating subscriber:", insertError);
        throw insertError;
      }

      await sendSignupEmail(buyer.email, buyer.name, signupToken);
      console.log("Created new subscriber:", buyer.email);

      return new Response(
        JSON.stringify({ success: true, message: "Purchase processed successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (event === "PURCHASE_CANCELED" || event === "SUBSCRIPTION_CANCELLATION") {
      const { purchase } = payload.data;

      const { error: cancelError } = await supabase
        .from("subscribers")
        .update({
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("hotmart_transaction_id", purchase.transaction);

      if (cancelError) {
        console.error("Error cancelling subscription:", cancelError);
        throw cancelError;
      }

      console.log("Cancelled subscription for transaction:", purchase.transaction);

      return new Response(
        JSON.stringify({ success: true, message: "Cancellation processed successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Unknown event, just acknowledge
    console.log("Unhandled event type:", event);
    return new Response(
      JSON.stringify({ success: true, message: "Event received" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

async function sendSignupEmail(email: string, name: string, token: string): Promise<void> {
  const appUrl = Deno.env.get("APP_URL") || "https://obsidian-click-hub.lovable.app";
  const signupUrl = `${appUrl}/cadastro?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: "Biblia Toon Kids <noreply@bibliatoonkids.com.br>",
      to: [email],
      subject: "🎉 Complete seu cadastro - Biblia Toon Kids",
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
              🎉 Bem-vindo à Biblia Toon Kids!
            </h1>
            
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
              Olá, <strong>${name}</strong>!
            </p>
            
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
              Sua compra foi confirmada com sucesso! Agora você só precisa completar seu cadastro para ter acesso a todo o conteúdo exclusivo da plataforma.
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
              Se você não realizou esta compra, pode ignorar este email.
            </p>
            
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              Caso o botão não funcione, copie e cole este link no navegador:<br>
              <span style="color: #a855f7; word-break: break-all;">${signupUrl}</span>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Signup email sent to:", email);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
