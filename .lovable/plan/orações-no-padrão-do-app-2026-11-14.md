# Orações no padrão do app

## O que muda
- **Título da categoria** (ex.: "Família"): vira a bolha violeta com a última palavra em destaque, e "10 orações" aparece no card branco logo abaixo, igual às outras páginas.
- **Cada oração:** o título da oração vira bolha violeta (com a estrela de favoritar dentro da bolha, à direita) e o texto fica no card branco colado embaixo, como em "Minhas Anotações" do Devocional.
- **Botões Copiar e Compartilhar:** viram uma barra arredondada única com ícones, igual à barra de ações dos versículos da Bíblia.

## Detalhes técnicos
- `src/pages/Oracoes.tsx`: trocar o `h2` por `<SectionHeader title={selectedCategoryName} description="N orações" />`.
- `src/components/oracoes/PrayerCard.tsx`: bolha `neon-glow-user feature-bubble bubble-user` + `border-beam` + `BubbleTitleText`, estrela como botão absoluto dentro da bolha; `GlassCard className="-mt-4 pt-7 rounded-t-none"` com o conteúdo; ações em barra `rounded-full border divide-x` com botões de ícone `h-11` (Copiar/Check, Compartilhar), mantendo `ParentalGate`.
