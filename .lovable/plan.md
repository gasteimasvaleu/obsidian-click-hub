# Sombra do card "Guia para Pais" sem corte

## Por que corta
A área que envolve o formulário do Guia para Pais esconde tudo o que passa das bordas dela. Como o card encosta nessas bordas, a sombra das laterais e de baixo fica cortada.

## Correção
Remover esse corte da área do formulário. A tela continua sem rolagem para os lados, porque a página inteira já impede isso.

## Detalhes técnicos
- `src/components/guia-pais/ParentsGuideForm.tsx` linha 88: tirar `overflow-hidden` de `max-w-2xl mx-auto animate-fade-in overflow-hidden`.
- `src/pages/GuiaPais.tsx` linha 154: tirar `overflow-hidden` de `pt-16 px-4 overflow-hidden`. A rolagem lateral continua bloqueada pelo `overflow-x-hidden` da raiz.
