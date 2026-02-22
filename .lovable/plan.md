

# Reduzir fonte do titulo "Amigo Divino"

## Problema
O titulo "Amigo Divino - Orientador Espiritual" esta quebrando em duas linhas no header do chat.

## Solucao
Reduzir o tamanho da fonte de `text-xl` para `text-base` na linha 98 de `src/components/ChatInterface.tsx`, para que o titulo caiba em uma unica linha.

## Detalhe tecnico

**Arquivo:** `src/components/ChatInterface.tsx`, linha 98

Alterar:
```
text-xl font-bold
```
Para:
```
text-base font-bold
```

