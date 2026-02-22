

# Aumentar border-radius do clipPath

Aumentar o valor do `round` no `clipPath` para que os cantos inferiores fiquem mais arredondados, cortando melhor a imagem no canto inferior esquerdo.

## Alteracoes em `src/pages/Index.tsx`:

**Card principal (linha 68):**
- De: `clipPath: 'inset(-35px 0 0 0 round 0 0 1rem 1rem)'`
- Para: `clipPath: 'inset(-35px 0 0 0 round 0 0 1.5rem 1.5rem)'`

**Cards do grid (linha 89):**
- De: `clipPath: 'inset(-25px 0 0 0 round 0 0 1rem 1rem)'`
- Para: `clipPath: 'inset(-25px 0 0 0 round 0 0 1.5rem 1.5rem)'`

O `1.5rem` (24px) e maior que o `1rem` (16px) anterior, fazendo com que o arredondamento nos cantos inferiores seja mais pronunciado e corte melhor a imagem.

