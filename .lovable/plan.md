# Rolagem do aviso de IA só dentro do card

## O que muda
- O título em bolha no topo e os dois botões embaixo ficam sempre fixos e visíveis.
- Só o texto do meio ("Dados enviados", "Para quem", "Proteção" e o aviso da Política) rola, dentro de um card branco com cantos arredondados e borda fina violeta.
- O aviso inteiro não rola mais como um bloco só, e nunca passa da altura da tela.

## Detalhes técnicos
- `AIConsentDialog.tsx`: tirar `overflow-y-auto` do `DialogContent` e usar `flex flex-col max-h-[85vh]` no lugar do grid.
- Envolver o texto em `div` com `flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-2xl border border-primary/30 bg-card p-4`.
- O cabeçalho e o rodapé ficam com `shrink-0`.
