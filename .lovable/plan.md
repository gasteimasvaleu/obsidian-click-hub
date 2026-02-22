

# Ajustar clipPath para melhor alinhamento

Diminuir os valores negativos do `inset` no `clipPath` para que o recorte fique mais justo ao card.

## Alteracoes em `src/pages/Index.tsx`:

**Card principal:**
- De: `clipPath: 'inset(-50px 0 0 0 round 0 0 1rem 1rem)'`
- Para: `clipPath: 'inset(-35px 0 0 0 round 0 0 1rem 1rem)'`

**Cards do grid:**
- De: `clipPath: 'inset(-40px 0 0 0 round 0 0 1rem 1rem)'`
- Para: `clipPath: 'inset(-25px 0 0 0 round 0 0 1rem 1rem)'`

Isso reduz o espaco de vazamento no topo, mantendo as imagens visiveis mas com o recorte mais proximo das bordas do card.

