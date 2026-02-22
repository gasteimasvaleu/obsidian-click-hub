

# Ajustar border-radius do clipPath para valor intermediario

O `1.5rem` ficou grande demais e esta cortando a borda do card. Vamos usar um valor entre `1rem` e `1.5rem`.

## Alteracoes em `src/pages/Index.tsx`:

**Card principal:**
- De: `clipPath: 'inset(-35px 0 0 0 round 0 0 1.5rem 1.5rem)'`
- Para: `clipPath: 'inset(-35px 0 0 0 round 0 0 1.25rem 1.25rem)'`

**Cards do grid:**
- De: `clipPath: 'inset(-25px 0 0 0 round 0 0 1.5rem 1.5rem)'`
- Para: `clipPath: 'inset(-25px 0 0 0 round 0 0 1.25rem 1.25rem)'`

`1.25rem` (20px) fica exatamente entre `1rem` (16px) e `1.5rem` (24px).

