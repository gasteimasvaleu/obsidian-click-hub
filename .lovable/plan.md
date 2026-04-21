

## Adicionar padding inferior em /guia-pais

O botão "Próximo" está sendo coberto pela faixa preta inferior do menu tubelight. Vou aumentar levemente o padding inferior do container da página.

### Mudança em `src/pages/GuiaPais.tsx`

Alterar a classe do container raiz:

```tsx
// Antes
<div className="min-h-screen bg-black relative pb-24 overflow-x-hidden">

// Depois
<div className="min-h-screen bg-black relative pb-32 overflow-x-hidden">
```

`pb-24` (96px) → `pb-32` (128px) — pequeno acréscimo de 32px, suficiente para o botão "Próximo" ficar acima da faixa preta da navbar tubelight sem alterar o restante do layout.

### Risco
Mínimo — alteração de uma classe Tailwind.

