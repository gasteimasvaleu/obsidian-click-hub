

# Google Sign-In no Android — Plano de Implementação

## Dados coletados
- **Android Client ID:** `895146984736-2tagq9eepbnib0od1bsqdd9535h2up55.apps.googleusercontent.com`
- **Web Client ID:** `895146984736-se9con0r5b6qatgtk1mfqcs6qq755m97.apps.googleusercontent.com`

## Pre-requisito (ação sua no Supabase Dashboard)
Antes de eu implementar, confirme que você já habilitou o Google Provider no Supabase Dashboard (Authentication → Providers → Google) com o **Web Client ID** e **Client Secret**.

## Passos de implementação

### 1. Instalar dependência
- `@codetrix-studio/capacitor-google-auth` — plugin Capacitor para Google Sign-In nativo no Android

### 2. Criar `src/lib/native-google-signin.ts`
Módulo seguindo o mesmo padrão do `native-apple-signin.ts`:
- Importa `GoogleAuth` do plugin
- Inicializa o plugin
- Função `nativeGoogleSignIn()` que retorna o `idToken` do Google

### 3. Atualizar `capacitor.config.ts`
Adicionar configuração do plugin GoogleAuth:
```ts
GoogleAuth: {
  scopes: ['profile', 'email'],
  serverClientId: '895146984736-se9con0r5b6qatgtk1mfqcs6qq755m97.apps.googleusercontent.com',
  forceCodeForRefreshToken: true,
}
```

### 4. Atualizar `src/pages/Login.tsx`
- Adicionar botão "Continuar com Google" visível quando `platform === 'android'` (e opcionalmente na web)
- No Android nativo: usar `nativeGoogleSignIn()` → pegar `idToken` → `supabase.auth.signInWithIdToken({ provider: 'google', token: idToken })`
- Na web: usar `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Salvar nome do Google no perfil (similar ao fluxo Apple)

### 5. Atualizar `android/app/src/main/res/values/strings.xml`
Adicionar `server_client_id` como string resource para o plugin nativo.

### 6. Pós-implementação (ação sua)
- `git pull` + `npm install` + `npx cap sync android`
- Rebuild o app Android

