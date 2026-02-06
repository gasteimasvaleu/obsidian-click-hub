

# Fix: Canvas de Colorir nao funciona

## Problema Raiz

Existem dois bugs interligados no hook `useColoringCanvas`:

### Bug 1: Loop infinito no carregamento da imagem
A cadeia de dependencias cria um ciclo infinito:
- `saveToHistory` depende de `[history, historyIndex]`
- `loadImage` depende de `[saveToHistory]`
- O `useEffect` no `ColoringCanvas` depende de `[imageUrl, loadImage]`
- Quando `saveToHistory` atualiza o historico, `loadImage` e' recriado, o useEffect roda de novo, recarrega a imagem, chama `saveToHistory` novamente... loop infinito

### Bug 2: Stale closures nas funcoes de desenho
- A funcao `draw` captura `isDrawing` no momento da criacao
- Entre o `mouseDown` (que faz `setIsDrawing(true)`) e o proximo render, `draw` ainda ve `isDrawing = false`
- Resultado: os tracos nao sao renderizados

## Solucao

Refatorar o hook `useColoringCanvas` usando `useRef` para valores mutaveis, quebrando a cadeia de dependencias e eliminando closures stale.

### Alteracoes:

**Arquivo: `src/hooks/useColoringCanvas.tsx`**

1. Usar `useRef` para `history` e `historyIndex` — assim `saveToHistory` nao precisa deles como dependencia de `useCallback`
2. Usar `useRef` para `isDrawing` — assim `draw` sempre ve o valor atual
3. Usar `useRef` para `color`, `tool`, `brushSize` — para que `startDrawing` e `draw` usem valores sempre atuais
4. `saveToHistory` tera dependencias `[]` (estavel)
5. `loadImage` tera dependencias `[]` (estavel)
6. Resultado: o useEffect no ColoringCanvas roda apenas uma vez

**Arquivo: `src/components/colorir/ColoringCanvas.tsx`**

7. Adicionar uma flag `hasLoaded` ref para evitar recarregamento desnecessario da imagem
8. Simplificar as dependencias do useEffect

### Detalhes Tecnicos da Refatoracao

O hook refatorado usara este padrao:

```typescript
// Refs para valores mutaveis (sempre atuais nos callbacks)
const historyRef = useRef<HistoryEntry[]>([]);
const historyIndexRef = useRef(-1);
const isDrawingRef = useRef(false);
const colorRef = useRef('#FF0000');
const toolRef = useRef<Tool>('brush');
const brushSizeRef = useRef(8);

// Sincronizar state com refs
useEffect(() => { colorRef.current = color; }, [color]);
useEffect(() => { toolRef.current = tool; }, [tool]);
useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);
```

Com isso:
- `saveToHistory` nao tem dependencias mutaveis (usa refs)
- `loadImage` nao tem dependencias mutaveis (usa refs)
- `startDrawing` e `draw` sempre acessam os valores mais recentes via refs
- O loop infinito e eliminado
- Os tracos funcionam corretamente

