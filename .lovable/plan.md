<final-text>Diagnóstico

Há dois problemas separados no startup do Android:

1. A tela preta com spinner vem do splash React em `src/components/SplashScreen.tsx`.
   - Ele depende de um vídeo remoto do Supabase (`novosplash.mp4`).
   - O `fallbackTimer` chama `handleComplete()` com um valor antigo de `minTimeElapsed` por causa de closure do `useEffect`.
   - Resultado provável: o vídeo falha/demora, o timer dispara, mas `handleComplete()` ignora a saída e o app fica preso nessa tela preta.

2. A tela com ícone de “play” é o splash nativo padrão do Capacitor.
   - O Android ainda usa `android/app/src/main/res/drawable/splash.png` padrão.
   - Então, quando o WebView demora ou falha para entrar no app web, aparece essa arte genérica, o que realmente pode prejudicar a aprovação visual.

Plano

1. Corrigir a lógica do splash React
   - Reescrever `src/components/SplashScreen.tsx` para não depender de closure antiga.
   - Garantir saída do splash por tempo máximo fixo, mesmo se o vídeo não carregar.
   - Fazer o fallback sem bloquear o `onComplete`.
   - Preferir um fluxo mais resiliente:
     - tempo mínimo curto
     - tempo máximo garantido
     - `onLoadedData`/`onEnded` apenas aceleram a saída, não a controlam sozinhos

2. Reduzir o risco do vídeo remoto travar o app
   - Trocar o splash inicial por imagem/branding local ou por uma animação simples em CSS, ou
   - manter o vídeo só como enriquecimento visual, nunca como dependência para liberar o app
   - Isso evita travas por rede, cache, Supabase Storage ou WebView Android

3. Substituir o splash nativo padrão do Android
   - Atualizar `android/app/src/main/res/drawable/splash.png` com a arte correta da BíbliaToon Club
   - Revisar se o tema de launch em `android/app/src/main/res/values/styles.xml` continua apontando corretamente para esse asset
   - Assim, mesmo quando o app estiver iniciando, não aparecerá mais o placeholder do Capacitor

4. Revisar a transição entre splash nativo e app web
   - Conferir se o app sempre sai do launch screen para a interface React
   - Garantir que a primeira tela útil (`/login`) renderize mesmo sem sessão, sem depender do splash remoto terminar perfeitamente

5. Validar no Android após a correção
   - Testar estes cenários:
     - primeira abertura com internet
     - abertura com internet lenta
     - reabertura com app já instalado
     - retorno após fechar completamente
   - Confirmar que:
     - não fica preso na tela preta
     - não volta para o splash com play
     - entra no login normalmente

Arquivos que devo ajustar

- `src/components/SplashScreen.tsx`
- `src/App.tsx` (se precisar simplificar o gate do splash)
- `android/app/src/main/res/drawable/splash.png`
- possivelmente `android/app/src/main/res/values/styles.xml` apenas para conferência

Detalhe técnico

O ponto mais suspeito hoje é este:
- `SplashScreen` cria timers no `useEffect([])`
- `handleComplete()` lê `minTimeElapsed`
- quando o timer de 8s dispara, ele pode estar usando a versão antiga da função, onde `minTimeElapsed` ainda era `false`
- por isso o app pode ignorar a saída e ficar preso no loading preto

Resultado esperado após implementação

- startup confiável no Android
- splash nativo com branding correto
- nenhuma tela preta infinita
- login abrindo normalmente depois do splash</final-text>