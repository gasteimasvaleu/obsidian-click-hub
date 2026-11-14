# Fonte do sistema nos cards de título (todas as páginas)

## O que muda
- Os títulos dentro dos cards bolha violeta, em todas as páginas do app (Início, Cursos e demais telas), passam a usar a fonte nativa do aparelho (San Francisco no iPhone, Roboto no Android, Segoe UI no Windows).
- Estilo: peso extra-pesado (900), letras mais juntas (-0.025em), tamanho 24px.
- Destaque na última palavra: como o card já é violeta, um gradiente fúcsia/violeta ficaria invisível. Adaptação: a última palavra ganha um gradiente claro (branco → lilás bem claro), que se destaca no fundo violeta.
- Títulos longos continuam quebrando linha normalmente.

## Detalhes técnicos
- `tailwind.config.ts`: adicionar `fontFamily.system` com a pilha `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- `src/index.css`: classe `.text-gradient-title` (background-clip: text, gradiente branco → hsl(268 100% 92%)).
- `CourseCarousel.tsx` (`SectionHeader`): h2 com `font-system font-black tracking-tight text-2xl leading-tight`; separar a última palavra do título em `<span className="text-gradient-title">`.
- Criar uma classe única `.bubble-title` (fonte, peso, tracking, tamanho) e aplicá-la a todos os títulos dentro de cards `bubble-user` no app (Index, Plataforma e demais páginas), para manter um só padrão.
- Painel Admin fica de fora.
