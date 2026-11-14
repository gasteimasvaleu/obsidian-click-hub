# Cards de atalho com efeito "bolha de água"

Sim, dá para melhorar bastante. A ideia é deixar os cards empilhados com aparência de vidro/bolha, sem perder as cores de cada um.

## Como fica
- **Cor translúcida:** cada card mantém a cor atual (azul, roxo, amarelo, vermelho, verde etc.), mas um pouco transparente, deixando ver levemente o card de baixo.
- **Reflexo de bolha:** um brilho branco suave na parte de cima de cada card, como a luz batendo numa bolha.
- **Borda de vidro:** um contorno fino e claro em volta, e uma leve sombra interna embaixo, dando volume arredondado.
- **Círculo da seta:** vira uma pequena bolha de vidro (branco translúcido) em vez do círculo escuro.
- **Mantido:** empilhamento, brilho deslizante, ícones, textos brancos e o card Comunidade alongado.
- Textos continuam bem legíveis, inclusive no card amarelo.

## Detalhes técnicos
- `src/index.css`: nova classe utilitária `.feature-bubble` com `backdrop-blur-md`, borda `hsl(0 0% 100% / 0.35)`, `box-shadow` inset (brilho no topo e sombra suave embaixo) e um pseudo-elemento `::before` com gradiente radial branco para o reflexo.
- `src/pages/Index.tsx`: trocar `bg-feature-*` por `bg-feature-*/75` + `feature-bubble`; círculo da seta passa para `bg-feature-foreground/20 border border-feature-foreground/40 backdrop-blur`.
- Cores continuam vindo dos tokens `--feature-*`.
