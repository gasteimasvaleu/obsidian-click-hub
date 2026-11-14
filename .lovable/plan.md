# Plataforma no desktop com a mesma largura das outras páginas

## Problema
No computador e no tablet, a página Plataforma (e também as páginas de curso, módulo e aula) ocupa a tela inteira. Por isso o vídeo do topo fica enorme e a página fica bem mais comprida que a Bíblia, Orações, Games etc., que ficam numa coluna central.

## O que muda
- Plataforma, Curso, Módulo e Aula passam a usar a mesma coluna central das outras páginas (mesma largura da Bíblia).
- O vídeo do topo, o card com título e subtítulo e os carrosséis ficam alinhados nessa coluna, com as mesmas margens laterais.
- No celular nada muda.

## Detalhes técnicos
- `PlataformaLayout.tsx`: envolver `children` em `container mx-auto max-w-4xl` (sem padding extra, pois as páginas já usam `px-4` nos blocos internos), igual à Bíblia.
- Conferir se o `ResponsiveHeroBanner` com `card` em `PlataformaPage`, `CoursePage` e `ModulePage` ganha `px-4` para alinhar com o `SectionHeader`.
- `LessonPage`/`LessonPlayer`: mantém o layout lateral (`lg:flex-row`) dentro do mesmo limite; se a coluna `w-80` ficar apertada, usar `max-w-6xl` só na aula.
