interface ColorPaletteProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const COLORS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700',
  '#FFFF00', '#9ACD32', '#32CD32', '#00FF00',
  '#00CED1', '#00BFFF', '#1E90FF', '#0000FF',
  '#4B0082', '#8A2BE2', '#9932CC', '#FF00FF',
  '#FF69B4', '#FF1493', '#8B4513', '#A0522D',
  '#000000', '#808080', '#C0C0C0', '#FFFFFF',
];

export const ColorPalette = ({ selectedColor, onColorChange }: ColorPaletteProps) => {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onColorChange(c)}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 active:scale-90 ${
            selectedColor === c
              ? 'border-foreground scale-110 shadow-lg ring-2 ring-foreground/30'
              : 'border-transparent hover:scale-105'
          }`}
          style={{ backgroundColor: c }}
          aria-label={`Cor ${c}`}
        />
      ))}
      <label className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:border-foreground transition-colors">
        <span className="text-xs text-muted-foreground">+</span>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="sr-only"
        />
      </label>
    </div>
  );
};
