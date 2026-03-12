
Diagnóstico consolidado (com base nos logs + código atual):
- Do I know what the issue is? **Sim**.
- O problema **não é conta sandbox**. O fluxo quebra por 2 motivos principais:
  1) O app ainda está executando um bundle antigo em parte dos testes (Live Updates/Production), pois o log mostra `Failed to sync subscriber` + `42P10`, string que **não existe mais** no `src/lib/revenuecat.ts` atual.
  2) No fluxo novo, a assinatura não transfere porque o RevenueCat está logado em um usuário identificado anterior; ao trocar para outro usuário identificado, o `logIn` não faz merge/transferência (comportamento oficial do RC). Resultado: `isActive=false` e nada é inserido em `subscribers`.

Plano de implementação:
1) Sincronizar identidade RevenueCat com sessão Supabase (correção principal)
- Arquivo: `src/lib/revenuecat.ts`
- Adicionar helpers:
  - obter `appUserID` atual (`getAppUserID`)
  - forçar estado anônimo (`logOut`) quando necessário
- Regra: se usuário Supabase estiver deslogado, RevenueCat deve ficar anônimo antes de qualquer compra/login.

2) Centralizar identify+sync em um único ponto
- Arquivo: `src/contexts/AuthContext.tsx`
- Manter `identifyUser + syncSubscriptionAfterLogin` apenas no fluxo de sessão autenticada.
- No `SIGNED_OUT` e no bootstrap sem sessão, chamar `RevenueCat.logOut()` para evitar “usuário fantasma” em compras futuras.

3) Remover duplicidade no login Apple
- Arquivo: `src/pages/Login.tsx`
- Remover chamada direta duplicada de `identifyUser/syncSubscriptionAfterLogin` (deixar AuthContext como fonte única).
- Manter apenas autenticação Apple + persistência de nome.

4) Garantir logout completo ao excluir conta
- Arquivo: `src/pages/Profile.tsx`
- Trocar `supabase.auth.signOut()` direto por `signOut()` do contexto (que também limpará identidade do RevenueCat).

5) Blindagem de recuperação de assinatura
- Arquivo: `src/lib/revenuecat.ts`
- Em `syncSubscriptionAfterLogin`, se após retries continuar `isActive=false`, executar fallback de restauração (`restorePurchases`) e revalidar status antes de desistir.
- Isso cobre casos de troca de conta no mesmo dispositivo/sandbox.

6) Parar falso positivo de “código antigo”
- Arquivo: `capacitor.config.ts` (e sync para iOS)
- Ajustar estratégia de Live Updates em debug/QA (não usar snapshot de Production para teste local) ou separar canal de teste.
- Adicionar log de versão/build do app para confirmar qual bundle está rodando em cada teste.

Validação E2E (obrigatória):
```text
1) Desinstalar app
2) Instalar build novo
3) Abrir app e confirmar no log o build/version marker
4) Comprar no App Store (sandbox)
5) Continuar com Apple
6) Verificar:
   - RevenueCat appUserID final = auth.uid atual
   - sync retorna isActive=true
   - linha criada/atualizada em subscribers com user_id correto e status=active
   - WhatsAppOptinSection habilitada no perfil
7) Testar excluir conta -> novo login -> confirmar que RC não reaproveita usuário antigo
```

Detalhes técnicos (arquivos que serão alterados):
- `src/lib/revenuecat.ts` (logOut/getAppUserID/fallback restore/sync robusto)
- `src/contexts/AuthContext.tsx` (fonte única de sync + logout RC no signed_out)
- `src/pages/Login.tsx` (remover duplicidade de sync)
- `src/pages/Profile.tsx` (usar signOut central)
- `capacitor.config.ts` (+ `npx cap sync ios`) para estratégia de Live Updates em testes
