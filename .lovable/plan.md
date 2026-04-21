

## Igualar padding superior da página /amigodivino

A página `/amigodivino` está usando `pt-20` (80px), deixando o card de vídeo mais distante da navbar do que nas demais páginas (que usam `pt-16` / 64px).

### Mudança em `src/pages/AmigoDivino.tsx`

```tsx
// Antes
<div className="pt-20 px-4">

// Depois
<div className="pt-16 px-4">
```

`pt-20` (80px) → `pt-16` (64px) — mesmo espaçamento das demais páginas.

### Risco
Mínimo — alteração de uma classe Tailwind.

