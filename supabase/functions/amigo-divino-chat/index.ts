import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const SYSTEM_PROMPT = `Você é o "Amigo Divino", o conselheiro espiritual do aplicativo BíbliaToon Club, um app católico para famílias e crianças.

Sua personalidade:
- Acolhedor, carinhoso e paciente, como um amigo sábio da família
- Profundamente alinhado à doutrina da Igreja Católica (Catecismo, Tradição e Magistério)
- Especializado em orientar pais na educação cristã dos filhos

Suas diretrizes:
- Responda sempre em português brasileiro
- Cite passagens bíblicas quando apropriado, preferindo a tradução Ave Maria
- Dê conselhos práticos e aplicáveis ao dia a dia da família
- Nunca contradiga o ensinamento da Igreja Católica
- Se perguntarem sobre temas fora do escopo espiritual/familiar, redirecione gentilmente
- Use formatação markdown leve quando ajudar na leitura (listas, negrito)
- Seja conciso: respostas de 2 a 4 parágrafos curtos, salvo quando o tema pedir mais profundidade`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(
        JSON.stringify({ error: 'Mensagem inválida.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Serviço de IA não configurado.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const safeHistory: ChatMessage[] = Array.isArray(history)
      ? history
          .filter((m: ChatMessage) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .slice(-20)
      : []

    const input = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...safeHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ]

    const gatewayResponse = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      signal: req.signal,
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': apiKey,
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        input,
        stream: true,
        store: false,
        reasoning: { effort: 'low', summary: 'auto' },
        include: ['reasoning.encrypted_content'],
      }),
    })

    if (!gatewayResponse.ok) {
      const status = gatewayResponse.status
      console.error('Gateway error:', status, await gatewayResponse.text())

      if (status === 429) {
        return new Response(
          JSON.stringify({ error: 'Muitas mensagens ao mesmo tempo. Aguarde um instante e tente novamente.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: 'Serviço temporariamente indisponível. Tente novamente mais tarde.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      return new Response(
        JSON.stringify({ error: 'Não consegui processar sua mensagem agora. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Consume the SSE stream and accumulate the final text
    const reader = gatewayResponse.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let outputText = ''
    let streamError: string | null = null

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''

      for (const event of events) {
        const dataLines = event
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
        for (const data of dataLines) {
          if (!data || data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'response.output_text.delta' && typeof parsed.delta === 'string') {
              outputText += parsed.delta
            } else if (parsed.type === 'response.failed' || parsed.type === 'error') {
              streamError = parsed.error?.message ?? 'Erro na geração da resposta'
            }
          } catch {
            // ignore malformed SSE chunks
          }
        }
      }
    }

    if (streamError) {
      console.error('Stream error:', streamError)
      return new Response(
        JSON.stringify({ error: 'Não consegui processar sua mensagem agora. Tente novamente.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!outputText.trim()) {
      return new Response(
        JSON.stringify({ error: 'Não consegui formular uma resposta. Tente reformular sua mensagem.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ response: outputText }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    if (req.signal.aborted && error instanceof Error && error.name === 'AbortError') {
      return new Response(null, { status: 499, headers: corsHeaders })
    }
    console.error('amigo-divino-chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro inesperado. Tente novamente.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
