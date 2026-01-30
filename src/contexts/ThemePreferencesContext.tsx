import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type GlowColor = 'purple' | 'green';

interface ThemePreferencesContextType {
  glowColor: GlowColor;
  setGlowColor: (color: GlowColor) => void;
}

const STORAGE_KEY = 'neon-glow-color';

const getStoredGlowColor = (): GlowColor => {
  if (typeof window === 'undefined') return 'purple';
  const stored = localStorage.getItem(STORAGE_KEY);
  return (stored === 'green' || stored === 'purple') ? stored : 'purple';
};

const defaultContext: ThemePreferencesContextType = {
  glowColor: getStoredGlowColor(),
  setGlowColor: () => {},
};

const ThemePreferencesContext = createContext<ThemePreferencesContextType>(defaultContext);

export const ThemePreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [glowColor, setGlowColorState] = useState<GlowColor>(getStoredGlowColor);

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
  return useContext(ThemePreferencesContext);
};
