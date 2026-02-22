

# Reduzir fonte "7 anos" no formulario Guia para Pais

## Problema

O texto que mostra a idade da crianca (ex: "7 anos") usa `text-6xl`, que e desproporcionalmente grande em relacao ao restante do formulario.

## Solucao

Em `src/components/guia-pais/ParentsGuideForm.tsx`, linha 168, trocar `text-6xl` por `text-3xl` para manter destaque sem exagero.

| Arquivo | Linha | De | Para |
|---------|-------|----|------|
| `src/components/guia-pais/ParentsGuideForm.tsx` | 168 | `text-6xl font-bold text-primary mb-6` | `text-3xl font-bold text-primary mb-6` |

