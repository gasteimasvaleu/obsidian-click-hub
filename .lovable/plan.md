

## Diagnóstico dos 2 problemas

### 1. Email estranho no perfil (`g457tk7fm5@privaterelay.appleid.com`)
Isso é o **Apple Private Relay**. Quando o usuário faz Sign in with Apple e escolhe "Ocultar meu e-mail", a Apple gera esse endereço aleatório. Não é bug -- é comportamento padrão. A solução é exibir de forma mais elegante: se o email contiver `privaterelay.appleid.com`, mostrar algo como "E-mail protegido pela Apple" em vez do endereço criptografado.

### 2. WhatsApp diz "disponível apenas para assinantes ativos"
O componente `WhatsAppOptinSection` busca na tabela `subscribers` com `subscription_status = 'active'` e `user_id = userId`. O problema é de **timing**:

- O usuário compra a assinatura via RevenueCat **antes** de fazer login (como `$RCAnonymousID`)
- O webhook do RevenueCat dispara com o `app_user_id = $RCAnonymousID:xxx` (ID anônimo)
- O webhook tenta buscar `subscribers` com esse ID anônimo -- não encontra, tenta buscar `profiles` com esse ID -- também não encontra (não é UUID do Supabase)
- Resultado: **nenhum registro é criado na tabela `subscribers`**
- Depois, o `identifyUser()` é chamado no login, mas o webhook da compra original já passou

**Solução**: Após o login com Apple + `identifyUser()`, verificar o status da assinatura via RevenueCat SDK (`checkSubscriptionStatus`) e, se ativo, criar/atualizar o registro na tabela `subscribers` diretamente do frontend.

---

## Plano de implementação

### Passo 1 -- Tratar email Apple Private Relay no perfil
- Em `src/pages/Profile.tsx`, onde exibe `user.email`, detectar se contém `privaterelay.appleid.com` e mostrar "E-mail protegido pela Apple" com um ícone de cadeado.

### Passo 2 -- Sincronizar assinatura RevenueCat após login
- Criar função `syncSubscriptionAfterLogin(userId)` em `src/lib/revenuecat.ts` que:
  1. Chama `checkSubscriptionStatus()` via SDK
  2. Se ativo, faz upsert na tabela `subscribers` com o `user_id`, `email`, `subscription_status: 'active'`, `subscription_expires_at`
- Chamar essa função no `AuthContext.tsx` logo após `identifyUser()` ser bem-sucedido
- Isso garante que, mesmo que o webhook tenha falhado (ID anônimo), o registro do assinante é criado corretamente

### Passo 3 -- Também sincronizar na compra pós-login
- Em `Login.tsx`, após `purchaseMonthly()` retornar sucesso e o usuário já estar logado, chamar a mesma sync

---

### Detalhes técnicos
- **Arquivos alterados**: `src/pages/Profile.tsx`, `src/lib/revenuecat.ts`, `src/contexts/AuthContext.tsx`, `src/pages/Login.tsx`
- A sync do frontend é um **safety net** complementar ao webhook; não substitui o webhook
- O upsert usa `user_id` como chave para evitar duplicatas

