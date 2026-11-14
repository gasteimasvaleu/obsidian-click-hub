import { Plus } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

interface ColorPaletteProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const COLORS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00', '#9ACD32', '#32CD32', '#00C853',
  '#00CED1', '#00BFFF', '#1E90FF', '#0000FF', '#4B0082', '#8A2BE2', '#9932CC', '#FF00FF',
  '#FF69B4', '#FF1493', '#8B4513', '#A0522D', '#000000', '#808080', '#C0C0C0', '#FFFFFF',
];

export const ColorPalette = ({ selectedColor, onColorChange }: ColorPaletteProps) => (
  <GlassCard className="p-3">
    <div className="grid grid-cols-8 gap-2">
      {COLORS.map((c) => {
        const active = selectedColor.toLowerCase() === c.toLowerCase();
        return (
          <button
            key={c}
            type="button"
            onClick={() => onColorChange(c)}
            className={`aspect-square w-full rounded-full border border-border transition-shadow active:scale-90 ${
              active ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Cor ${c}`}
            aria-pressed={active}
          />
        );
      })}
    </div>
    <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
      <span className="h-8 w-8 shrink-0 rounded-full border border-border" style={{ backgroundColor: selectedColor }} />
      <span className="flex-1 text-sm font-medium text-muted-foreground">Cor atual</span>
      <label className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-primary/40 px-3 text-sm font-semibold text-primary hover:bg-primary/10">
        <Plus size={16} /> Outra cor
        <input type="color" value={selectedColor} onChange={(e) => onColorChange(e.target.value)} className="sr-only" />
      </label>
    </div>
  </GlassCard>
);
