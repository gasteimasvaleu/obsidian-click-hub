import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Devotional {
  id: string;
  theme: string;
  book_name: string;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  verse_text: string;
  reflection: string;
  prayer: string;
}

interface Subscriber {
  id: string;
  phone: string;
  full_name: string | null;
}

function formatDate(): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  };
  return new Date().toLocaleDateString('pt-BR', options);
}

function formatVerseReference(devotional: Devotional): string {
  const { book_name, chapter, verse_start, verse_end } = devotional;
  if (verse_end && verse_end !== verse_start) {
    return `${book_name} ${chapter}:${verse_start}-${verse_end}`;
  }
  return `${book_name} ${chapter}:${verse_start}`;
}

function formatDevotionalMessage(devotional: Devotional): string {
  const date = formatDate();
  const verseRef = formatVerseReference(devotional);
  
  return `📿 *DEVOCIONAL DIÁRIO*
📅 ${date}

✨ *${devotional.theme}*

━━━━━━━━━━━━━━━━━━━━
📖 *VERSÍCULO DO DIA*
${verseRef}

_${devotional.verse_text}_

━━━━━━━━━━━━━━━━━━━━
💭 *REFLEXÃO*

${devotional.reflection}

━━━━━━━━━━━━━━━━━━━━
🙏 *ORAÇÃO*

${devotional.prayer}

━━━━━━━━━━━━━━━━━━━━

🌟 *MENSAGEM DE HOJE* 🌟

Bom dia, amigo(a)! Hoje quero te lembrar de algo poderoso:

1. 🙏 Confie em Deus como sua fonte de esperança.
2. 😊 Permita que Ele encha seu coração de alegria.
3. 🕊️ Receba Sua paz que acalma qualquer tempestade.
4. 💪 Deixe o Espírito Santo renovar suas forças a cada instante.

Quando você deposita sua confiança em Deus, algo maravilhoso acontece:

➡️ Sua alegria cresce mesmo em dias difíceis.
➡️ Sua paz interior afasta a ansiedade e o medo.
➡️ Você começa a transbordar esperança e pode inspirar quem está ao seu lado!

Hoje, reserve um momento para fechar os olhos, respirar fundo e dizer:

_"Senhor, eu confio em Ti. Enche-me de alegria, paz e esperança!"_

Que essa oração simples traga luz ao seu dia e faça seu coração vibrar de fé. Lembre-se: você nunca está sozinho(a). O Deus da esperança caminha com você, fortalecendo seus passos e enchendo sua vida de motivos para sorrir!

Tenha um dia abençoado! 🙌✨

━━━━━━━━━━━━━━━━━━━━

💌 Compartilhe com alguém que precisa de um sopro de esperança hoje!

━━━━━━━━━━━━━━━━━━━━

👉 Leia o devocional completo no app:
https://obsidian-click-hub.lovable.app/devocional`;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ZAPI_INSTANCE = Deno.env.get('ZAPI_INSTANCE');
    const ZAPI_TOKEN = Deno.env.get('ZAPI_TOKEN');
    const ZAPI_CLIENT_TOKEN = Deno.env.get('ZAPI_CLIENT_TOKEN');

    if (!ZAPI_INSTANCE || !ZAPI_TOKEN || !ZAPI_CLIENT_TOKEN) {
      console.error('Missing Z-API credentials');
      return new Response(
        JSON.stringify({ error: 'Z-API credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get today's date in São Paulo timezone
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    console.log(`Fetching devotional for date: ${today}`);

    // Fetch today's devotional
    const { data: devotional, error: devotionalError } = await supabase
      .from('daily_devotionals')
      .select('id, theme, book_name, chapter, verse_start, verse_end, verse_text, reflection, prayer')
      .eq('devotional_date', today)
      .eq('available', true)
      .single();

    if (devotionalError || !devotional) {
      console.error('No devotional found for today:', devotionalError);
      return new Response(
        JSON.stringify({ error: 'No devotional available for today', details: devotionalError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found devotional: ${devotional.theme}`);

    // Fetch subscribers with WhatsApp opt-in
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('id, phone, full_name')
      .eq('whatsapp_optin', true)
      .eq('subscription_status', 'active')
      .not('phone', 'is', null);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscribers', details: subscribersError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No subscribers with WhatsApp opt-in found');
      return new Response(
        JSON.stringify({ message: 'No subscribers to send to', sent: 0, failed: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${subscribers.length} subscribers to send to`);

    const message = formatDevotionalMessage(devotional as Devotional);
    const zapiUrl = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

    let sent = 0;
    let failed = 0;
    const errors: Array<{ phone: string; error: string }> = [];

    for (const subscriber of subscribers as Subscriber[]) {
      try {
        // Format phone number
        let phone = subscriber.phone.replace(/\D/g, '');
        if (!phone.startsWith('55')) {
          phone = '55' + phone;
        }

        console.log(`Sending to: ${phone}`);

        const response = await fetch(zapiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Client-Token': ZAPI_CLIENT_TOKEN,
          },
          body: JSON.stringify({ phone, message }),
        });

        if (response.ok) {
          sent++;
          console.log(`✓ Sent to ${phone}`);
        } else {
          const errorResult = await response.json();
          failed++;
          errors.push({ phone, error: JSON.stringify(errorResult) });
          console.error(`✗ Failed to send to ${phone}:`, errorResult);
        }

        // Rate limiting: wait 1.5 seconds between messages
        await delay(1500);
      } catch (error: unknown) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ phone: subscriber.phone, error: errorMessage });
        console.error(`✗ Error sending to ${subscriber.phone}:`, error);
      }
    }

    const result = {
      message: 'Daily devotional WhatsApp sending completed',
      devotional: devotional.theme,
      date: today,
      total: subscribers.length,
      sent,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('Sending completed:', result);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in send-daily-devotional-whatsapp:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
