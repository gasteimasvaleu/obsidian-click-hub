

## Igualar padding superior da página /devocional

A página `/devocional` está usando `pt-20` (80px) no container, deixando o card de vídeo mais distante da navbar do que nas outras páginas (que usam `pt-16` / 64px).

### Mudança em `src/pages/devocional/DailyDevotionalPage.tsx`

```tsx
// Antes
<div className="container mx-auto px-4 pt-20 max-w-3xl">

// Depois
<div className="container mx-auto px-4 pt-16 max-w-3xl">
```

`pt-20` (80px) → `pt-16` (64px) — mesmo espaçamento das demais páginas.

### Risco
Mínimo — alteração de uma classe Tailwind.

