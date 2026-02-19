import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { verse_id } = await req.json();

    if (!verse_id) {
      return new Response(
        JSON.stringify({ error: 'verse_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for updates
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch verse with book and chapter info
    const { data: verse, error: verseError } = await supabase
      .from('bible_verses')
      .select(`
        id,
        verse_number,
        text,
        theological_comment,
        chapter_id
      `)
      .eq('id', verse_id)
      .single();

    if (verseError || !verse) {
      console.error('Error fetching verse:', verseError);
      return new Response(
        JSON.stringify({ error: 'Versículo não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If comment already exists, return it
    if (verse.theological_comment) {
      console.log('Returning cached comment for verse:', verse_id);
      return new Response(
        JSON.stringify({ comment: verse.theological_comment, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch chapter and book info for reference
    const { data: chapter, error: chapterError } = await supabase
      .from('bible_chapters')
      .select(`
        chapter_number,
        book_id
      `)
      .eq('id', verse.chapter_id)
      .single();

    if (chapterError || !chapter) {
      console.error('Error fetching chapter:', chapterError);
      return new Response(
        JSON.stringify({ error: 'Capítulo não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: book, error: bookError } = await supabase
      .from('bible_books')
      .select('name')
      .eq('id', chapter.book_id)
      .single();

    if (bookError || !book) {
      console.error('Error fetching book:', bookError);
      return new Response(
        JSON.stringify({ error: 'Livro não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reference = `${book.name} ${chapter.chapter_number}:${verse.verse_number}`;
    console.log('Generating comment for:', reference);

    // Generate comment using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const prompt = `Você é um teólogo evangélico experiente. Crie um comentário teológico breve (máximo 120 palavras) sobre o versículo:

"${verse.text}" - ${reference}

O comentário deve:
- Explicar brevemente o contexto histórico/literário
- Destacar o significado espiritual e teológico
- Incluir uma aplicação prática para hoje
- Usar linguagem acessível para famílias e crianças
- Ter tom edificante, acolhedor e cristão

Responda APENAS com o comentário, sem títulos ou formatação especial.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos de IA esgotados.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedComment = aiData.choices?.[0]?.message?.content?.trim();

    if (!generatedComment) {
      throw new Error('Resposta da IA vazia');
    }

    console.log('Generated comment successfully, saving to database...');

    // Save comment to database
    const { error: updateError } = await supabase
      .from('bible_verses')
      .update({ theological_comment: generatedComment })
      .eq('id', verse_id);

    if (updateError) {
      console.error('Error saving comment:', updateError);
      // Return the comment anyway, just won't be cached
      return new Response(
        JSON.stringify({ comment: generatedComment, cached: false, saveError: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Comment saved successfully for verse:', verse_id);

    return new Response(
      JSON.stringify({ comment: generatedComment, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-verse-comment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro ao gerar comentário' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
