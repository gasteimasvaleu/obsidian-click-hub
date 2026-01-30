import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type GlowColor = 'purple' | 'green';

interface ThemePreferencesContextType {
  glowColor: GlowColor;
  setGlowColor: (color: GlowColor) => void;
}

const ThemePreferencesContext = createContext<ThemePreferencesContextType | undefined>(undefined);

const STORAGE_KEY = 'neon-glow-color';

export const ThemePreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [glowColor, setGlowColorState] = useState<GlowColor>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === 'green' || stored === 'purple') ? stored : 'purple';
  });

  const setGlowColor = (color: GlowColor) => {
    setGlowColorState(color);
    localStorage.setItem(STORAGE_KEY, color);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, glowColor);
  }, [glowColor]);

  return (
    <ThemePreferencesContext.Provider value={{ glowColor, setGlowColor }}>
      {children}
    </ThemePreferencesContext.Provider>
  );
};

export const useThemePreferences = () => {
  const context = useContext(ThemePreferencesContext);
  if (context === undefined) {
    throw new Error('useThemePreferences must be used within a ThemePreferencesProvider');
  }
  return context;
};
