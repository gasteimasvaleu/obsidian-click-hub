
Diagnóstico confirmado no projeto atual:
- O usuário Apple foi criado em `profiles` (`g457tk7fm5@privaterelay.appleid.com`), mas não existe registro correspondente em `subscribers`.
- O código ainda está com o problema de ordem assíncrona:
  - `AuthContext.tsx`: chama `identifyUser()` e `syncSubscriptionAfterLogin()` sem `await`.
  - `Login.tsx`: chama `syncSubscriptionAfterLogin()` sem antes chamar `identifyUser()`.
- Isso permite que o sync rode antes da assinatura anônima ser transferida no RevenueCat, retornando `isActive = false` e não criando linha em `subscribers`.

Plano de implementação (curto e direto):

1) Corrigir sequência de identificação + sync no login
- Arquivo: `src/pages/Login.tsx`
- Após `signInWithIdToken`:
  - chamar `await identifyUser(data.user.id)`;
  - depois `await syncSubscriptionAfterLogin(data.user.id, data.user.email ?? '')`;
  - só então navegar para `/`.

2) Corrigir sequência no listener global de autenticação
- Arquivo: `src/contexts/AuthContext.tsx`
- No `onAuthStateChange`, trocar o bloco dinâmico para `async` com `await`:
  - `await identifyUser(session.user.id)`;
  - `await syncSubscriptionAfterLogin(session.user.id, session.user.email ?? '')`.

3) Tornar o sync resiliente a timing de propagação do RevenueCat
- Arquivo: `src/lib/revenuecat.ts`
- Em `syncSubscriptionAfterLogin`:
  - adicionar retry curto (ex.: 3 tentativas com pequeno delay) para `checkSubscriptionStatus`;
  - só desistir após tentativas;
  - manter `upsert` por `user_id`.

4) Blindagem contra conflito por e-mail já existente
- Arquivo: `src/lib/revenuecat.ts`
- Antes do `upsert`, se houver registro em `subscribers` com mesmo `email` e `user_id` nulo, atualizar esse registro para vincular `user_id` (evita falha por `email` único em cenários legados).

5) Validação funcional (fim a fim)
- Fluxo iOS: App Store purchase → Apple login → abrir perfil.
- Verificações obrigatórias:
  - linha criada/atualizada em `subscribers` com `user_id` correto e `subscription_status='active'`;
  - `WhatsAppOptinSection` deixa de mostrar bloqueio e exibe controles.
