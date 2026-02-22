

# Ajustar badges de comportamento

## Mudancas em `src/components/guia-pais/ParentsGuideForm.tsx`

### 1. Reduzir border-radius dos badges
Os badges herdam `rounded-full` do componente Badge. Adicionar `rounded-lg` na className dos badges para sobrescrever, tanto no step 4 (comportamento) quanto no step 5 (personalidade).

### 2. Adicionar 2 novos tipos de comportamento
Adicionar "Carinhoso" e "Independente" ao array `comportamentoOptions` (linha 23), totalizando 9 opcoes = 3 linhas completas no grid de 3 colunas.

| Local | Mudanca |
|-------|---------|
| Linha 23 | Adicionar "Carinhoso" e "Independente" ao array `comportamentoOptions` |
| Linha 201 | Adicionar `rounded-lg` ao className dos badges de comportamento |
| Linha 225 | Adicionar `rounded-lg` ao className dos badges de personalidade |

