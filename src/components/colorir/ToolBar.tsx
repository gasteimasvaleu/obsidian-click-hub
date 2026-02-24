import { Button } from '@/components/ui/button';
import { Paintbrush, PaintBucket, Eraser, Undo2, Redo2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { Tool } from '@/hooks/useColoringCanvas';

interface ToolBarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

const tools = [
  { value: 'brush' as Tool, label: 'Pincel', icon: Paintbrush },
  { value: 'fill' as Tool, label: 'Balde', icon: PaintBucket },
  { value: 'eraser' as Tool, label: 'Borracha', icon: Eraser },
];

export const ToolBar = ({ tool, onToolChange, onUndo, onRedo, canUndo, canRedo, zoom, onZoomIn, onZoomOut, onZoomReset }: ToolBarProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = tool === t.value;
        return (
          <Button
            key={t.value}
            variant={isActive ? 'default' : 'outline'}
            size="icon"
            onClick={() => onToolChange(t.value)}
            className={`transition-all duration-200 active:scale-90 ${
              isActive ? 'neon-glow' : ''
            }`}
            title={t.label}
          >
            <Icon size={18} />
          </Button>
        );
      })}

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        variant="outline"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="transition-all duration-200 active:scale-90"
        title="Desfazer"
      >
        <Undo2 size={18} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        className="transition-all duration-200 active:scale-90"
        title="Refazer"
      >
        <Redo2 size={18} />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={zoom <= 1}
        className="transition-all duration-200 active:scale-90"
        title="Diminuir zoom"
      >
        <ZoomOut size={18} />
      </Button>
      <span className="text-xs font-medium text-muted-foreground min-w-[3ch] text-center">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={zoom >= 4}
        className="transition-all duration-200 active:scale-90"
        title="Aumentar zoom"
      >
        <ZoomIn size={18} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomReset}
        disabled={zoom === 1}
        className="transition-all duration-200 active:scale-90"
        title="Resetar zoom"
      >
        <Maximize size={18} />
      </Button>
    </div>
  );
};
