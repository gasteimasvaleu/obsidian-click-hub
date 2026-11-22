import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const Body = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })

const SYSTEM = `Você é catequista do aplicativo católico BíbliaToon Club. Fiel à doutrina da Igreja Católica.
Escreva uma "Reflexão para a Família" sobre o Evangelho do dia: 2 parágrafos curtos, linguagem simples que pais e crianças entendam, e termine com uma pergunta para a família conversar e uma ação prática do dia. Português do Brasil, sem títulos, sem emojis.`

async function reflect(apiKey: string, gospel: string, signal: AbortSignal): Promise<string | null> {
  const res = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'fetch' },
    body: JSON.stringify({
      model: 'openai/gpt-6-astra', stream: true, store: false,
      reasoning: { effort: 'low', summary: 'auto' }, include: ['reasoning.encrypted_content'],
      input: [{ role: 'system', content: SYSTEM }, { role: 'user', content: gospel }],
    }),
  })
  if (!res.ok) { console.error('gateway', res.status, await res.text()); return null }
  const reader = res.body!.getReader(); const dec = new TextDecoder()
  let buf = '', out = ''
  while (true) {
    const { done, value } = await reader.read(); if (done) break
    buf += dec.decode(value, { stream: true })
    const evs = buf.split('\n\n'); buf = evs.pop() ?? ''
    for (const ev of evs) for (const line of ev.split('\n')) {
      if (!line.startsWith('data:')) continue
      try { const p = JSON.parse(line.slice(5).trim()); if (p.type === 'response.output_text.delta') out += p.delta; if (p.type === 'response.failed') return null } catch { /* */ }
    }
  }
  return out.trim() || null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const auth = req.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) return json({ error: 'Faça login.' }, 401)
    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
    const { data: claims } = await userClient.auth.getClaims(auth.slice(7))
    if (!claims?.claims?.sub) return json({ error: 'Sessão expirada.' }, 401)

    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) return json({ error: 'Data inválida.' }, 400)
    const { date } = parsed.data
    const diff = Math.abs(new Date(`${date}T12:00:00Z`).getTime() - Date.now()) / 86400000
    if (!(diff <= 8)) return json({ error: 'Só é possível ver até 7 dias antes ou depois.' }, 400)

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: cached } = await admin.from('daily_liturgy').select('*').eq('date', date).maybeSingle()
    if (cached?.reflection) return json(cached)

    let row = cached
    if (!row) {
      const [y, m, d] = date.split('-').map(Number)
      const r = await fetch(`https://liturgia.up.railway.app/v2/?dia=${d}&mes=${m}&ano=${y}`)
      if (!r.ok) return json({ error: 'Liturgia indisponível no momento. Tente mais tarde.' }, 502)
      const api = await r.json()
      row = { date, title: api.liturgia ?? 'Liturgia do dia', color: api.cor ?? 'Verde', readings: api.leituras ?? {}, reflection: null }
    }
    const ev = Array.isArray(row.readings?.evangelho) ? row.readings.evangelho[0] : row.readings?.evangelho
    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (ev?.texto && apiKey) row.reflection = await reflect(apiKey, `${row.title}\n${ev.referencia}\n${ev.texto}`, req.signal)
    const { error } = await admin.from('daily_liturgy').upsert(row)
    if (error) console.error('save', error)
    return json(row)
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders })
    console.error('daily-liturgy', e)
    return json({ error: 'Erro inesperado.' }, 500)
  }
})
