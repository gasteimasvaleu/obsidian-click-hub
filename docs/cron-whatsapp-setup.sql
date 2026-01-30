-- ============================================
-- CONFIGURAÇÃO DO CRON JOB PARA ENVIO DE DEVOCIONAIS VIA WHATSAPP
-- ============================================
-- 
-- Este script configura um cron job para enviar devocionais diários
-- via WhatsApp às 6h da manhã (horário de Brasília).
--
-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- Dashboard > SQL Editor > New query
--
-- ============================================

-- 1. Habilitar as extensões necessárias (se ainda não estiverem habilitadas)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Criar o cron job para enviar devocionais às 6h de Brasília (9h UTC)
SELECT cron.schedule(
  'send-daily-devotional-whatsapp',  -- Nome único do job
  '0 9 * * *',                        -- Cron expression: 9h UTC = 6h BRT
  $$
  SELECT net.http_post(
    url := 'https://fnksvazibtekphseknob.supabase.co/functions/v1/send-daily-devotional-whatsapp',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZua3N2YXppYnRla3Boc2Vrbm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzU2NjUsImV4cCI6MjA3MDA1MTY2NX0.ZB0sXojOg27f-BE4DzMj-pydHWhijURPoUIkNRi5Of4"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- ============================================
-- COMANDOS ÚTEIS PARA GERENCIAR O CRON JOB
-- ============================================

-- Ver todos os jobs agendados:
-- SELECT * FROM cron.job;

-- Ver histórico de execuções:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;

-- Desativar o job temporariamente:
-- SELECT cron.unschedule('send-daily-devotional-whatsapp');

-- Executar o job manualmente (para testes):
-- SELECT net.http_post(
--   url := 'https://fnksvazibtekphseknob.supabase.co/functions/v1/send-daily-devotional-whatsapp',
--   headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZua3N2YXppYnRla3Boc2Vrbm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NzU2NjUsImV4cCI6MjA3MDA1MTY2NX0.ZB0sXojOg27f-BE4DzMj-pydHWhijURPoUIkNRi5Of4"}'::jsonb,
--   body := '{}'::jsonb
-- );

-- ============================================
-- NOTAS
-- ============================================
-- 
-- - O cron job executa às 9h UTC, que corresponde a 6h no horário de Brasília
-- - Durante o horário de verão, pode haver variação de 1 hora
-- - A função send-daily-devotional-whatsapp busca o devocional do dia
--   e envia para todos os assinantes com whatsapp_optin = true
-- - Entre cada envio há um delay de 1.5 segundos para respeitar rate limits
-- - Os logs podem ser visualizados em: Dashboard > Edge Functions > send-daily-devotional-whatsapp > Logs
