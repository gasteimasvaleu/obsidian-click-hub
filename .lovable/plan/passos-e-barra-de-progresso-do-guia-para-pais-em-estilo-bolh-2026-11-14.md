# Passos e barra de progresso do Guia para Pais em estilo bolha

## Proposta
Trocar o texto "Passo 1 de 9 · 11%" e a barra fina por um card bolha transparente, no mesmo vidro com reflexo no canto dos outros cards, só que translúcido em vez de violeta sólido.

- **Linha de cima:** à esquerda, "Passo 1 de 9" em fonte grossa. À direita, uma pílula violeta pequena com a porcentagem, por exemplo "11%".
- **Barra:** mais alta (cerca de 12px) e arredondada, com o trilho em vidro translúcido. O preenchimento usa um gradiente violeta com brilho suave e um reflexo de luz que passa devagar por ele (o mesmo efeito brilho dos cards). A largura avança com uma transição suave a cada passo.
- **Bolinhas dos passos:** 9 pontos embaixo da barra. Os passos concluídos ficam violeta cheio, o atual fica maior com um anel luminoso e os seguintes ficam translúcidos.
- Com "reduzir movimento" ligado no aparelho, o reflexo e as transições ficam desligados.
- No computador e no iPad, o card acompanha a largura da coluna. No celular, cabe sem quebrar.

## Detalhes técnicos
- Novo componente `src/components/guia-pais/StepProgress.tsx`, com as props `current` e `total`, usado no lugar do bloco "Progress" de `ParentsGuideForm.tsx` (linhas 94–100).
- Contêiner com `feature-bubble` e fundo `bg-card/40` translúcido + `backdrop-blur`, com a sombra suave padrão.
- Preenchimento: `bg-gradient-to-r from-primary to-primary/70`, `transition-[width] duration-500`, sombra `0 0 12px hsl(var(--primary)/0.5)`, e um `::after` com `animate-shine`, que já existe.
- Pontos: `flex justify-between`. Concluído usa `bg-primary`, o atual `h-3 w-3 ring-4 ring-primary/25` e o futuro `bg-primary/20`.
- Só usar tokens de cor do tema, sem cores fixas.
