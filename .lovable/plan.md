

## Adicionar padding inferior no AdminLayout

### Mudança

**Arquivo:** `src/components/admin/AdminLayout.tsx` (linha 15)

- Adicionar `pb-32` ao `<main>` para garantir que o conteúdo não fique atrás da navbar inferior
- Classe atual: `flex-1 p-8 ml-64 mt-16`
- Classe nova: `flex-1 p-8 pb-32 ml-64 mt-16`

Uma única mudança de classe CSS.

