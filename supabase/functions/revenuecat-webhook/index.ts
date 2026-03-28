import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function isAnonymousId(id: string): boolean {
  return id.startsWith("$RCAnonymousID:");
}

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function resolveUserId(event: any): string | null {
  const appUserId = event.app_user_id;
  if (appUserId && !isAnonymousId(appUserId) && isValidUUID(appUserId)) {
    return appUserId;
  }
  const aliases: string[] = event.aliases ?? [];
  for (const alias of aliases) {
    if (!isAnonymousId(alias) && isValidUUID(alias)) {
      return alias;
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  const expectedSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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

    const resolvedUserId = resolveUserId(event);
    const rawAppUserId = event.app_user_id;
    const eventType = event.type;
    const expirationAt = event.expiration_at_ms
      ? new Date(event.expiration_at_ms).toISOString()
      : null;
    const productId = event.product_id;
    const originalTransactionId = event.original_transaction_id ?? null;

    console.log(
      `Processing: ${eventType} | raw: ${rawAppUserId} | resolved: ${resolvedUserId} | product: ${productId} | txn: ${originalTransactionId}`
    );

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

    if (resolvedUserId) {
      const { data: existingSub } = await supabase
        .from("subscribers")
        .select("id")
        .eq("user_id", resolvedUserId)
        .maybeSingle();

      if (existingSub) {
        await supabase
          .from("subscribers")
          .update({
            subscription_status: subscriptionStatus,
            subscription_expires_at: expirationAt,
            product_source: "revenuecat",
            transaction_id: originalTransactionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSub.id);
        console.log(`Updated subscriber for user ${resolvedUserId}`);
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", resolvedUserId)
          .maybeSingle();

        if (profile) {
          await supabase.from("subscribers").insert({
            user_id: resolvedUserId,
            email: profile.email,
            full_name: profile.full_name,
            subscription_status: subscriptionStatus,
            subscription_expires_at: expirationAt,
            product_source: "revenuecat",
            transaction_id: originalTransactionId,
          });
          console.log(`Inserted subscriber for user ${resolvedUserId}`);
        } else {
          await upsertOrphanRecord(supabase, originalTransactionId, {
            user_id: resolvedUserId,
            subscription_status: subscriptionStatus,
            subscription_expires_at: expirationAt,
            product_source: "revenuecat",
          });
        }
      }
    } else {
      console.log(`Anonymous purchase (${rawAppUserId}), creating orphan record`);
      await upsertOrphanRecord(supabase, originalTransactionId, {
        subscription_status: subscriptionStatus,
        subscription_expires_at: expirationAt,
        product_source: "revenuecat",
      });
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

async function upsertOrphanRecord(
  supabase: any,
  originalTransactionId: string | null,
  data: {
    user_id?: string;
    subscription_status: string;
    subscription_expires_at: string | null;
    product_source: string;
  }
) {
  if (originalTransactionId) {
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .eq("transaction_id", originalTransactionId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("subscribers")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      console.log(`Updated orphan record for txn ${originalTransactionId}`);
      return;
    }
  }

  const { error } = await supabase.from("subscribers").insert({
    email: `anonymous+${originalTransactionId ?? Date.now()}@revenuecat.local`,
    ...data,
    transaction_id: originalTransactionId,
  });

  if (error) {
    console.error("Failed to insert orphan record:", error);
  } else {
    console.log(`Created orphan record for txn ${originalTransactionId}`);
  }
}
