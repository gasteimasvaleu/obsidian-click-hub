import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GlowPaletteItem {
  id: string;
  label: string;
  hsl: string; // HSL triplet without hsl() wrapper, matching the --feature-* tokens
}

// Verde Neon (padrão do app) + as 9 cores dos cards da tela inicial
export const GLOW_PALETTE: GlowPaletteItem[] = [
  { id: 'neon', label: 'Verde Neon', hsl: '146 100% 50%' },
  { id: 'bible', label: 'Azul', hsl: '217 91% 60%' },
  { id: 'devotional', label: 'Roxo', hsl: '270 91% 65%' },
  { id: 'prayer', label: 'Amarelo', hsl: '48 100% 50%' },
  { id: 'music', label: 'Vermelho', hsl: '0 84% 55%' },
  { id: 'coloring', label: 'Verde-limão', hsl: '80 92% 42%' },
  { id: 'friend', label: 'Verde', hsl: '158 84% 38%' },
  { id: 'parents', label: 'Rosa', hsl: '330 85% 62%' },
  { id: 'games', label: 'Lima', hsl: '95 75% 40%' },
  { id: 'community', label: 'Índigo', hsl: '245 85% 60%' },
];

export type GlowColor = string;

interface ThemePreferencesContextType {
  glowColor: GlowColor;
  setGlowColor: (color: GlowColor) => void;
}

const STORAGE_KEY = 'neon-glow-color';

const getStoredGlowColor = (): GlowColor => {
  if (typeof window === 'undefined') return 'devotional';
  const stored = localStorage.getItem(STORAGE_KEY);
  // Migração das preferências antigas (apenas verde/roxo)
  if (stored === 'green') return 'neon';
  if (stored === 'purple') return 'devotional';
  if (stored && GLOW_PALETTE.some((c) => c.id === stored)) return stored;
  return 'devotional';
};

const defaultContext: ThemePreferencesContextType = {
  glowColor: getStoredGlowColor(),
  setGlowColor: () => {},
};

const ThemePreferencesContext = createContext<ThemePreferencesContextType>(defaultContext);

const applyGlowCssVars = (color: GlowColor) => {
  const item = GLOW_PALETTE.find((c) => c.id === color) ?? GLOW_PALETTE[0];
  document.documentElement.style.setProperty('--user-glow-color', `hsl(${item.hsl})`);
  document.documentElement.style.setProperty('--user-glow', `hsl(${item.hsl} / 0.4)`);
  document.documentElement.style.setProperty('--user-glow-hover', `hsl(${item.hsl} / 0.3)`);
};


export const ThemePreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [glowColor, setGlowColorState] = useState<GlowColor>(getStoredGlowColor);

  const setGlowColor = (color: GlowColor) => {
    setGlowColorState(color);
    localStorage.setItem(STORAGE_KEY, color);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, glowColor);
    applyGlowCssVars(glowColor);
  }, [glowColor]);

  return (
    <ThemePreferencesContext.Provider value={{ glowColor, setGlowColor }}>
      {children}
    </ThemePreferencesContext.Provider>
  );
};

export const useThemePreferences = () => {
  return useContext(ThemePreferencesContext);
};
