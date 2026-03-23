

## Corrigir zoom automático do iOS no chat Amigo Divino

### Problema
O textarea do chat usa `text-sm` (14px), que no iOS Safari causa zoom automático ao focar — mesmo problema que foi corrigido no Guia para os Pais.

### Solução
Alterar a classe do textarea de `text-sm` para `text-base` (16px), que é o tamanho mínimo que o iOS respeita sem fazer auto-zoom.

### Arquivo a editar
**`src/components/ChatInterface.tsx`** (linha 253):
- Trocar `text-sm` por `text-base` na className do textarea

