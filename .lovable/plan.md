

# Ajustar imagens coladas na borda inferior com clip no bottom

## Objetivo
Posicionar as imagens coladas na borda inferior do card (bottom-0) e usar clip-path para cortar apenas a parte inferior, permitindo que o topo continue vazando. O border-radius do card vai cortar a imagem na parte de baixo, criando um visual ajustado.

## Solucao tecnica

Usar `clipPath: inset(-50px -10px 0 -10px)` nos cards com imagem. Isso permite overflow no topo (valores negativos) mas corta na borda inferior do card (valor 0).

### Alteracoes em `src/pages/Index.tsx`:

1. **Card principal (linha ~65-74):** Trocar `overflow-visible` por `overflow-hidden` e adicionar `style={{ clipPath: 'inset(-50px -10px 0px -10px)' }}` no GlassCard. Mudar imagem de `bottom-2` para `bottom-0`.

2. **Cards do grid (linha ~83-103):** Mesmo ajuste: adicionar clipPath inline e posicionar imagem/placeholder em `bottom-0`.

### Alteracao no `GlassCard.tsx`:
Adicionar suporte a prop `style` para permitir estilos inline.

