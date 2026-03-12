

## Corrigir incompatibilidade SPM do Apple Sign In

### Problema
O plugin `@capacitor-community/apple-sign-in` v7.1.0 foi criado para Capacitor 7. Seu `Package.swift` exige `capacitor-swift-pm` com `from: "7.0.0"` (ou seja, >= 7.0.0 e < 8.0.0), mas o projeto usa `exact: "8.1.0"`. Isso faz o SPM falhar na resolução de dependências, quebrando o build inteiro.

### Solução
Remover o plugin NPM incompatível e implementar o Sign in with Apple **nativamente** usando o framework `AuthenticationServices` do iOS, expondo via bridge do Capacitor.

### Alterações

**1. `package.json`** - Remover `@capacitor-community/apple-sign-in` das dependências

**2. `src/lib/native-apple-signin.ts`** (novo arquivo) - Wrapper JS que chama o plugin nativo via `Capacitor.Plugins`
- Função `nativeAppleSignIn()` que chama `Capacitor.Plugins.NativeAppleSignIn.authorize()`
- Retorna `{ identityToken, authorizationCode, givenName, familyName, email }`

**3. `src/pages/Login.tsx`** - Trocar import do plugin removido pelo novo wrapper `nativeAppleSignIn()`
- Manter a mesma lógica: chamar nativo → receber token → `supabase.auth.signInWithIdToken()`

**4. `ios/App/App/NativeAppleSignInPlugin.swift`** (novo arquivo) - Plugin Capacitor nativo
- Usa `ASAuthorizationAppleIDProvider` + `ASAuthorizationController`
- Método `authorize()` que apresenta a sheet nativa do Apple ID
- Retorna o `identityToken` como string base64 para o JS

**5. `ios/App/App/NativeAppleSignInPlugin.m`** (novo arquivo) - Bridge Objective-C
- Registra o plugin com `CAP_PLUGIN` e expõe o método `authorize`

**6. `ios/App/App/AppDelegate.swift`** - Registrar o plugin nativo (se necessário)

### Fluxo
```text
Login.tsx → nativeAppleSignIn() → Capacitor bridge
  → NativeAppleSignInPlugin.swift (ASAuthorizationController)
  → Sheet nativa Apple ID (dentro do app)
  → identityToken retorna ao JS
  → supabase.auth.signInWithIdToken({ provider: 'apple', token })
  → Sessão criada
```

### Pós-implementação
O usuário precisará:
1. `git pull` + `npm install` + `npm run build` + `npx cap sync`
2. `node fix-signing.cjs`
3. Abrir no Xcode e buildar (sem erros de SPM)

