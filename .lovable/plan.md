

## Adicionar padding inferior no sidebar admin

### Problema
Os últimos itens do menu lateral (como "Aulas" e "Materiais") ficam escondidos atrás da navbar inferior tubelight.

### Mudança

**Arquivo:** `src/components/admin/AdminSidebar.tsx` (linha 25)

- Adicionar `pb-32` ao `<nav>` para criar espaço no final da lista
- Classe atual: `p-4 space-y-2`
- Classe nova: `p-4 pb-32 space-y-2`

Uma única mudança de classe CSS.

