# Abertura com autoplay e exatamente 6 segundos

## O que muda
- A animação começa sozinha assim que o app abre, sem precisar tocar na tela.
- A abertura dura sempre 6 segundos e então some com um esmaecimento suave.

## Detalhes técnicos (SplashScreen.tsx)
- Remover o `v.load()` dentro de `primeAndPlay` (reinicia o vídeo e pode cancelar o autoplay no iOS); tentar `play()` de novo em `loadeddata`/`canplay` e em `visibilitychange`, além do toque como último recurso.
- Duração fixa: um único timer de 6000 ms a partir da montagem dispara a saída; remover a saída por `onEnded` e o MIN/MAX atuais (2 s / 7 s).
- Se o vídeo for mais longo que 6 s, ele é cortado; se mais curto, pausa no último quadro até completar 6 s.
