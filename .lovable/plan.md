# Filtro de categorias do Colorir no padrão do app

## O que muda
- **Título:** "Categoria" vira a bolha violeta com a última palavra em destaque, e "N desenhos disponíveis" fica no card branco colado embaixo (igual às outras páginas).
- **Botões:** Todos, Contos, Parábolas e Personagens viram uma barra arredondada única dividida em 4 partes, no estilo da barra de ações dos versículos. Cada parte tem ícone e nome; a escolhida fica com fundo violeta clarinho e texto violeta, sem o brilho neon antigo.
- O texto da contagem passa a ser "1 desenho disponível" / "N desenhos disponíveis".

## Detalhes técnicos
- `ColorirPage.tsx`: trocar o `GlassCard` por `SectionHeader title="Categoria" description={...}` + `GlassCard className="-mt-4 pt-7 rounded-t-none"` contendo o `CategoryFilter`. Como o `SectionHeader` já anexa a descrição, a contagem vai na descrição e o filtro vem no card abaixo dela.
- `CategoryFilter.tsx`: `div` `flex rounded-full border border-primary/30 divide-x divide-primary/20 overflow-hidden`; botões `flex-1 h-12 flex flex-col items-center justify-center text-[11px]`, ativo `bg-primary/10 text-primary`, inativo `text-foreground/60`.
