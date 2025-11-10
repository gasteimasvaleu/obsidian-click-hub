import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { formData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    console.log('Gerando guia para:', formData.nome);

    const systemPrompt = `Você é um especialista em educação cristã infantil e psicologia do desenvolvimento. Sua missão é criar guias SUPER COMPLETOS e personalizados para pais ensinarem a Bíblia aos filhos.

SEMPRE retorne um JSON válido com as seguintes seções:
{
  "perfil_crianca": "string - Resumo personalizado da criança",
  "contexto_passagem": "string - Contexto simplificado e histórico da passagem",
  "objetivos": ["array de 3-5 objetivos de aprendizagem claros"],
  "roteiro_conversa": [
    {
      "passo": 1,
      "titulo": "string",
      "descricao": "string detalhada",
      "tempo_estimado": "string (ex: 5 minutos)"
    }
  ],
  "atividades_praticas": [
    {
      "titulo": "string",
      "descricao": "string detalhada",
      "materiais": ["array de materiais necessários"],
      "duracao": "string (ex: 15 minutos)"
    }
  ],
  "frases_prontas": {
    "iniciar": ["array de 3-4 frases para começar a conversa"],
    "explicar": ["array de 3-4 frases para explicar conceitos"],
    "perguntas": ["array de 3-4 perguntas reflexivas"]
  },
  "desafios_solucoes": [
    {
      "desafio": "string - possível desafio",
      "solucao": "string - solução prática"
    }
  ],
  "plano_reforco": {
    "primeira_semana": ["array de atividades para primeira semana"],
    "proximos_dias": ["array de atividades para os próximos dias"]
  },
  "recursos_extras": [
    {
      "tipo": "Vídeo|Livro|Jogo|App",
      "titulo": "string",
      "descricao": "string"
    }
  ],
  "dicas_personalizadas": ["array de 3-5 dicas específicas baseadas no perfil"]
}`;

    const userPrompt = `
INFORMAÇÕES DA CRIANÇA:
- Nome: ${formData.nome}
- Sexo: ${formData.sexo}
- Idade: ${formData.idade} anos
- Comportamento: ${formData.comportamento.join(', ')}
- Personalidade: ${formData.personalidade.join(', ')}
- Nível Bíblico: ${formData.nivelBiblico}
- Contexto do Ensino: ${formData.contexto}
${formData.desafio ? `- Desafio Específico: ${formData.desafio}` : ''}

PASSAGEM BÍBLICA A ENSINAR: ${formData.passagem}

Gere um guia SUPER COMPLETO, prático e personalizado. Seja específico e use o nome da criança. Considere a idade e características comportamentais para adaptar a linguagem e atividades. Retorne APENAS o JSON, sem texto adicional.`;

    console.log('Chamando Lovable AI...');

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Muitas solicitações. Tente novamente em 1 minuto.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Limite de uso atingido. Adicione créditos em Settings.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Erro da API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Resposta da IA recebida, parseando JSON...');

    // Extrair JSON da resposta (pode vir com markdown)
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    const guide = JSON.parse(jsonContent);
    
    console.log('Guia gerado com sucesso!');

    return new Response(
      JSON.stringify({ guide }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao gerar guia:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro ao gerar guia. Tente novamente.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
