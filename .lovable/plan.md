

# Adicionar mais uma personalidade para completar 3 linhas

Atualmente o array `personalidadeOptions` tem 8 itens. No grid de 3 colunas, isso resulta em 2 linhas completas + 1 linha com apenas 2 itens. Adicionando 1 item, teremos 9 = 3 linhas completas.

## Mudanca

Em `src/components/guia-pais/ParentsGuideForm.tsx`, linha 27, adicionar "Aventureiro" ao array `personalidadeOptions`.

**De:**
```
"Extrovertido", "Introvertido", "Criativo", "Lógico",
"Emocional", "Racional", "Competitivo", "Colaborativo"
```

**Para:**
```
"Extrovertido", "Introvertido", "Criativo", "Lógico",
"Emocional", "Racional", "Competitivo", "Colaborativo", "Aventureiro"
```

