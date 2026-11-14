# Trocar o brilho da logo por um contorno preto

- Sai a sombra violeta e o brilho animado.
- A logo ganha um contorno preto fino, de mais ou menos 1px, em volta das letras, sem animação.
- O tamanho maior (36px) continua.

## Detalhes técnicos
- Em `src/index.css`: `.logo-pop` passa a usar só `filter` com 4 `drop-shadow` pretos de 1px (cima, baixo, esquerda e direita), sem animação. Remover os `@keyframes logo-breathe` e a regra de reduzir movimento.
