import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key);

const email = 'bernardorodrigues.13j@gmail.com';
const password = '685213';
const fullName = 'Bernardo';

const { data, error } = await sb.auth.admin.createUser({
  email, password, email_confirm: true,
  user_metadata: { full_name: fullName },
});
if (error) { console.error('createUser:', error); process.exit(1); }
const userId = data.user.id;
console.log('user:', userId);

const expires = new Date(); expires.setFullYear(expires.getFullYear() + 1);
const { error: sErr } = await sb.from('subscribers').upsert({
  email: email.toLowerCase(),
  full_name: fullName,
  user_id: userId,
  subscription_status: 'active',
  product_source: 'vip',
  subscription_expires_at: expires.toISOString(),
}, { onConflict: 'email' });
if (sErr) { console.error('subscriber:', sErr); process.exit(1); }
console.log('VIP ok, expires:', expires.toISOString());
