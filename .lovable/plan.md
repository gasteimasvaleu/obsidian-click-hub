

# Posicionar "Caça-palavras" e "Quebra-cabeça" na mesma linha

## Problema

Os botoes de filtro "Caça-palavras" e "Quebra-cabeça" podem estar quebrando em linhas separadas no mobile por serem os mais largos.

## Solucao

Mudar o container dos botoes de tipo de jogo de `flex flex-wrap gap-2` para um grid responsivo que garanta que os dois ultimos botoes fiquem lado a lado. A abordagem mais simples e usar `grid grid-cols-2 sm:grid-cols-5 gap-2`, onde:

- No mobile: 2 colunas, com os 5 botoes distribuidos em 3 linhas (Todos + Quiz, Memoria + Caca-palavras, Quebra-cabeca na ultima)
- No desktop: 5 colunas, todos na mesma linha

Alternativamente, podemos reduzir levemente o tamanho do texto dos botoes no mobile com `text-xs sm:text-sm` para que todos caibam melhor.

## Mudanca

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Games.tsx` | Linha 130: trocar `flex flex-wrap gap-2` por `grid grid-cols-3 sm:grid-cols-5 gap-2` para que no mobile tenhamos 3 colunas (Todos, Quiz, Memoria na primeira linha e Caca-palavras + Quebra-cabeca na segunda) |

Com 3 colunas no mobile, "Caca-palavras" e "Quebra-cabeca" ficarao lado a lado na segunda linha. Os botoes terao `w-full` implicito pelo grid.

