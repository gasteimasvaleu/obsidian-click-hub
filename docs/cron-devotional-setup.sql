-- ================================================================
-- CONFIGURAÇÃO DE CRON JOB PARA GERAÇÃO AUTOMÁTICA DE DEVOCIONAIS
-- ================================================================
-- 
-- Este script configura um cron job para gerar automaticamente
-- o devocional do dia às 5:30 BRT (8:30 UTC), garantindo que o
-- conteúdo esteja pronto ANTES do envio via WhatsApp (6:00 BRT).
--
-- IMPORTANTE: Execute este SQL no SQL Editor do Supabase:
-- Dashboard > SQL Editor > New query
--
-- ================================================================

-- PASSO 1: Habilitar as extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- PASSO 2: Criar o cron job para gerar devocional às 5:30 BRT (8:30 UTC)
SELECT cron.schedule(
  'generate-daily-devotional',
  '30 8 * * *',  -- 8:30 UTC = 5:30 BRT
  $$
  SELECT net.http_post(
    url := 'https://fnksvazibtekphseknob.supabase.co/functions/v1/generate-devotional',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZua3N2YXppYnRla3Boc2Vrbm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzU2NjUsImV4cCI6MjA3MDA1MTY2NX0.ZB0sXojOg27f-BE4DzMj-pydHWhijURPoUIkNRi5Of4"}'::jsonb,
    body := '{"count": 1}'::jsonb
  ) AS request_id;
  $$
);


-- ================================================================
-- CRONOGRAMA DE EXECUÇÃO DOS JOBS
-- ================================================================
--
-- +----------------------------+------------+-------------+
-- | Job                        | UTC        | Brasília    |
-- +----------------------------+------------+-------------+
-- | generate-daily-devotional  | 08:30 UTC  | 05:30 BRT   |
-- | send-daily-devotional-wpp  | 09:00 UTC  | 06:00 BRT   |
-- +----------------------------+------------+-------------+
--
-- O devocional é gerado 30 minutos antes do envio do WhatsApp,
-- garantindo que o conteúdo já esteja no banco de dados.
--
-- ================================================================


-- ================================================================
-- COMANDOS ÚTEIS PARA GERENCIAR O CRON
-- ================================================================

-- Ver todos os jobs agendados:
-- SELECT * FROM cron.job;

-- Ver histórico de execuções:
-- SELECT * FROM cron.job_run_details 
-- ORDER BY start_time DESC 
-- LIMIT 20;

-- Desabilitar o job (se necessário):
-- UPDATE cron.job SET active = FALSE WHERE jobname = 'generate-daily-devotional';

-- Reabilitar o job:
-- UPDATE cron.job SET active = TRUE WHERE jobname = 'generate-daily-devotional';

-- Deletar o job permanentemente:
-- SELECT cron.unschedule('generate-daily-devotional');

-- Testar manualmente a geração:
-- SELECT net.http_post(
--   url := 'https://fnksvazibtekphseknob.supabase.co/functions/v1/generate-devotional',
--   headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZua3N2YXppYnRla3Boc2Vrbm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzU2NjUsImV4cCI6MjA3MDA1MTY2NX0.ZB0sXojOg27f-BE4DzMj-pydHWhijURPoUIkNRi5Of4"}'::jsonb,
--   body := '{"count": 1}'::jsonb
-- );


-- ================================================================
-- NOTAS IMPORTANTES
-- ================================================================
--
-- 1. CUSTO: Cada devocional custa ~$0.02 em créditos Lovable AI
--    - 1 por dia = ~$0.60/mês
--
-- 2. IDEMPOTÊNCIA: A função verifica se o devocional já existe
--    antes de gerar um novo. Executar múltiplas vezes é seguro.
--
-- 3. DEPENDÊNCIAS: 
--    - A Bíblia ACF deve estar importada (66 livros)
--    - A função get_random_verse() deve existir
--    - O edge function generate-devotional deve estar deployado
--    - O secret LOVABLE_API_KEY deve estar configurado
--
-- 4. MONITORAMENTO:
--    - Logs: Dashboard > Edge Functions > generate-devotional > Logs
--    - Histórico do cron: SELECT * FROM cron.job_run_details
--
-- ================================================================
