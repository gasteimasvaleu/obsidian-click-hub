# Card do Frei com a mesma largura do card de login

- O card violeta passa a ter a mesma largura do card branco dos botões, logo abaixo.
- A imagem do Frei continua no tamanho menor de agora, centralizada, então a altura do card praticamente não muda.

## Detalhes técnicos
- Em `src/pages/Login.tsx`: remover `mx-auto w-[85%] max-w-sm` do wrapper do card e manter a imagem com `max-w-[16rem]`.
