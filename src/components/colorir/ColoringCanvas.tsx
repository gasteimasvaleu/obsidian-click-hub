import { useEffect, useRef, useState, useCallback } from 'react';
import type { useColoringCanvas } from '@/hooks/useColoringCanvas';

interface ColoringCanvasProps {
  canvas: ReturnType<typeof useColoringCanvas>;
  imageUrl: string;
}

export const ColoringCanvas = ({ canvas, imageUrl }: ColoringCanvasProps) => {
  const { canvasRef, startDrawing, draw, stopDrawing, loadImage, tool, zoom, setZoom } = canvas;
  const hasLoaded = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);
  const isPanningRef = useRef(false);

  useEffect(() => {
    if (imageUrl && !hasLoaded.current) {
      hasLoaded.current = true;
      loadImage(imageUrl);
    }
  }, [imageUrl, loadImage]);

  // Reset offset when zoom resets to 1
  useEffect(() => {
    if (zoom <= 1) {
      setOffset({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Desktop scroll wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom(prev => Math.min(4, Math.max(1, prev + delta)));
  }, [setZoom]);

  // Touch handlers for pinch-to-zoom and pan
  const getTouchDist = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPanningRef.current = true;
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      pinchRef.current = { dist, zoom };
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      panRef.current = { startX: midX, startY: midY, offsetX: offset.x, offsetY: offset.y };
    } else if (e.touches.length === 1 && zoom > 1) {
      // Check if we should pan (long press could be added, but for now just draw)
      isPanningRef.current = false;
      startDrawing(e);
    } else {
      isPanningRef.current = false;
      startDrawing(e);
    }
  }, [zoom, offset, startDrawing, setZoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current && panRef.current) {
      e.preventDefault();
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      const scale = dist / pinchRef.current.dist;
      const newZoom = Math.min(4, Math.max(1, pinchRef.current.zoom * scale));
      setZoom(newZoom);

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setOffset({
        x: panRef.current.offsetX + (midX - panRef.current.startX) / newZoom,
        y: panRef.current.offsetY + (midY - panRef.current.startY) / newZoom,
      });
    } else if (!isPanningRef.current) {
      draw(e);
    }
  }, [draw, setZoom]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchRef.current = null;
      panRef.current = null;
    }
    if (!isPanningRef.current) {
      stopDrawing();
    }
    if (e.touches.length === 0) {
      isPanningRef.current = false;
    }
  }, [stopDrawing]);

  const cursorStyle = tool === 'fill' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'default';

  return (
    <div
      ref={wrapperRef}
      className="w-full flex justify-center bg-white rounded-lg overflow-hidden touch-none"
      onWheel={handleWheel}
    >
      <div
        style={{
          transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: 'center center',
          transition: pinchRef.current ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="max-w-full max-h-[50vh] object-contain"
          style={{ cursor: cursorStyle }}
        />
      </div>
    </div>
  );
};
