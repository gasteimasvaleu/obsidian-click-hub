import { useRef, useState, useCallback, useEffect } from 'react';

export type Tool = 'brush' | 'fill' | 'eraser';

interface HistoryEntry {
  imageData: ImageData;
}

export const useColoringCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(8);
  const [zoom, setZoom] = useState(1);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Refs for mutable values used inside stable callbacks
  const isDrawingRef = useRef(false);
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  const colorRef = useRef(color);
  const toolRef = useRef<Tool>(tool);
  const brushSizeRef = useRef(brushSize);

  // Sync state → refs
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push({ imageData });

    if (newHistory.length > 30) newHistory.shift();

    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndexRef.current - 1;
    ctx.putImageData(historyRef.current[newIndex].imageData, 0, 0);
    historyIndexRef.current = newIndex;
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndexRef.current + 1;
    ctx.putImageData(historyRef.current[newIndex].imageData, 0, 0);
    historyIndexRef.current = newIndex;
  }, []);

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.fillStyle = fillColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const fillRgb = tempCtx.getImageData(0, 0, 1, 1).data;

    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    const startIdx = (sy * width + sx) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];
    const startA = data[startIdx + 3];

    if (startR === fillRgb[0] && startG === fillRgb[1] && startB === fillRgb[2] && startA === fillRgb[3]) return;

    const tolerance = 32;
    const matchColor = (idx: number) => {
      return Math.abs(data[idx] - startR) <= tolerance &&
             Math.abs(data[idx + 1] - startG) <= tolerance &&
             Math.abs(data[idx + 2] - startB) <= tolerance &&
             Math.abs(data[idx + 3] - startA) <= tolerance;
    };

    const stack: [number, number][] = [[sx, sy]];
    const visited = new Set<number>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const idx = (y * width + x) * 4;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (visited.has(idx)) continue;
      if (!matchColor(idx)) continue;

      visited.add(idx);
      data[idx] = fillRgb[0];
      data[idx + 1] = fillRgb[1];
      data[idx + 2] = fillRgb[2];
      data[idx + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
    saveToHistory();
  }, [saveToHistory]);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;

    const currentTool = toolRef.current;
    const currentColor = colorRef.current;
    const currentBrushSize = brushSizeRef.current;

    if (currentTool === 'fill') {
      floodFill(point.x, point.y, currentColor);
      return;
    }

    isDrawingRef.current = true;
    lastPoint.current = point;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(point.x, point.y, (currentTool === 'eraser' ? currentBrushSize * 2 : currentBrushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.fill();
  }, [getCanvasPoint, floodFill]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current || !lastPoint.current) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentTool = toolRef.current;
    const currentColor = colorRef.current;
    const currentBrushSize = brushSizeRef.current;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.lineWidth = currentTool === 'eraser' ? currentBrushSize * 2 : currentBrushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPoint.current = point;
  }, [getCanvasPoint]);

  const stopDrawing = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPoint.current = null;
      saveToHistory();
    }
  }, [saveToHistory]);

  const loadImage = useCallback((imageUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      saveToHistory();
    };
    img.src = imageUrl;
  }, [saveToHistory]);

  const getCanvasBlob = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        resolve(null);
        return;
      }
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < (historyRef.current?.length ?? 0) - 1;

  return {
    canvasRef,
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    zoom,
    setZoom,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    canUndo,
    canRedo,
    loadImage,
    getCanvasBlob,
  };
};
