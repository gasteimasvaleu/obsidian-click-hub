# Botão "Salvar Anotação" na largura do campo de texto

No Devocional, em "Minhas Anotações", o botão "Salvar Anotação" passa a ocupar a largura toda do card, igual ao campo de texto acima, com a mesma altura dos outros botões do app.

## Detalhes técnicos
- `src/pages/devocional/DailyDevotionalPage.tsx`: adicionar `className="w-full h-11"` ao `Button` de salvar anotação.
