

## Aumentar padding inferior em /colorir

O grid de desenhos na página `/colorir` está terminando muito próximo da faixa preta da navbar tubelight inferior.

### Mudança em `src/pages/colorir/ColorirPage.tsx`

Alterar a classe do container raiz:

```tsx
// Antes
<div className="min-h-screen bg-background pb-24">

// Depois
<div className="min-h-screen bg-background pb-32">
```

`pb-24` (96px) → `pb-32` (128px) — pequeno acréscimo de 32px, deixando o último card de desenho com respiro acima da navbar.

### Risco
Mínimo — alteração de uma classe Tailwind.

