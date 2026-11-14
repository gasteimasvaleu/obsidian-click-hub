import type { ReactNode } from 'react';
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

const BAR = 'flex w-full overflow-hidden rounded-full border border-border bg-card divide-x divide-border';

const BarButton = ({ onClick, disabled, active, label, children }: { onClick: () => void; disabled?: boolean; active?: boolean; label: string; children: ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    aria-pressed={active}
    className={`flex h-11 flex-1 items-center justify-center transition-colors active:scale-95 disabled:opacity-35 disabled:pointer-events-none ${
      active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
    }`}
  >
    {children}
  </button>
);

export const ToolBar = ({ tool, onToolChange, onUndo, onRedo, canUndo, canRedo, zoom, onZoomIn, onZoomOut, onZoomReset }: ToolBarProps) => (
  <div className="space-y-2">
    <div className={BAR}>
      {tools.map((t) => {
        const Icon = t.icon;
        return (
          <BarButton key={t.value} label={t.label} active={tool === t.value} onClick={() => onToolChange(t.value)}>
            <Icon size={20} />
          </BarButton>
        );
      })}
      <BarButton label="Desfazer" onClick={onUndo} disabled={!canUndo}><Undo2 size={20} /></BarButton>
      <BarButton label="Refazer" onClick={onRedo} disabled={!canRedo}><Redo2 size={20} /></BarButton>
    </div>
    <div className={BAR}>
      <BarButton label="Diminuir zoom" onClick={onZoomOut} disabled={zoom <= 1}><ZoomOut size={20} /></BarButton>
      <div className="flex h-11 flex-1 items-center justify-center text-sm font-semibold text-muted-foreground">
        {Math.round(zoom * 100)}%
      </div>
      <BarButton label="Aumentar zoom" onClick={onZoomIn} disabled={zoom >= 4}><ZoomIn size={20} /></BarButton>
      <BarButton label="Ajustar à tela" onClick={onZoomReset} disabled={zoom === 1}><Maximize size={20} /></BarButton>
    </div>
  </div>
);
