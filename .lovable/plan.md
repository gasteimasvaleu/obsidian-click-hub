

## Restaurar bordas arredondadas e ajustar espaçamentos

### Problema
O chat ficou totalmente quadrado (sem border-radius) e o header verde continua com espaço excessivo no topo por causa do safe-area-inset-top somado ao padding.

### Solução
Manter o layout `fixed inset-0` mas adicionar um wrapper interno com `rounded-2xl overflow-hidden` e margens pequenas (`mx-3 my-2`) para dar o visual de card com bordas. Ajustar o safe-area no container externo em vez de dentro do header.

### Alterações em `src/components/ChatInterface.tsx`

1. **Container raiz** — manter `fixed inset-0 z-50 bg-background` mas adicionar padding com safe-areas:
   - `paddingTop: env(safe-area-inset-top)`
   - `paddingBottom: env(safe-area-inset-bottom)`
   - Adicionar `p-3` para margem visual ao redor do card

2. **Adicionar wrapper card** — um `div` filho com `flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0` que contém header, mensagens e composer. Isso restaura as bordas arredondadas.

3. **Header verde** — remover o `paddingTop` com safe-area (já tratado no container pai). Manter apenas `px-4 py-3`.

4. **Composer branco** — remover o `paddingBottom` com safe-area (já tratado no container pai). Adicionar `rounded-b-2xl` implícito via overflow do wrapper.

### Resultado
- Card com bordas arredondadas bonitas
- Safe areas tratadas no container externo
- Header e composer encaixados sem espaço extra
- Scroll apenas na área de mensagens

