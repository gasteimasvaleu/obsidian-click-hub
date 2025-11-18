-- ================================================================
-- CONFIGURAÇÃO DE CRON JOB PARA GERAÇÃO AUTOMÁTICA DE DEVOCIONAIS
-- ================================================================
-- 
-- Este arquivo contém o SQL para configurar um job CRON que gera
-- automaticamente um devocional por dia à meia-noite.
--
-- IMPORTANTE: Esta é uma configuração OPCIONAL
-- Os devocionais já são gerados automaticamente quando os usuários
-- acessam a página /devocional
--
-- ================================================================

-- PASSO 1: Habilitar as extensões necessárias
-- Execute isso no SQL Editor do Supabase apenas uma vez:

-- Habilitar pg_cron (para agendar jobs)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Habilitar pg_net (para fazer requisições HTTP)
CREATE EXTENSION IF NOT EXISTS pg_net;


-- PASSO 2: Criar o job CRON
-- ATENÇÃO: Substitua YOUR_ANON_KEY pela chave anon do seu projeto
-- Você pode encontrar a chave em: Project Settings > API

SELECT cron.schedule(
  'generate-daily-devotional',    -- Nome do job
  '0 0 * * *',                     -- Executar à meia-noite todo dia (00:00)
  $$
  SELECT net.http_post(
    url:='https://fnksvazibtekphseknob.supabase.co/functions/v1/generate-devotional',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body:='{"count": 1}'::jsonb
  ) as request_id;
  $$
);


-- ================================================================
-- COMANDOS ÚTEIS PARA GERENCIAR O CRON
-- ================================================================

-- Ver todos os jobs agendados:
SELECT * FROM cron.job;

-- Ver histórico de execuções:
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;

-- Desabilitar o job (se necessário):
-- UPDATE cron.job SET active = FALSE WHERE jobname = 'generate-daily-devotional';

-- Reabilitar o job:
-- UPDATE cron.job SET active = TRUE WHERE jobname = 'generate-daily-devotional';

-- Deletar o job permanentemente:
-- SELECT cron.unschedule('generate-daily-devotional');


-- ================================================================
-- ALTERNATIVAS DE HORÁRIO
-- ================================================================
-- 
-- Se quiser mudar o horário de execução, use um dos exemplos abaixo:
-- 
-- A cada hora: '0 * * * *'
-- A cada 6 horas: '0 */6 * * *'
-- Às 6h da manhã: '0 6 * * *'
-- Às 23h: '0 23 * * *'
-- De segunda a sexta às 8h: '0 8 * * 1-5'
--
-- Formato: minuto hora dia-do-mês mês dia-da-semana
-- Mais info: https://crontab.guru/
--
-- ================================================================


-- ================================================================
-- NOTAS IMPORTANTES
-- ================================================================
--
-- 1. CUSTO: Cada devocional custa ~$0.02 em créditos Lovable AI
--    - 1 por dia = ~$0.60/mês
--    - Certifique-se de ter créditos suficientes
--
-- 2. DEPENDÊNCIAS: 
--    - A Bíblia ACF deve estar importada (66 livros)
--    - A função get_random_verse() deve existir
--    - O edge function generate-devotional deve estar deployado
--
-- 3. MONITORAMENTO:
--    - Verifique os logs do edge function regularmente
--    - Monitore o histórico de execução do CRON
--    - Acompanhe o saldo de créditos da Lovable AI
--
-- 4. ALTERNATIVA:
--    - Se preferir não usar CRON, os devocionais são gerados 
--      automaticamente quando usuários acessam /devocional
--    - Admins também podem gerar em lote pelo dashboard
--
-- ================================================================
