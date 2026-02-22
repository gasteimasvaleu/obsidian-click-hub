

# Botoes de dificuldade ocupando toda a linha

## Problema

Os 4 botoes de dificuldade (Todas, Facil, Medio, Dificil) usam `flex flex-wrap gap-2` e nao ocupam toda a largura disponivel.

## Solucao

Trocar `flex flex-wrap gap-2` por `grid grid-cols-4 gap-2` na linha 178. Com 4 colunas, cada botao ocupa 1/4 da largura total, preenchendo toda a linha horizontal.

## Mudanca

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Games.tsx` | Linha 178: trocar `flex flex-wrap gap-2` por `grid grid-cols-4 gap-2` |

