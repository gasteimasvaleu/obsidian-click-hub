# Manter o tamanho anterior da imagem de boas-vindas

A nova imagem do frei com a placa continua no login, mas volta ao mesmo tamanho máximo da imagem anterior.

## Mudança
- Na tela de login, a imagem volta a ter largura máxima de 16rem, centralizada, como antes.

## Detalhes técnicos
- `src/pages/Login.tsx`: a classe do `<img>` volta a ser `mx-auto w-full max-w-[16rem] object-contain`.
