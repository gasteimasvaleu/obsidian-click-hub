

## Ajuste de Espaço entre Política de Famílias e Menu

**Problema:** O `pb-36` no container principal (necessário para não esconder conteúdo atrás do tubelight menu) combinado com `pb-8` no div interno e `space-y-6` cria um espaço excessivo abaixo do card de Política de Famílias.

**Solução:** Reduzir o `pb-36` para `pb-24` no container principal do `Index.tsx`. Isso mantém espaço suficiente para o menu fixo inferior, mas elimina o excesso visual.

**Arquivo:** `src/pages/Index.tsx`
- Linha do container principal: alterar `pb-36` para `pb-24`

