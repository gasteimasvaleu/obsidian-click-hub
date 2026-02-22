

# Badges de comportamento ocupando toda a linha

## Problema

Os badges de comportamento (Agitado, Timido, Curioso, etc.) usam `flex flex-wrap gap-2` e nao preenchem toda a largura disponivel.

## Solucao

Em `src/components/guia-pais/ParentsGuideForm.tsx`, linha 197, trocar `flex flex-wrap gap-2` por `grid grid-cols-3 sm:grid-cols-4 gap-2` para distribuir os badges uniformemente. Tambem aplicar a mesma mudanca na linha 215 (badges de personalidade, step 5) para manter consistencia.

| Arquivo | Linha | De | Para |
|---------|-------|----|------|
| `src/components/guia-pais/ParentsGuideForm.tsx` | 197 | `flex flex-wrap gap-2` | `grid grid-cols-3 sm:grid-cols-4 gap-2` |
| `src/components/guia-pais/ParentsGuideForm.tsx` | 215 | `flex flex-wrap gap-2` | `grid grid-cols-3 sm:grid-cols-4 gap-2` |

Os badges tambem precisam de `text-center justify-center` para ficarem centralizados dentro de cada celula do grid.

