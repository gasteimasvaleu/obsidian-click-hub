## Corrigir autoplay do Splash e Loading no iOS

**Causa**: WKWebView do iOS (especialmente iOS 17/18) está ignorando os atributos `muted`/`playsInline` aplicados pelo React no primeiro render dos `<video>`. Resultado: o autoplay é bloqueado até o usuário tocar na tela. As outras animações funcionam porque são CSS puro — só os dois `<video>` são afetados.

`capacitor.config.ts` já tem `allowsInlineMediaPlayback: true`, então a correção é no front.

### Mudanças

**1. `src/components/SplashScreen.tsx`**
No `useEffect` que faz `tryPlay`, antes do `v.play()`:
- `v.muted = true`
- `v.defaultMuted = true`
- `v.playsInline = true`
- `v.setAttribute('muted', '')`
- `v.setAttribute('playsinline', '')`
- `v.setAttribute('webkit-playsinline', '')`
- `v.load()` (força WebKit a reconhecer os atributos antes do play)
- depois `v.play().catch(...)`

Manter fallback de `touchstart` como rede de segurança.

**2. `src/components/LoadingOverlay.tsx`**
Mesmo tratamento no `useEffect` que chama `v.play()`.

### Não muda
- Nada em AppDelegate.swift / Info.plist (Capacitor já configura `mediaTypesRequiringUserActionForPlayback` corretamente quando `allowsInlineMediaPlayback: true`).
- Nada em `capacitor.config.ts`.
- Nenhuma outra animação ou tela.

### Verificação
Após aplicar: `npm run build && npx cap sync ios`, gerar novo build TestFlight, abrir e confirmar que:
- O vídeo do splash inicia automaticamente do frame 1 sem precisar tocar.
- O `LoadingOverlay` mostra o vídeo rodando assim que aparece.
