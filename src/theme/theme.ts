import {
  isPhoneThemeId,
  migrateLegacyTheme,
  type PhoneThemeId,
} from "./phoneThemes";

export const THEME_STORAGE_KEY = "phone-shell-theme";

export type { PhoneThemeId as AppTheme };

export function readStoredTheme(): PhoneThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const theme = migrateLegacyTheme(stored);
      if (stored !== theme) persistTheme(theme);
      return theme;
    }
    const legacy = localStorage.getItem("portfolio-appearance");
    if (legacy) {
      const theme = migrateLegacyTheme(legacy);
      if (legacy !== theme) persistTheme(theme);
      return theme;
    }
  } catch {
    /* private mode / blocked storage */
  }
  return "graphite";
}

export function persistTheme(theme: PhoneThemeId) {
  if (!isPhoneThemeId(theme)) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export type ThemeRevealOrigin = {
  xPct: number;
  yPct: number;
};