# Diminuir um pouco o card do Frei no login

- O card violeta com a imagem do Frei fica cerca de 15% menor, centralizado.
- Fundo violeta, borda luminosa e imagem continuam iguais, só que menores.

## Detalhes técnicos
- Em `src/pages/Login.tsx`: no wrapper do card, adicionar `mx-auto w-[85%] max-w-sm`; na imagem, trocar `max-w-xs` por `max-w-[16rem]`.
