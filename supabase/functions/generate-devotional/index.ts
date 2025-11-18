import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RandomVerse {
  text: string;
  book_name: string;
  chapter: number;
  verse_number: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { date, count = 1 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const devotionalsGenerated = [];
    const startDate = date ? new Date(date) : new Date();

    for (let i = 0; i < count; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      console.log(`Verificando devocional para ${dateStr}...`);

      // Verificar se já existe devocional para esta data
      const { data: existing } = await supabaseClient
        .from('daily_devotionals')
        .select('id')
        .eq('devotional_date', dateStr)
        .maybeSingle();

      if (existing) {
        console.log(`Devocional já existe para ${dateStr}, pulando...`);
        continue;
      }

      // Buscar versículo aleatório da Bíblia
      const { data: randomVerse, error: verseError } = await supabaseClient
        .rpc('get_random_verse')
        .single() as { data: RandomVerse | null; error: any };

      if (verseError || !randomVerse) {
        console.error('Erro ao buscar versículo:', verseError);
        throw new Error('Nenhum versículo encontrado no banco de dados');
      }

      // Prompt para IA gerar devocional
      const systemPrompt = `Você é um escritor de devocionais cristãos evangélicos. 
Crie devocionais profundos, inspiradores e práticos para todas as idades.

SEMPRE retorne um JSON válido com a estrutura:
{
  "title": "Título cativante do devocional (max 60 chars)",
  "theme": "Tema principal em poucas palavras",
  "introduction": "Introdução contextual (150-200 palavras)",
  "reflection": "Reflexão profunda sobre o versículo (300-400 palavras)",
  "question": "Pergunta reflexiva para o leitor",
  "practical_applications": "3-5 aplicações práticas (formato lista com • )",
  "prayer": "Oração relacionada ao tema (100-150 palavras)"
}`;

      const userPrompt = `
Crie um devocional baseado neste versículo:

VERSÍCULO: "${randomVerse.text}"
REFERÊNCIA: ${randomVerse.book_name} ${randomVerse.chapter}:${randomVerse.verse_number}

O devocional deve:
- Ser relevante para o dia-a-dia moderno
- Incluir aplicações práticas
- Ter linguagem acessível mas profunda
- Inspirar crescimento espiritual
- Ser adequado para todas as idades

Retorne APENAS o JSON, sem texto adicional.`;

      console.log(`Gerando devocional para ${dateStr} com IA...`);

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro da API (${response.status}):`, errorText);
        
        if (response.status === 429) {
          throw new Error('Rate limit excedido. Tente novamente em 1 minuto.');
        }
        if (response.status === 402) {
          throw new Error('Créditos insuficientes. Adicione fundos no Lovable AI.');
        }
        throw new Error(`Erro da API Lovable: ${response.status} - ${errorText}`);
      }

      const aiResponse = await response.json();
      const content = aiResponse.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('IA não retornou conteúdo');
      }

      // Extrair JSON (pode vir com ```json wrapper)
      let devotionalData;
      try {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                         content.match(/```\s*([\s\S]*?)\s*```/) ||
                         [null, content];
        devotionalData = JSON.parse(jsonMatch[1]);
      } catch (parseError) {
        console.error('Erro ao parsear JSON:', content);
        throw new Error('IA retornou formato inválido');
      }

      // Validar estrutura
      const requiredFields = ['title', 'theme', 'introduction', 'reflection', 'question', 'practical_applications', 'prayer'];
      for (const field of requiredFields) {
        if (!devotionalData[field]) {
          throw new Error(`Campo obrigatório ausente: ${field}`);
        }
      }

      console.log(`Salvando devocional: ${devotionalData.title}`);

      // Inserir no banco
      const { data: newDevotional, error: insertError } = await supabaseClient
        .from('daily_devotionals')
        .insert({
          title: devotionalData.title,
          theme: devotionalData.theme,
          book_name: randomVerse.book_name,
          chapter: randomVerse.chapter,
          verse_start: randomVerse.verse_number,
          verse_end: null,
          verse_text: randomVerse.text,
          introduction: devotionalData.introduction,
          reflection: devotionalData.reflection,
          question: devotionalData.question,
          practical_applications: devotionalData.practical_applications,
          prayer: devotionalData.prayer,
          devotional_date: dateStr,
          available: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao inserir devocional:', insertError);
        throw insertError;
      }

      devotionalsGenerated.push({
        date: dateStr,
        title: devotionalData.title,
        id: newDevotional.id
      });

      console.log(`✓ Devocional gerado para ${dateStr}: ${devotionalData.title}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated: devotionalsGenerated.length,
        devotionals: devotionalsGenerated
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erro ao gerar devocional:', error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'Erro desconhecido',
        details: error?.toString() || 'Sem detalhes'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
