import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { useThemePreferences } from '@/contexts/ThemePreferencesContext';

export const AppearanceSection = () => {
  const { glowColor, setGlowColor } = useThemePreferences();

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
            <span className="font-medium text-foreground">Cor das sombras dos cards</span>
            <span className="text-sm text-muted-foreground">
              Escolha entre verde limão ou roxo neon
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setGlowColor('green')}
              className={`transition-all ${
                glowColor === 'green'
                  ? 'border-primary bg-primary/20 text-primary hover:bg-primary/30'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              🟢 Verde
            </Button>
            <Button
              variant="outline"
              onClick={() => setGlowColor('purple')}
              className={`transition-all ${
                glowColor === 'purple'
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                  : 'border-border hover:border-purple-500/50'
              }`}
            >
              🟣 Roxo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
