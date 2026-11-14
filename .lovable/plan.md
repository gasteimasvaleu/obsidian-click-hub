# Ajustar o card "Acessar Cursos"

- **Imagem do personagem:** descer um pouco, até a parte de baixo dela encostar exatamente na borda inferior do card.
- **Texto "Acessar Cursos":** ficar centralizado no espaço entre a imagem e a setinha.

## Detalhes técnicos
- Em `src/pages/Index.tsx`, na `<img>` do card, adicionar `object-bottom` (hoje `object-contain` centraliza a figura verticalmente e deixa uma folga embaixo) e manter `bottom-0`.
- No `<span>` do título, adicionar `flex-1 text-center`.
