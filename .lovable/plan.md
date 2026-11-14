# Trocar o brilho da logo por um contorno preto animado

- Sai a sombra violeta.
- A logo ganha um contorno preto fino (cerca de 1px) em volta das letras.
- Animação suave: a cada cerca de 6 segundos, a logo dá um leve "pulo" (sobe 2px e cresce 4%) e volta. O contorno fica um pouco mais marcado nesse momento.
- O tamanho maior (36px) continua; quem usa "reduzir movimento" vê só o contorno, sem animação.

## Detalhes técnicos
- Em `src/index.css`: `.logo-pop` passa a usar 4 `drop-shadow` pretos de 1px, e a `logo-breathe` passa a animar `transform` (translateY/scale) com o contorno em 1.5px no pico. A regra de reduzir movimento é mantida.
