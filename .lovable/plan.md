# Rolar até as orações ao tocar numa categoria

Ao tocar em qualquer card de categoria (ou em Favoritos), a página rola suavemente até o título da categoria escolhida, mostrando as orações logo abaixo, já descontando a barra do topo.

## Detalhes técnicos
- `src/pages/Oracoes.tsx`: `ref` no bloco da lista de orações com `scroll-mt-24`; em `handleSelectCategory` e `handleToggleFavorites`, chamar `requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))`.
