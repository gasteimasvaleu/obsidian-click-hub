import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("RevenueCat webhook received:", JSON.stringify(body));

    const event = body.event;
    if (!event) {
      return new Response(JSON.stringify({ error: "No event in payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const appUserId = event.app_user_id; // This is the Supabase user ID
    const eventType = event.type;
    const expirationAt = event.expiration_at_ms
      ? new Date(event.expiration_at_ms).toISOString()
      : null;
    const productId = event.product_id;

    console.log(
      `Processing event: ${eventType} for user: ${appUserId}, product: ${productId}`
    );

    // Map RevenueCat event types to subscription status
    let subscriptionStatus: string;
    switch (eventType) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "PRODUCT_CHANGE":
      case "UNCANCELLATION":
        subscriptionStatus = "active";
        break;
      case "CANCELLATION":
        subscriptionStatus = "cancelled";
        break;
      case "EXPIRATION":
        subscriptionStatus = "expired";
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Look up the subscriber by user_id
    const { data: existingSub } = await supabase
      .from("subscribers")
      .select("id")
      .eq("user_id", appUserId)
      .maybeSingle();

    if (existingSub) {
      // Update existing subscriber
      await supabase
        .from("subscribers")
        .update({
          subscription_status: subscriptionStatus,
          subscription_expires_at: expirationAt,
          hotmart_product_id: `revenuecat:${productId}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSub.id);
    } else if (appUserId) {
      // Try to get user email from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", appUserId)
        .maybeSingle();

      if (profile) {
        await supabase.from("subscribers").insert({
          user_id: appUserId,
          email: profile.email,
          full_name: profile.full_name,
          subscription_status: subscriptionStatus,
          subscription_expires_at: expirationAt,
          hotmart_product_id: `revenuecat:${productId}`,
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("RevenueCat webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
