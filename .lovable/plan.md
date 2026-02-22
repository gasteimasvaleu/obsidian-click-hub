

# Centralizar textos dos cards

## Alteracao

No arquivo `src/pages/Index.tsx`, centralizar o texto em todos os cards adicionando `text-center` e ajustando o layout para `justify-center`.

### Card principal (linha 73)
De: `<span className="text-white font-bold text-base">`
Para: `<span className="text-white font-bold text-base text-center w-full">`

### Cards do grid (linha 88)
De: `<span className="text-white font-semibold text-sm leading-tight">`
Para: `<span className="text-white font-semibold text-sm leading-tight text-center w-full">`

