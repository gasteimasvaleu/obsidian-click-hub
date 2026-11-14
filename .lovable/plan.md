# Organizar ferramentas e paleta do editor de colorir

## Barra de ferramentas (hoje: 9 botões soltos + "100%" numa linha só, apertada no celular)
Dividir em duas barras arredondadas no padrão do app (borda fina, divisórias, ativo em violeta clarinho, sem brilho neon):
- **Linha 1 – Ferramentas:** Pincel | Balde | Borracha | Desfazer | Refazer (5 partes iguais, ocupando toda a largura).
- **Linha 2 – Zoom:** Diminuir | "100%" | Aumentar | Ajustar à tela (4 partes iguais).
Botões com altura 44px, ícones centralizados, desativados em cinza claro.

## Paleta de cores (hoje: 25 bolinhas quebrando em linhas tortas)
- Card branco arredondado com grade fixa de **8 colunas x 3 linhas** (24 cores), bolinhas do mesmo tamanho e alinhadas.
- Cores reordenadas em degradê (vermelhos → amarelos → verdes → azuis → roxos → rosas → marrons → cinzas).
- Cor escolhida: anel violeta ao redor (sem aumentar e empurrar as vizinhas).
- Botão "+" (cor personalizada) vira uma faixa à parte ao lado da prévia da cor atual, no rodapé do card, para não quebrar a grade.

## Detalhes técnicos
- `ToolBar.tsx`: dois `div rounded-full border divide-x` com `button h-11 flex-1`, ativo `bg-primary/10 text-primary`.
- `ColorPalette.tsx`: `GlassCard` + `grid grid-cols-8 gap-2`, swatches `aspect-square w-full rounded-full`, selecionado `ring-2 ring-primary ring-offset-2`.
- Nada muda na lógica do canvas.
