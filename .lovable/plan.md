

## Corrigir Sign in with Apple para Capacitor Nativo

### Problema
O `signInWithOAuth` abre o Safari para completar o fluxo OAuth. O Safari não consegue redirecionar de volta para `capacitor://app.bibliatoonkids.com`, resultando no erro "não pôde se conectar ao servidor".

### Solução
Substituir o fluxo OAuth por **Sign in with Apple nativo** usando `@capacitor-community/apple-sign-in` + `signInWithIdToken` do Supabase.

### Alterações

**1. Instalar dependência**
- `@capacitor-community/apple-sign-in`

**2. Atualizar `src/pages/Login.tsx`**
- Importar o plugin nativo
- No `handleAppleSignIn`:
  - Se `isNativePlatform()`: usar `SignInWithApple.authorize()` para obter o `identityToken`, depois chamar `supabase.auth.signInWithIdToken({ provider: 'apple', token: identityToken })`
  - Se web: manter o fluxo OAuth atual como fallback

**3. Atualizar `capacitor.config.ts`**
- Registrar o plugin na lista `packageClassList` (se necessário)

**4. Pós-build**
- Rodar `npx cap sync` + scripts de manutenção (`fix-signing.cjs`, `fix-android-appid.cjs`)

### Fluxo resultante
```text
Usuário toca "Continuar com Apple"
  → Plugin nativo exibe sheet do Apple ID (dentro do app)
  → Retorna identityToken + user info
  → supabase.auth.signInWithIdToken({ provider: 'apple', token })
  → Sessão criada no Supabase
  → Navega para "/"
```

### Importante
- O Sign in with Apple precisa estar habilitado como provider no Supabase Dashboard (Authentication → Providers → Apple)
- O Service ID e chave privada da Apple precisam estar configurados no Supabase para validar o `identityToken`

