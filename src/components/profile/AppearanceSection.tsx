import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">Cor das sombras dos cards</span>
            <span className="text-sm text-muted-foreground">
              Escolha entre verde limão ou roxo neon
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium transition-colors ${glowColor === 'green' ? 'text-primary' : 'text-muted-foreground'}`}>
              🟢 Verde
            </span>
            <Switch
              checked={glowColor === 'purple'}
              onCheckedChange={(checked) => setGlowColor(checked ? 'purple' : 'green')}
            />
            <span className={`text-sm font-medium transition-colors ${glowColor === 'purple' ? 'text-purple-400' : 'text-muted-foreground'}`}>
              Roxo 🟣
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
