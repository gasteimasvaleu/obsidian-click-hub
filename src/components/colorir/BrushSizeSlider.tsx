import { Slider } from '@/components/ui/slider';

interface BrushSizeSliderProps {
  size: number;
  onChange: (size: number) => void;
}

export const BrushSizeSlider = ({ size, onChange }: BrushSizeSliderProps) => {
  return (
    <div className="flex items-center gap-3 px-2">
      <div
        className="rounded-full bg-foreground shrink-0"
        style={{ width: Math.max(4, size), height: Math.max(4, size) }}
      />
      <Slider
        value={[size]}
        onValueChange={([v]) => onChange(v)}
        min={2}
        max={40}
        step={1}
        className="flex-1"
      />
      <span className="text-xs text-muted-foreground w-6 text-right">{size}</span>
    </div>
  );
};
