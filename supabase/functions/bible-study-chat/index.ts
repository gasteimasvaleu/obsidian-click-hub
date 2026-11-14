import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const BASE = `Você é o guia de estudo bíblico do aplicativo católico BíbliaToon Club, com coração de catequista, conduzindo um estudo bíblico.
- Fiel à doutrina da Igreja Católica (Catecismo, Tradição e Magistério). Nunca a contradiga.
- Cite a Bíblia na tradução Ave Maria (73 livros), sempre com a referência no formato "Livro capítulo,versículo" (ex.: João 3,16).
- Responda em português do Brasil, com markdown leve (negrito, listas curtas).
- Se o assunto fugir da fé, da Bíblia ou da vida cristã, redirecione com gentileza para o estudo.
- Termine com uma pergunta curta que convide a continuar o estudo.`

const AUD: Record<string, string> = {
  kids: `Público: CRIANÇAS de 6 a 11 anos. Use frases curtas, palavras simples, exemplos do dia a dia de criança e tom alegre e carinhoso. No máximo 3 parágrafos curtos.`,
  parents: `Público: PAIS E CATEQUISTAS. Aprofunde o contexto histórico e teológico, cite o Catecismo (CIC §) quando couber e dê dicas de como ensinar o tema às crianças. Até 5 parágrafos.`,
}

const Body = z.object({
  study_id: z.string().uuid(),
  mode: z.enum(['chat', 'quiz']).default('chat'),
  message: z.string().trim().min(1).max(2000).optional(),
})

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const QUIZ_SCHEMA = {
  type: 'json_schema',
  name: 'quiz',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['perguntas'],
    properties: {
      perguntas: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['pergunta', 'alternativas', 'correta', 'explicacao'],
          properties: {
            pergunta: { type: 'string' },
            alternativas: { type: 'array', items: { type: 'string' } },
            correta: { type: 'integer' },
            explicacao: { type: 'string' },
          },
        },
      },
    },
  },
}

async function callGateway(apiKey: string, input: unknown[], signal: AbortSignal, format?: unknown) {
  const res = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'fetch' },
    body: JSON.stringify({
      model: 'openai/gpt-6-astra',
      input,
      stream: true,
      store: false,
      reasoning: { effort: 'low', summary: 'auto' },
      include: ['reasoning.encrypted_content'],
      ...(format ? { text: { format } } : {}),
    }),
  })
  if (!res.ok) {
    console.error('Gateway error', res.status, await res.text())
    return { status: res.status, text: '' }
  }
  const reader = res.body!.getReader()
  const dec = new TextDecoder()
  let buf = '', out = '', failed = false
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const evs = buf.split('\n\n'); buf = evs.pop() ?? ''
    for (const ev of evs) for (const line of ev.split('\n')) {
      if (!line.startsWith('data:')) continue
      const d = line.slice(5).trim(); if (!d || d === '[DONE]') continue
      try {
        const p = JSON.parse(d)
        if (p.type === 'response.output_text.delta' && typeof p.delta === 'string') out += p.delta
        else if (p.type === 'response.failed' || p.type === 'error') failed = true
      } catch { /* ignore */ }
    }
  }
  return { status: failed ? 500 : 200, text: out }
}

function gatewayError(status: number) {
  if (status === 429) return json({ error: 'Muitas mensagens ao mesmo tempo. Aguarde um instante e tente de novo.' }, 429)
  if (status === 402) return json({ error: 'O estudo com IA está indisponível no momento. Tente mais tarde.' }, 402)
  if (status === 403) return json({ error: 'O estudo com IA não está disponível agora.' }, 403)
  return json({ error: 'Não consegui responder agora. Tente novamente.' }, 500)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const auth = req.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) return json({ error: 'Faça login para estudar.' }, 401)
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: auth } },
    })
    const { data: claims, error: authErr } = await supabase.auth.getClaims(auth.slice(7))
    const userId = claims?.claims?.sub
    if (authErr || !userId) return json({ error: 'Sessão expirada. Entre novamente.' }, 401)

    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) return json({ error: 'Pedido inválido.' }, 400)
    const { study_id, mode, message } = parsed.data
    if (mode === 'chat' && !message) return json({ error: 'Escreva uma mensagem.' }, 400)

    const { data: study } = await supabase.from('bible_studies').select('*').eq('id', study_id).maybeSingle()
    if (!study) return json({ error: 'Estudo não encontrado.' }, 404)

    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) return json({ error: 'Serviço de IA não configurado.' }, 500)

    const { data: hist } = await supabase.from('bible_study_messages')
      .select('role, content').eq('study_id', study_id).order('created_at').limit(60)
    const history = (hist ?? []).map((m) => ({ role: m.role, content: m.content }))

    const ctx = study.source_type === 'theme' ? `O estudo é sobre o tema: ${study.source_ref}.`
      : study.source_type === 'passage' ? `O estudo é sobre o trecho bíblico: ${study.source_ref}.`
      : `O estudo começou com uma pergunta livre.`
    const system = `${BASE}\n${AUD[study.audience] ?? AUD.kids}\n${ctx}`

    if (mode === 'quiz') {
      const input = [
        { role: 'system', content: `${system}\nAgora crie uma revisão do que foi estudado: de 3 a 5 perguntas de múltipla escolha, cada uma com exatamente 4 alternativas, "correta" é o índice (0 a 3) da alternativa certa e "explicacao" é uma frase curta. Adeque ao público.` },
        ...history,
        { role: 'user', content: 'Crie as perguntinhas de revisão deste estudo.' },
      ]
      const r = await callGateway(apiKey, input, req.signal, QUIZ_SCHEMA)
      if (r.status !== 200 || !r.text) return gatewayError(r.status)
      try {
        const q = JSON.parse(r.text)
        q.perguntas = (q.perguntas ?? []).filter((p: any) => Array.isArray(p.alternativas) && p.alternativas.length >= 2 && p.correta >= 0 && p.correta < p.alternativas.length)
        return json(q)
      } catch {
        return json({ error: 'Não consegui montar as perguntas. Tente de novo.' }, 500)
      }
    }

    const input = [{ role: 'system', content: system }, ...history, { role: 'user', content: message! }]
    const r = await callGateway(apiKey, input, req.signal)
    if (r.status !== 200 || !r.text.trim()) return gatewayError(r.status)

    const { error: insErr } = await supabase.from('bible_study_messages').insert([
      { study_id, user_id: userId, role: 'user', content: message! },
      { study_id, user_id: userId, role: 'assistant', content: r.text },
    ])
    if (insErr) console.error('save error', insErr)
    await supabase.from('bible_studies').update({ updated_at: new Date().toISOString() }).eq('id', study_id)

    return json({ response: r.text })
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders })
    console.error('bible-study-chat', e)
    return json({ error: 'Erro inesperado. Tente novamente.' }, 500)
  }
})
