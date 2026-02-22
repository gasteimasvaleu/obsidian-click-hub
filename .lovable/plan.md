

# Diminuir border-radius do clipPath

O `1.25rem` ainda esta cortando a borda do card. Vamos reduzir para `1.1rem`.

## Alteracoes em `src/pages/Index.tsx`:

**Card principal:**
- De: `clipPath: 'inset(-35px 0 0 0 round 0 0 1.25rem 1.25rem)'`
- Para: `clipPath: 'inset(-35px 0 0 0 round 0 0 1.1rem 1.1rem)'`

**Cards do grid:**
- De: `clipPath: 'inset(-25px 0 0 0 round 0 0 1.25rem 1.25rem)'`
- Para: `clipPath: 'inset(-25px 0 0 0 round 0 0 1.1rem 1.1rem)'`

`1.1rem` (17.6px) fica bem proximo do `1rem` (16px) original, mas com um leve arredondamento extra.

