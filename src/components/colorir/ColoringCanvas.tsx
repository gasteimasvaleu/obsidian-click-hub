import { useEffect, useRef } from 'react';
import type { useColoringCanvas } from '@/hooks/useColoringCanvas';

interface ColoringCanvasProps {
  canvas: ReturnType<typeof useColoringCanvas>;
  imageUrl: string;
}

export const ColoringCanvas = ({ canvas, imageUrl }: ColoringCanvasProps) => {
  const { canvasRef, startDrawing, draw, stopDrawing, loadImage, tool } = canvas;
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (imageUrl && !hasLoaded.current) {
      hasLoaded.current = true;
      loadImage(imageUrl);
    }
  }, [imageUrl, loadImage]);

  const cursorStyle = tool === 'fill' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'default';

  return (
    <div className="w-full flex justify-center bg-white rounded-lg overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="max-w-full max-h-[50vh] object-contain"
        style={{ cursor: cursorStyle }}
      />
    </div>
  );
};
