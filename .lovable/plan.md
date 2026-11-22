# Data da Liturgia em card abaixo das setas

Na página Liturgia Diária:
- As setas de dia anterior e próximo dia ficam juntas numa linha, sem texto entre elas (esquerda e direita).
- Logo abaixo, um card no padrão do app (BubbleSection) mostra a data do dia, a bolinha da cor litúrgica e o nome da celebração, centralizados.
- O resto da página (abas e leituras) não muda.

## Detalhes técnicos
- `src/pages/Liturgia.tsx`: linha das setas com `justify-between`; o bloco de data/título sai do meio e vai para um `BubbleSection` abaixo, antes das abas.
