# Miniaturas inteiras em "Próximas aulas"

O painel pede miniaturas de aula em 1440x730, um formato mais largo, mas a lista de próximas aulas mostra em 16:9 e corta em cima e embaixo.

## O que muda
- A miniatura de cada aula passa a usar o mesmo formato do painel (1440x730) e aparece inteira.
- Se alguma imagem antiga tiver outro formato, ela aparece inteira sobre um fundo neutro, sem cortes.
- Duração, ícone de play e marca de concluída continuam como estão.

## Detalhes técnicos
- `LessonPlaylist.tsx`: `AspectRatio ratio={1440 / 730}` com fundo `bg-muted rounded`, e a imagem com `object-contain` no lugar de `object-cover`.
