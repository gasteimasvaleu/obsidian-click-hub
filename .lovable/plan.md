

## Correção: Webhook RevenueCat para IDs Anônimos + Sync Cliente

### Arquivos a alterar

**1. `supabase/functions/revenuecat-webhook/index.ts`**
- Detectar `app_user_id` começando com `$RCAnonymousID:`
- Verificar array `aliases` por UUID válido (não-anônimo)
- Se UUID encontrado nos aliases → usar como `user_id` normalmente
- Se nenhum UUID → criar registro sem `user_id`, armazenando `original_transaction_id` no campo `hotmart_transaction_id` para rastreio futuro
- Antes de inserir, verificar duplicata por `hotmart_transaction_id`

**2. `src/lib/revenuecat.ts`**
- No `syncSubscriptionAfterLogin`, após confirmar assinatura ativa, buscar registros órfãos (sem `user_id`) que tenham `hotmart_product_id` começando com `revenuecat:` e vinculá-los ao usuário atual
- Usar `original_transaction_id` do RevenueCat SDK para match mais preciso quando disponível

### Fluxo corrigido

```text
Compra (anônimo) → Webhook recebe $RCAnonymousID
                  → Cria registro sem user_id (com transaction_id)
                  
Login/Signup      → identifyUser(uuid)
                  → syncSubscriptionAfterLogin()
                  → Detecta assinatura ativa via SDK
                  → Busca registro órfão → vincula user_id
```

### Sem novo build necessário
- Webhook: deploy automático via Supabase
- Cliente JS: deploy via Live Update

