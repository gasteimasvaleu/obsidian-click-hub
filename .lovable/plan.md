

# Ajustar filtros de tipo de jogo para caber em uma linha

## Problema

Com `grid-cols-3`, os botoes "Caca-palavras" e "Quebra-cabeca" ficam na segunda linha sem estilo adequado e com texto cortado/sobreposto.

## Solucao

Fazer todos os 5 botoes caberem em uma unica linha no mobile usando:

- `grid grid-cols-5` (sempre 5 colunas, inclusive no mobile)
- `gap-1.5` em vez de `gap-2` para economizar espaco
- `text-xs` nos botoes no mobile para que o texto caiba
- Esconder o icone no mobile para economizar mais espaco

## Mudanca

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Games.tsx` | Linha 130: trocar `grid grid-cols-3 sm:grid-cols-5 gap-2` por `grid grid-cols-5 gap-1.5 sm:gap-2` |
| `src/pages/Games.tsx` | Linha 140: adicionar `text-xs sm:text-sm` na className do Button |
| `src/pages/Games.tsx` | Linha 144: esconder icone no mobile com `hidden sm:block` no IconComponent |

Com essas 3 mudancas, todos os 5 botoes ficarao em uma unica linha horizontal, mesmo em telas pequenas.

