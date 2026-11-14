# Reflexo da bolha no canto superior esquerdo

O brilho branco dos cards de atalho sai do meio da parte de cima e passa a ficar colado no canto superior esquerdo, acompanhando a curva arredondada do card. Todo o resto continua igual.

## Detalhes técnicos
- Em `src/index.css`, no `.feature-bubble::before`: `left: 0; top: 0; width: 55%; height: 60%;`, `border-top-left-radius: inherit` (segue o arredondamento do card) e gradiente radial ancorado em `at 0% 0%` (branco ~0.5 até transparente em ~70%).
