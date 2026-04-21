

## Igualar padding superior da página inicial às demais

Na página `/` (Index), o espaço entre a navbar tubelight e o primeiro card (vídeo hero) está maior que nas outras páginas. Vou alinhar o valor.

### Comparação atual

| Página | Padding-top do container | Resultado |
|---|---|---|
| `/` (Index) | `pt-20` (80px) no wrapper do vídeo | Maior espaço |
| `/plataforma`, demais | `pt-16` (64px) via `PlataformaLayout` / equivalente | Menor espaço |

### Mudança em `src/pages/Index.tsx`

Alterar o wrapper do card de vídeo:

```tsx
// Antes
<div className="flex justify-center w-full pt-20 pb-4 px-4">

// Depois
<div className="flex justify-center w-full pt-16 pb-4 px-4">
```

`pt-20` (80px) → `pt-16` (64px) — agora idêntico ao espaçamento das outras páginas.

### Risco
Mínimo — alteração de uma classe Tailwind em um único elemento.

