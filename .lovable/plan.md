

# Fix: Substituir plugin Google Auth incompatível com Capacitor 8

## Problema
O plugin `@codetrix-studio/capacitor-google-auth` requer `@capacitor/core@^6.0.0`, mas o projeto usa Capacitor 8. O plugin está descontinuado.

## Solucao
Substituir por `@capgo/capacitor-social-login` (v8), que e o fork oficial mantido e compatível com Capacitor 8.

## Passos

### 1. Trocar dependência no `package.json`
- Remover `@codetrix-studio/capacitor-google-auth`
- Adicionar `@capgo/capacitor-social-login@^8.3.9`

### 2. Reescrever `src/lib/native-google-signin.ts`
Usar a nova API:
```typescript
import { SocialLogin } from '@capgo/capacitor-social-login';

// Initialize once
await SocialLogin.initialize({
  google: {
    webClientId: '895146984736-se9con0r5b6qatgtk1mfqcs6qq755m97.apps.googleusercontent.com',
  },
});

// Login returns result with idToken
const res = await SocialLogin.login({
  provider: 'google',
  options: { scopes: ['profile', 'email'] },
});
```

### 3. Atualizar `capacitor.config.ts`
- Remover bloco `GoogleAuth`
- Adicionar bloco `SocialLogin` com providers habilitados:
```typescript
SocialLogin: {
  providers: {
    google: true,
    apple: false,
    facebook: false,
  },
}
```

### 4. Atualizar `Login.tsx`
- Trocar import de `nativeGoogleSignIn` para usar a nova implementação (a interface publica nao muda, so o interno)

### 5. Pos-implementacao (acao sua)
- `git pull` + `npm install` + `npx cap sync android`
- Rebuild o app Android

