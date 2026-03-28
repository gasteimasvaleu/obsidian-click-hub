

## Remover Hotmart e Limpar Tabela Subscribers

### Resumo
Remover toda integração com Hotmart, manter a tabela `subscribers` simplificada para RevenueCat + WhatsApp + tokens VIP manuais. Adicionar seção "Envio de Tokens VIP" no painel admin.

### O que será removido

1. **Edge Function `hotmart-webhook`** — deletar o arquivo e remover do `config.toml`
2. **Colunas da tabela `subscribers`** — remover `hotmart_transaction_id`, `hotmart_product_id`, `hotmart_offer_id` via migration
3. **Referências a hotmart no código**:
   - `src/lib/revenuecat.ts` — remover queries que usam `hotmart_transaction_id` e `hotmart_product_id` (orphan claiming, sync)
   - `supabase/functions/revenuecat-webhook/index.ts` — substituir uso de `hotmart_*` por novas colunas (`product_source`, `transaction_id`)
   - `supabase/functions/admin-create-user/index.ts` — limpar referências
   - `src/pages/Download.tsx` — remover seção "Comprou pela Hotmart?"

### O que será adicionado/alterado

4. **Novas colunas na `subscribers`** (migration):
   - `product_source text` — ex: `revenuecat`, `vip`, `admin`
   - `transaction_id text` — ID da transação (RevenueCat original_transaction_id)
   - Manter: `email`, `full_name`, `phone`, `user_id`, `subscription_status`, `subscription_expires_at`, `signup_token`, `signup_token_expires_at`, `whatsapp_optin`, `whatsapp_optin_at`, `created_at`, `updated_at`

5. **Edge Function `complete-signup`** — manter como está (fluxo de token continua funcionando)

6. **Nova seção no Admin: "Envio de Tokens VIP"**
   - Formulário: email + nome do destinatário
   - Ao submeter: cria registro em `subscribers` com `product_source = 'vip'`, `subscription_status = 'pending'`, gera token, envia email via Resend (reutilizando lógica do antigo hotmart-webhook)
   - Nova edge function `send-vip-token` que:
     - Recebe email e nome
     - Valida se é admin (JWT)
     - Cria/atualiza subscriber com token
     - Envia email de cadastro via Resend

7. **Atualizar `expire_overdue_subscriptions()`** — remover referência a `hotmart_*` se houver (não há, já está limpo)

8. **Atualizar `revenuecat-webhook`** — trocar `hotmart_product_id` por `product_source` e `hotmart_transaction_id` por `transaction_id`

9. **Atualizar `revenuecat.ts` (client)** — trocar referências de `hotmart_*` pelas novas colunas

### Arquivos afetados

| Ação | Arquivo |
|------|---------|
| Deletar | `supabase/functions/hotmart-webhook/index.ts` |
| Nova migration | Remover colunas `hotmart_*`, adicionar `product_source`, `transaction_id` |
| Criar | `supabase/functions/send-vip-token/index.ts` |
| Criar | `src/pages/admin/VipTokenManager.tsx` |
| Editar | `supabase/functions/revenuecat-webhook/index.ts` |
| Editar | `src/lib/revenuecat.ts` |
| Editar | `src/pages/Download.tsx` |
| Editar | `supabase/config.toml` |
| Editar | `src/components/admin/AdminSidebar.tsx` (adicionar link VIP) |
| Editar | `src/App.tsx` (adicionar rota admin VIP) |

### Fluxo final simplificado

```text
Assinatura nativa (Apple/Google)
  → RevenueCat → webhook → subscribers (product_source: 'revenuecat')

Token VIP manual (Admin)
  → Admin panel → send-vip-token → subscribers (product_source: 'vip')
  → Email Resend → /cadastro?token=xxx → complete-signup → conta ativa
```

