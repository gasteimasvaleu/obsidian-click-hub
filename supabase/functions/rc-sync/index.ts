import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function fetchRC(userId: string, key: string | undefined) {
  if (!key) return null;
  const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!r.ok) { console.error("RC error", r.status); return null; }
  const data = await r.json();
  const ents = data?.subscriber?.entitlements ?? {};
  const now = Date.now();
  let best: { expires: string | null; product: string } | null = null;
  for (const e of Object.values<any>(ents)) {
    const exp = e.expires_date ? Date.parse(e.expires_date) : Infinity;
    if (exp > now && (!best || exp > (best.expires ? Date.parse(best.expires) : Infinity))) {
      best = { expires: e.expires_date ?? null, product: e.product_identifier };
    }
  }
  if (!best) return null;
  const sub = data?.subscriber?.subscriptions?.[best.product];
  return { ...best, txn: sub?.original_transaction_id ?? sub?.store_transaction_id ?? null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: claims, error } = await userClient.auth.getClaims(auth.replace("Bearer ", ""));
    if (error || !claims?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;
    const email = (claims.claims.email as string) ?? null;

    let platform = "ios";
    try { const b = await req.json(); if (b?.platform === "android") platform = "android"; } catch { /* empty */ }
    const ios = Deno.env.get("REVENUECAT_SECRET_API_KEY_IOS");
    const android = Deno.env.get("REVENUECAT_SECRET_API_KEY_ANDROID");
    const [first, second] = platform === "android" ? [android, ios] : [ios, android];
    const rc = (await fetchRC(userId, first)) ?? (await fetchRC(userId, second));

    if (!rc) return json({ active: false });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: rows } = await admin.from("subscribers").select("id, product_source").eq("user_id", userId);
    if (rows?.some((r) => r.product_source === "vip")) return json({ active: true, vip: true });

    const payload = {
      subscription_status: "active" as const,
      subscription_expires_at: rc.expires,
      product_source: "revenuecat",
      transaction_id: rc.txn,
      updated_at: new Date().toISOString(),
    };
    if (rows && rows.length) {
      await admin.from("subscribers").update(payload).eq("id", rows[0].id);
    } else {
      const { data: profile } = await admin.from("profiles").select("email, full_name").eq("id", userId).maybeSingle();
      await admin.from("subscribers").insert({
        ...payload, user_id: userId, email: profile?.email ?? email ?? `${userId}@user.local`, full_name: profile?.full_name ?? null,
      });
    }
    return json({ active: true, expiresAt: rc.expires });
  } catch (e) {
    console.error("rc-sync error", e);
    return json({ error: "internal" }, 500);
  }
});
