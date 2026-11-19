# Tela de carregamento: vídeo 1:1 sem deformar

## O que muda
- O vídeo da tela de carregamento volta ao formato quadrado original (1:1), centralizado na tela, sem esticar nem cortar.
- O fundo branco da tela de carregamento continua preenchendo o resto da tela.
- A barrinha de carregamento e a mensagem continuam embaixo, como hoje.

## Detalhes técnicos
- `src/components/LoadingOverlay.tsx`: trocar o `<video>` de `absolute inset-0 h-full w-full object-cover` para um bloco centralizado (`flex items-center justify-center` no container) com `w-[min(80vw,420px)] aspect-square object-contain`.
- Manter o fundo atual do overlay (#FBFBFC) e o restante do comportamento (autoplay, loop, muted).
