

## Criar Cron Job para Geração Automática do Devocional às 5:30 BRT

### Objetivo

Criar um **segundo cron job** no Supabase que gera o devocional do dia às 5:30 da manhã, garantindo que o devocional esteja pronto no banco de dados **antes** do cron de envio do WhatsApp (6:00 BRT).

### Cronograma de Execução

```text
05:30 BRT (08:30 UTC) ──► Gerar devocional via IA
           │
           ▼
    [Devocional salvo no banco]
           │
           ▼
06:00 BRT (09:00 UTC) ──► Enviar WhatsApp (devocional já existe!)
```

### Ação Necessária

Atualizar o arquivo `docs/cron-devotional-setup.sql` com o SQL correto e horário atualizado para você executar no Supabase.

### SQL do Novo Cron Job

```sql
-- Habilitar extensões (se necessário)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Criar cron job para gerar devocional às 5:30 BRT (8:30 UTC)
SELECT cron.schedule(
  'generate-daily-devotional',
  '30 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://fnksvazibtekphseknob.supabase.co/functions/v1/generate-devotional',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZua3N2YXppYnRla3Boc2Vrbm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzU2NjUsImV4cCI6MjA3MDA1MTY2NX0.ZB0sXojOg27f-BE4DzMj-pydHWhijURPoUIkNRi5Of4"}'::jsonb,
    body := '{"count": 1}'::jsonb
  ) AS request_id;
  $$
);
```

### Resultado Final: Dois Cron Jobs

```text
+----------------------------+------------+-------------+
| Job                        | UTC        | Brasília    |
+----------------------------+------------+-------------+
| generate-daily-devotional  | 08:30 UTC  | 05:30 BRT   |
| send-daily-devotional-wpp  | 09:00 UTC  | 06:00 BRT   |
+----------------------------+------------+-------------+
```

### Alteração no Código

Vou atualizar o arquivo `docs/cron-devotional-setup.sql` com:
- Horário correto: 8:30 UTC (5:30 BRT)
- Chave anon já preenchida
- Instruções claras de como executar

### Segurança

A função `generate-devotional` já possui verificação de idempotência - se o devocional do dia já existir, ela simplesmente pula a geração:

```typescript
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
```

