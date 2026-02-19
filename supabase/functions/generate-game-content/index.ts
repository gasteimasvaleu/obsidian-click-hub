import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, theme, difficulty, title } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating game content:', { type, title, theme, difficulty });

    let prompt = '';
    
    switch (type) {
      case 'quiz':
        prompt = `Você é um especialista em educação bíblica. Gere 10 perguntas de múltipla escolha sobre "${title}" focando especificamente em "${theme}" com nível de dificuldade "${difficulty}".

Certifique-se de que todas as perguntas estejam diretamente relacionadas ao tema "${title}".

Para cada pergunta, forneça:
- question: a pergunta em português
- options: array com 4 opções de resposta
- correctAnswer: índice da resposta correta (0-3)
- explanation: explicação breve da resposta
- verse: referência bíblica

Retorne APENAS um JSON válido neste formato exato:
{
  "questions": [
    {
      "question": "pergunta aqui",
      "options": ["opção 1", "opção 2", "opção 3", "opção 4"],
      "correctAnswer": 1,
      "explanation": "explicação",
      "verse": "Livro capítulo:versículo"
    }
  ]
}`;
        break;

      case 'memory':
        prompt = `Gere 12 pares de cards para um jogo da memória sobre "${title}" focando em "${theme}" com nível "${difficulty}".

Os cards devem ser específicos sobre "${title}".

Para cada par, forneça:
- card1: texto do primeiro card (nome/conceito)
- card2: texto do segundo card (definição/fato relacionado)
- category: categoria (AT ou NT)

Retorne APENAS um JSON válido neste formato exato:
{
  "pairs": [
    {
      "card1": "texto card 1",
      "card2": "texto card 2",
      "category": "AT"
    }
  ]
}`;
        break;

      case 'wordsearch':
        prompt = `Gere 15 palavras relacionadas a "${title}" (tema: "${theme}") para um caça-palavras de dificuldade "${difficulty}".

As palavras devem estar diretamente relacionadas a "${title}".

Retorne APENAS um JSON válido neste formato exato:
{
  "words": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6", "palavra7", "palavra8", "palavra9", "palavra10", "palavra11", "palavra12", "palavra13", "palavra14", "palavra15"],
  "hints": {
    "palavra1": "dica sobre a palavra1",
    "palavra2": "dica sobre a palavra2"
  }
}`;
        break;

      case 'puzzle':
        prompt = `Gere 6 cenas bíblicas sobre "${title}" (tema: "${theme}") para um quebra-cabeça de dificuldade "${difficulty}".

As cenas devem ser específicas de "${title}".

Para cada cena:
- title: título da cena
- description: descrição detalhada
- verse: referência bíblica
- pieces: número de peças (9 para Fácil, 16 para Médio, 25 para Difícil)

Retorne APENAS um JSON válido neste formato exato:
{
  "scenes": [
    {
      "title": "título",
      "description": "descrição",
      "verse": "referência",
      "pieces": 16
    }
  ]
}`;
        break;

      default:
        throw new Error('Invalid game type');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente que gera conteúdo bíblico educativo em formato JSON válido. SEMPRE retorne apenas JSON válido, sem texto adicional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let content;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      content = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(
      JSON.stringify({ content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in generate-game-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
