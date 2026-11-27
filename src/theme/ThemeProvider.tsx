import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { PhoneThemeId } from "./phoneThemes";
import { persistTheme, readStoredTheme, type ThemeRevealOrigin } from "./theme";

type ThemeTransition = {
  key: number;
  origin?: ThemeRevealOrigin;
  target: PhoneThemeId;
};

type ThemeContextValue = {
  theme: PhoneThemeId;
  transition: ThemeTransition | null;
  setTheme: (theme: PhoneThemeId, origin?: ThemeRevealOrigin) => void;
  clearTransition: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<PhoneThemeId>(() => readStoredTheme());
  const [transition, setTransition] = useState<ThemeTransition | null>(null);

  const clearTransition = useCallback(() => setTransition(null), []);

  const setTheme = useCallback(
    (next: PhoneThemeId, origin?: ThemeRevealOrigin) => {
      if (next === theme) return;
      setTransition({ key: Date.now(), origin, target: next });
      setThemeState(next);
      persistTheme(next);
    },
    [theme]
  );

  const value = useMemo(
    () => ({ theme, transition, setTheme, clearTransition }),
    [theme, transition, setTheme, clearTransition]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};