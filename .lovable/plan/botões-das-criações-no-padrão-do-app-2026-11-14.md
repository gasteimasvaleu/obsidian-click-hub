# Botões das criações no padrão do app

Trocar os dois botões desalinhados ("Compartilhar" e a lixeira) por uma barra arredondada única, dividida ao meio, só com ícones, igual às ações dos versículos e das orações.

## O que muda
- Uma barra com borda fina e cantos totalmente redondos, ocupando a largura do card.
- Metade esquerda: ícone de compartilhar. Metade direita: ícone de lixeira em vermelho.
- Os dois botões ficam com a mesma altura (44px) e alinhados, com nome acessível para leitores de tela.

## Detalhes técnicos
- `src/components/colorir/CreationCard.tsx`: substituir os dois `Button` por `div flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border` com dois `button h-11 flex-1` (aria-label "Compartilhar" / "Excluir"), ícones de 18px, lixeira `text-destructive`.
