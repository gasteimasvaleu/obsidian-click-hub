import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Check if an ID is a RevenueCat anonymous ID
 */
function isAnonymousId(id: string): boolean {
  return id.startsWith("$RCAnonymousID:");
}

/**
 * Check if a string looks like a valid UUID (Supabase user ID)
 */
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Extract a valid Supabase UUID from RevenueCat event data.
 * Priority: app_user_id (if not anonymous) → aliases array → null
 */
function resolveUserId(event: any): string | null {
  const appUserId = event.app_user_id;

  // If the primary ID is a valid UUID, use it directly
  if (appUserId && !isAnonymousId(appUserId) && isValidUUID(appUserId)) {
    return appUserId;
  }

  // Check aliases for a valid UUID
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

  // Validate Authorization header
  const authHeader = req.headers.get("Authorization");
  const expectedSecret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET");

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    console.warn("Unauthorized webhook call attempt");
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
      `Processing event: ${eventType} for raw_id: ${rawAppUserId}, resolved_user_id: ${resolvedUserId}, product: ${productId}, txn: ${originalTransactionId}`
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

    if (resolvedUserId) {
      // ── We have a real Supabase UUID ──
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
            hotmart_product_id: `revenuecat:${productId}`,
            hotmart_transaction_id: originalTransactionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSub.id);
        console.log(`Updated existing subscriber for user ${resolvedUserId}`);
      } else {
        // Try to get profile info
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
            hotmart_product_id: `revenuecat:${productId}`,
            hotmart_transaction_id: originalTransactionId,
          });
          console.log(`Inserted new subscriber for user ${resolvedUserId}`);
        } else {
          console.log(`No profile found for resolved user ${resolvedUserId}, creating orphan record`);
          // Still create a record without email (orphan-like, but with user_id for future linking)
          await upsertOrphanRecord(supabase, originalTransactionId, {
            user_id: resolvedUserId,
            subscription_status: subscriptionStatus,
            subscription_expires_at: expirationAt,
            hotmart_product_id: `revenuecat:${productId}`,
          });
        }
      }
    } else {
      // ── Anonymous ID with no UUID in aliases → create orphan record ──
      console.log(`Anonymous purchase (${rawAppUserId}), creating orphan record with txn: ${originalTransactionId}`);
      await upsertOrphanRecord(supabase, originalTransactionId, {
        subscription_status: subscriptionStatus,
        subscription_expires_at: expirationAt,
        hotmart_product_id: `revenuecat:${productId}`,
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

/**
 * Insert or update an orphan subscriber record keyed by original_transaction_id.
 * These records have no user_id and will be claimed by syncSubscriptionAfterLogin.
 */
async function upsertOrphanRecord(
  supabase: any,
  originalTransactionId: string | null,
  data: {
    user_id?: string;
    subscription_status: string;
    subscription_expires_at: string | null;
    hotmart_product_id: string;
  }
) {
  if (originalTransactionId) {
    // Check if an orphan with this transaction already exists
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .eq("hotmart_transaction_id", originalTransactionId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("subscribers")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      console.log(`Updated orphan record ${existing.id} for txn ${originalTransactionId}`);
      return;
    }
  }

  // Insert new orphan record (email is required, use placeholder for anonymous)
  const { error } = await supabase.from("subscribers").insert({
    email: `anonymous+${originalTransactionId ?? Date.now()}@revenuecat.local`,
    ...data,
    hotmart_transaction_id: originalTransactionId,
  });

  if (error) {
    console.error("Failed to insert orphan record:", error);
  } else {
    console.log(`Created orphan record for txn ${originalTransactionId}`);
  }
}
