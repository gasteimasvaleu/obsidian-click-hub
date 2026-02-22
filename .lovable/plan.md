

# Corrigir clipPath para alinhar border-radius com o card

## Problema
O `clipPath: inset(-40px -10px 0 -10px round 0 0 1rem 1rem)` usa valores negativos nas laterais (-10px), o que faz o retangulo de recorte ser MAIOR que o card. Os cantos arredondados do clip ficam deslocados em relacao aos cantos visuais do card, causando o vazamento visivel no canto inferior esquerdo.

## Solucao
Usar `0` nos valores laterais e inferior do inset, mantendo apenas o valor negativo no topo (para permitir vazamento). Assim o retangulo de clip se alinha exatamente com as bordas do card, e o `round` aplica o border-radius nos mesmos pontos.

### Alteracoes em `src/pages/Index.tsx`:

**Card principal:**
- De: `clipPath: 'inset(-50px -10px 0 -10px round 0 0 1rem 1rem)'`
- Para: `clipPath: 'inset(-50px 0 0 0 round 0 0 1rem 1rem)'`

**Cards do grid:**
- De: `clipPath: 'inset(-40px -10px 0 -10px round 0 0 1rem 1rem)'`
- Para: `clipPath: 'inset(-40px 0 0 0 round 0 0 1rem 1rem)'`

Com os valores laterais em `0`, o retangulo de recorte coincide com as bordas do card, e o `round 0 0 1rem 1rem` aplica o arredondamento exatamente nos cantos inferiores do card.

