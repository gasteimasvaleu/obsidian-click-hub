

## Implementar expiração automática de assinaturas (excluindo admins)

### Problema
Assinaturas expiradas permanecem com status `active` indefinidamente. Admins devem manter acesso independente da assinatura.

### Solução

#### 1. Migration — Função + Cron Job (via pg_cron + pg_net)

Criar função `expire_overdue_subscriptions()` que ignora usuários com role `admin`:

```sql
CREATE OR REPLACE FUNCTION public.expire_overdue_subscriptions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE subscribers
  SET subscription_status = 'expired',
      updated_at = now()
  WHERE subscription_status = 'active'
    AND subscription_expires_at IS NOT NULL
    AND subscription_expires_at < now()
    AND NOT EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = subscribers.user_id
        AND user_roles.role = 'admin'
    );
$$;
```

O cron job será agendado via SQL insert (não migration) chamando a edge function ou diretamente via `cron.schedule`, rodando diariamente às 03:00 UTC.

#### 2. Agendar via pg_cron (SQL insert no banco)

Usando `pg_net` para chamar a função diretamente:

```sql
SELECT cron.schedule(
  'expire-overdue-subscriptions',
  '0 3 * * *',
  'SELECT public.expire_overdue_subscriptions()'
);
```

### Resultado
- Assinaturas vencidas são automaticamente marcadas como `expired` diariamente
- Admins nunca têm suas assinaturas expiradas
- Sua assinatura permanece ativa

### Arquivos alterados
- **Nova migration SQL** — cria a função `expire_overdue_subscriptions`
- **SQL insert** — agenda o cron job

