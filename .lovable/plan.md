# Fonte do sistema nos cards de título (página Cursos)

## O que muda
- Os títulos das seções e do topo da página Cursos passam a usar a fonte nativa do aparelho (San Francisco no iPhone, Roboto no Android, Segoe UI no Windows).
- Estilo: peso extra-pesado (900), letras mais juntas (-0.025em), tamanho 24px.
- Destaque na última palavra: como o card já é violeta, um gradiente fúcsia/violeta ficaria invisível. Adaptação: a última palavra ganha um gradiente claro (branco → lilás bem claro), que se destaca no fundo violeta.
- Títulos longos continuam quebrando linha normalmente.

## Detalhes técnicos
- `tailwind.config.ts`: adicionar `fontFamily.system` com a pilha `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- `src/index.css`: classe `.text-gradient-title` (background-clip: text, gradiente branco → hsl(268 100% 92%)).
- `CourseCarousel.tsx` (`SectionHeader`): h2 com `font-system font-black tracking-tight text-2xl leading-tight`; separar a última palavra do título em `<span className="text-gradient-title">`.
- Aplicar o mesmo no título do topo da página Cursos que usa o card bolha violeta.
