

# Correções no Chat do Amigo Divino

## Alterações em `src/components/ChatInterface.tsx`

1. **Remover ScrollArea** — substituir `<ScrollArea className="flex-1 px-3">` por `<div className="flex-1 overflow-y-auto scrollbar-none px-3">` e remover o import do `ScrollArea`
2. **Aumentar padding inferior do input** — trocar `pb-24` por `pb-28` na linha 238

Sub-header permanece translúcido como está.

