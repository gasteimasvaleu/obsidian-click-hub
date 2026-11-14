# Diminuir um pouco a sombra dos cards

A sombra colorida do vídeo, do "Acessar Cursos" e de "Confira nossos Lançamentos" fica levemente menor e mais suave, só na tela inicial clara. As outras telas continuam como estão.

## Detalhes técnicos
- Em `src/index.css`, adicionar `.home-light .neon-glow-user { box-shadow: 0 6px 18px var(--user-glow); }` (hoje é `0 8px 24px`).
