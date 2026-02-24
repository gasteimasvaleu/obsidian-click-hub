

# Zoom no Canvas de Colorir

## Objetivo
Adicionar controle de zoom (pinch-to-zoom no mobile + botoes de zoom) ao canvas do editor de colorir, permitindo que o usuario amplie areas para colorir com mais precisao.

## Abordagem
Usar CSS `transform: scale()` no wrapper do canvas, sem alterar o canvas interno (assim o desenho/coordenadas continuam funcionando normalmente). Adicionar pan (arrastar para mover) quando o zoom estiver ativo.

## Alteracoes

### 1. `src/components/colorir/ColoringCanvas.tsx`
- Adicionar estado de `zoom` (1x a 4x) e `offset` (pan x/y)
- Aplicar `transform: scale(zoom) translate(offset)` no container do canvas
- Detectar pinch-to-zoom via touch events (2 dedos) no wrapper div
- Quando ha 2 dedos tocando, bloquear o desenho e fazer zoom/pan
- Quando ha 1 dedo, manter comportamento atual de desenho
- Adicionar suporte a scroll wheel para zoom no desktop

### 2. `src/components/colorir/ToolBar.tsx`
- Adicionar botoes de Zoom In (+), Zoom Out (-) e Reset (1:1) na barra de ferramentas
- Posicionar apos o separador de undo/redo

### 3. `src/hooks/useColoringCanvas.tsx`
- Exportar estado `zoom` e `setZoom` para uso externo
- Nenhuma alteracao na logica de desenho (as coordenadas ja sao calculadas via `getBoundingClientRect` que respeita o scale CSS)

## Arquivos afetados
1. `src/components/colorir/ColoringCanvas.tsx` - Logica de zoom/pan + pinch gesture
2. `src/components/colorir/ToolBar.tsx` - Botoes de zoom
3. `src/hooks/useColoringCanvas.tsx` - Estado de zoom exportado
