

## Diagnóstico

Os logs do Xcode revelam dois problemas distintos:

### Problema 1: Subscriber não criado
```
"there is no unique or exclusion constraint matching the ON CONFLICT specification"
```
O índice `subscribers_user_id_unique` é **parcial** (`WHERE user_id IS NOT NULL`). O Postgres **não aceita** `ON CONFLICT` com índices parciais dessa forma. O `upsert({ onConflict: 'user_id' })` falha silenciosamente e a linha nunca é criada.

### Problema 2: Nome "Usuário"
O `handle_new_user` trigger extrai `raw_user_meta_data->>'full_name'` ao criar o perfil. Porém, o token de identidade da Apple **não inclui** `full_name` no payload — o nome só vem como campo separado no `ASAuthorizationAppleIDCredential`, e apenas no primeiro login. O resultado: `full_name = NULL` no profiles, e a UI mostra o fallback "Usuário".

---

## Plano de Correção

### 1. Banco: Criar constraint UNIQUE real em `user_id`
- Remover o índice parcial `subscribers_user_id_unique`
- Criar uma constraint UNIQUE real (não parcial) na coluna `user_id`
- Como `user_id` é nullable e pode ter múltiplos NULLs, usar `CREATE UNIQUE INDEX ... WHERE user_id IS NOT NULL` não serve para ON CONFLICT. Solução: substituir o upsert por insert direto no código.

### 2. Código: `src/lib/revenuecat.ts` — Trocar upsert por insert
- Remover o `upsert({ onConflict: 'user_id' })`
- Primeiro verificar se já existe subscriber com `user_id` (SELECT)
- Se existe: UPDATE o status
- Se não existe: INSERT direto com `user_id`, `email`, `subscription_status`, `subscription_expires_at`
- Isso evita o problema do ON CONFLICT com índice parcial

### 3. Código: `src/pages/Login.tsx` — Capturar nome da Apple e atualizar profile
- O `nativeAppleSignIn()` já retorna `givenName` e `familyName` do plugin Swift
- Após `signInWithIdToken`, se `givenName`/`familyName` existirem, fazer UPDATE no profiles e no user metadata
- Fallback: se nome não vier, atualizar com "Usuário Apple"

### 4. Código: `src/pages/Profile.tsx` — Fallback de nome
- Trocar `'Usuário'` por `'Usuário Apple'` quando email contiver `privaterelay.appleid.com`

### Arquivos alterados
- **Migration SQL**: drop/recreate index (ou manter e mudar lógica)
- `src/lib/revenuecat.ts`: substituir upsert por select+insert/update
- `src/pages/Login.tsx`: capturar e salvar nome da Apple
- `src/pages/Profile.tsx`: fallback de nome melhorado

