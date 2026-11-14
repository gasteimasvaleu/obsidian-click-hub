# Ajustes no carrossel e nos cards da tela inicial

- **Carrossel "Lançamentos":** as capas ficam um pouco mais altas (de 145 para 160px, mantendo o formato), para a parte de baixo não aparecer cortada.
- **Cards coloridos:** descem um pouco (espaço extra acima do primeiro card). O card Comunidade fica menos alto (de 150 para 120px), usando o espaço que sobrava nele.

## Detalhes técnicos
- `src/pages/Index.tsx`: imagem do carrossel `h-[145px] w-[90px]` → `h-[160px] w-[99px]`, botão com `overflow-visible`; seção de lançamentos `mb-6` → `mb-10`; último card `min-h-[150px]` → `min-h-[120px]`.
