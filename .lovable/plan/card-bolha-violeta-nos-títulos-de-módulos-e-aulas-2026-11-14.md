# Card bolha violeta nos títulos de módulos e aulas

## O que muda
Todos os títulos abaixo ganham o card bolha violeta com borda luminosa e a fonte nova (extra grossa, última palavra com gradiente claro):
- Página do curso: "Módulos do Curso".
- Página do módulo: "Aulas do Módulo".
- Página da aula: o título da aula (a descrição vira o card branco colado, com "Ver mais"), "Materiais complementares" e "Próximas aulas".
- Títulos de curso/módulo que aparecem no topo quando não há imagem ou vídeo.

Os títulos dentro da lista de módulos e aulas (miniaturas) continuam como estão.

## Detalhes técnicos
- Reutilizar `SectionHeader` (de `CourseCarousel.tsx`) em `CoursePage.tsx`, `ModulePage.tsx` e `LessonPlayer.tsx` (título + descrição da aula; "Materiais complementares"; "Próximas aulas" no desktop).
- No celular, o botão "Próximas aulas (N)" ganha o mesmo visual bolha violeta, mantendo o abrir/fechar.
- `ResponsiveHeroBanner.tsx` (fallback sem mídia): título com `SectionHeader`.
- Painel Admin fica de fora.
