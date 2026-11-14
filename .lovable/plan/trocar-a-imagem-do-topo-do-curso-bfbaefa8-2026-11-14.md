# Trocar a imagem do topo do curso (bfbaefa8...)

Mesmo esquema da troca anterior: a imagem nova substitui a do topo deste curso só no app.

## Passos
1. Enviar a imagem nova.
2. No topo da página deste curso, mostrar a imagem nova no lugar da atual, com o card no formato da própria imagem para não cortar.

## Detalhes técnicos
- Asset `curso_topo_bfba.png.asset.json`; em CoursePage, trocar o override único por um mapa id -> { url, ratio }, incluindo f98a734c (1672/941) e bfbaefa8 (proporção da imagem nova).
