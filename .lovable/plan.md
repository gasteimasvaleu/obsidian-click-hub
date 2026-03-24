

## Chat full-height com scroll interno

### Problema
O chat usa `min-h-screen` com scroll na pagina inteira, deixando espaço vazio abaixo do composer no celular. O card não ocupa a altura disponível.

### Solução
Transformar o layout em flex column com altura fixa (`h-screen`), onde apenas a area de mensagens tem scroll interno. O card ocupa todo o espaço entre a navbar e o bottom safe area.

### Alterações em `src/components/ChatInterface.tsx`

**Container raiz (linha 135)**:
- De: `min-h-screen bg-background relative overflow-x-hidden` com `paddingBottom`
- Para: `h-screen flex flex-col bg-background overflow-hidden`

**Wrapper do card (linha 139)**:
- De: `pt-16 px-3 pb-2`
- Para: `pt-16 px-3 flex-1 flex flex-col min-h-0` com `paddingBottom: calc(env(safe-area-inset-bottom) + 0.5rem)`

**Card interno (linha 140)**:
- De: `max-w-3xl mx-auto overflow-hidden`
- Para: `max-w-3xl mx-auto flex-1 flex flex-col min-h-0 overflow-hidden`

**Area de mensagens (linha 164)**:
- De: sem controle de scroll
- Para: `flex-1 overflow-y-auto min-h-0` (scroll apenas aqui)

**Header e Composer**: permanecem fixos no topo e rodapé do card, sem scroll.

