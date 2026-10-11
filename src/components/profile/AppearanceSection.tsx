import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { useThemePreferences, GLOW_PALETTE } from '@/contexts/ThemePreferencesContext';

const VISIBLE_COUNT = 5;

export const AppearanceSection = () => {
  const { glowColor, setGlowColor } = useThemePreferences();
  const [startIndex, setStartIndex] = useState(0);

  const maxIndex = Math.max(0, GLOW_PALETTE.length - VISIBLE_COUNT);
  const clampedStart = Math.min(startIndex, maxIndex);
  const visible = GLOW_PALETTE.slice(clampedStart, clampedStart + VISIBLE_COUNT);
  const selectedItem = GLOW_PALETTE.find((c) => c.id === glowColor);

  const canGoLeft = clampedStart > 0;
  const canGoRight = clampedStart < maxIndex;

  return (
    <Card className="glass border-primary/20 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Aparência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">Cor do brilho dos cards</span>
            <span className="text-sm text-muted-foreground">
              Escolha entre as cores dos cards da tela inicial
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Cores anteriores"
              disabled={!canGoLeft}
              onClick={() => setStartIndex((i) => Math.max(0, Math.min(i, maxIndex)) - VISIBLE_COUNT)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-foreground/10 text-foreground/80 backdrop-blur transition-all hover:bg-foreground/20 hover:text-foreground disabled:opacity-30 disabled:hover:bg-foreground/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex flex-1 items-center justify-center gap-3 overflow-hidden">
              {visible.map((color) => {
                const selected = color.id === glowColor;
                return (
                  <button
                    key={color.id}
                    type="button"
                    aria-label={color.label}
                    onClick={() => setGlowColor(color.id)}
                    style={{
                      backgroundColor: `hsl(${color.hsl})`,
                      boxShadow: selected
                        ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(${color.hsl}), 0 0 14px hsl(${color.hsl} / 0.6)`
                        : undefined,
                    }}
                    className={`h-10 w-10 shrink-0 rounded-full transition-all duration-200 ${
                      selected ? 'scale-110' : 'scale-100 opacity-90 hover:opacity-100 hover:scale-105'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Próximas cores"
              disabled={!canGoRight}
              onClick={() => setStartIndex((i) => Math.min(Math.min(i, maxIndex) + VISIBLE_COUNT, maxIndex))}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-foreground/10 text-foreground/80 backdrop-blur transition-all hover:bg-foreground/20 hover:text-foreground disabled:opacity-30 disabled:hover:bg-foreground/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {selectedItem && (
            <span className="text-center text-sm text-muted-foreground">
              Selecionado: <span className="text-foreground font-medium">{selectedItem.label}</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
