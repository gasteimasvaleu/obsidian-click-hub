# Remover botão "Voltar" da Liturgia

Na página Liturgia, retirar o botão "Voltar" do topo, igual às outras páginas.

## Detalhes técnicos
- `src/pages/Liturgia.tsx` linha 39: remover `<div className="mb-4"><BackArrowButton to="/" label="Voltar" /></div>`.
- Remover `BackArrowButton` do import (manter `ArrowNavButton`).
