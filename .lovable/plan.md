# Vídeos de topo sem repetição

Os vídeos do topo das páginas vão tocar uma única vez e parar no último quadro.

## O que muda
- Orações e Colorir: hoje repetem sem parar; passam a tocar só uma vez.
- Banner principal dos cursos: continua repetindo.
- As demais páginas (Bíblia, Devocional, Guia dos Pais, Jogos, Amigo Divino, Comunidade, início) já tocam uma vez só; ficam como estão.
- A animação de carregamento continua repetindo (não é banner).

## Detalhes técnicos
Remover o atributo `loop` de `<video>` em src/pages/Oracoes.tsx e src/pages/colorir/ColorirPage.tsx. Mantém autoPlay, muted, playsInline.
