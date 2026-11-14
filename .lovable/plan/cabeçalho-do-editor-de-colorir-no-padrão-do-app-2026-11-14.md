# Cabeçalho do editor de colorir no padrão do app

Hoje, o botão de voltar, o título pequeno e o botão Salvar ficam espremidos numa linha com uma borda embaixo.

## Como vai ficar
- **Voltar:** a barra violeta de setinhas animadas que já usamos nas outras páginas, no tamanho normal, sozinha no topo.
- **Título:** o nome do desenho (ex.: "Foto Transformada") numa bolha violeta, com a fonte forte do app e a última palavra em degradê, igual aos títulos das outras telas.
- **Salvar:** vira um botão violeta da largura toda, com ícone, logo abaixo da paleta de cores, no fim das ferramentas, para não brigar com o título.
- A linha cinza que separava o topo sai.

## Detalhes técnicos
- `ColoringEditorPage.tsx`: header vira `px-3 pt-3 space-y-3` com `BackArrowButton` + bolha (`neon-glow-user feature-bubble bubble-user rounded-2xl px-4 py-3` + `border-beam` + `BubbleTitleText`).
- Botão Salvar `w-full h-11` movido para depois do `ColorPalette`.
