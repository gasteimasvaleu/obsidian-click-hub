# Sombras cortadas no resultado do Guia dos Pais

## O que muda
- As sombras roxas dos cards (Perfil, Contexto da Passagem e demais seções) aparecem inteiras, sem o corte reto nas laterais e embaixo.
- O texto das seções abertas fica colado à bolha do título, como no Perfil.

## Detalhes técnicos
- `GuideDisplay.tsx`: tirar o `overflow-hidden` do contêiner raiz, que corta a sombra lateral.
- O `AccordionContent` tem `overflow-hidden` fixo por causa da animação. O card branco passa para uma div interna, com respiro (`px-2 pb-6`) no wrapper, para a sombra caber dentro da área visível. A div interna fica com `-mt-3 rounded-t-none pt-6`, igual ao `SectionDescription`.
