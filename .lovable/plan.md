
# Reduzir tamanho da fonte nos titulos dos jogos

## Problema

Os titulos dos cards de jogos usam `text-2xl` (1.5rem / 24px), enquanto o padrao do app em outros cards (como Oracoes, Audiofy) e `text-lg` (1.125rem / 18px).

## Solucao

Alterar a classe do titulo de `text-2xl` para `text-lg` na linha 252 de `src/pages/Games.tsx`.

## Arquivo editado

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/Games.tsx` | Linha 252: trocar `text-2xl` por `text-lg` no `h3` do titulo do jogo |
