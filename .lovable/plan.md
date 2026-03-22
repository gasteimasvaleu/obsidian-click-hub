

## Melhorias visuais no drawer "Mais" + posicionamento acima da navbar

### O que muda

**1. Drawer aparece acima da faixa preta e do tubelight menu**
- Substituir o `Sheet` (Radix Dialog com overlay) por um painel customizado com `framer-motion` (`AnimatePresence` + `motion.div`)
- O painel se posiciona como `fixed bottom-[X]` onde X é a altura da navbar + safe-area, ficando visualmente acima da barra preta e do tubelight
- Sem overlay escuro cobrindo a tela inteira — apenas o painel sobe suavemente

**2. Animações e melhorias visuais**
- Entrada: slide-up + fade-in com spring animation via `framer-motion`
- Saída: slide-down + fade-out
- Cada item do grid aparece com staggered animation (delay escalonado) para um efeito cascata
- Ícones dos items com hover scale sutil
- Glassmorphism no painel (backdrop-blur, border neon sutil)
- Item da página atual com glow neon verde

### Arquivo modificado

**`src/components/ui/tubelight-navbar.tsx`**
- Remover import do `Sheet` / `SheetContent` / etc.
- Adicionar `AnimatePresence` do framer-motion
- Criar o painel customizado como `motion.div` posicionado `fixed` acima da navbar
- Calcular posição com CSS: `bottom-[calc(env(safe-area-inset-bottom)+4.5rem)]` (altura aprox. da navbar)
- Grid 3 colunas com items animados individualmente (stagger)
- Backdrop click para fechar (div transparente atrás)

### Resultado visual
- O drawer sobe suavemente acima do menu, sem cobrir a navbar
- Items aparecem em cascata com glassmorphism
- Experiência mais fluida e integrada ao design futurista

