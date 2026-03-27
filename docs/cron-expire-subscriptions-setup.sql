-- ============================================
-- CONFIGURAÇÃO DO CRON JOB PARA EXPIRAÇÃO AUTOMÁTICA DE ASSINATURAS
-- ============================================
--
-- Este script agenda um cron job que roda diariamente às 03:00 UTC
-- e marca como 'expired' todas as assinaturas com subscription_expires_at no passado.
-- Admins são excluídos automaticamente (nunca expiram).
--
-- IMPORTANTE: Execute este script no SQL Editor do Supabase
-- Dashboard > SQL Editor > New query
--
-- ============================================

-- 1. Habilitar extensões necessárias (se ainda não estiverem habilitadas)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Agendar o cron job
SELECT cron.schedule(
  'expire-overdue-subscriptions',
  '0 3 * * *',
  'SELECT public.expire_overdue_subscriptions()'
);

-- ============================================
-- COMANDOS ÚTEIS
-- ============================================

-- Ver todos os jobs agendados:
-- SELECT * FROM cron.job;

-- Ver histórico de execuções:
-- SELECT * FROM cron.job_run_details WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'expire-overdue-subscriptions') ORDER BY start_time DESC LIMIT 20;

-- Desativar o job:
-- SELECT cron.unschedule('expire-overdue-subscriptions');

-- Executar manualmente (para testes):
-- SELECT public.expire_overdue_subscriptions();
