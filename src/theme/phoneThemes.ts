export type PhoneThemeId = "graphite" | "obsidian" | "midnight" | "amber";

export type PhoneThemeMeta = {
  id: PhoneThemeId;
  label: string;
  detail: string;
  isDark: boolean;
  swatch: string;
};

export const PHONE_THEME_LIST: PhoneThemeMeta[] = [
  {
    id: "graphite",
    label: "Graphite",
    detail: "Neutral iOS dark",
    isDark: true,
    swatch: "linear-gradient(145deg, #3a3a3c, #1c1c1e)",
  },
  {
    id: "obsidian",
    label: "Obsidian",
    detail: "Violet depth & glow",
    isDark: true,
    swatch: "linear-gradient(145deg, #6e3a9a, #1a1024)",
  },
  {
    id: "midnight",
    label: "Midnight",
    detail: "Cool blue night",
    isDark: true,
    swatch: "linear-gradient(145deg, #2c3e62, #0f1729)",
  },
  {
    id: "amber",
    label: "Amber",
    detail: "Warm portfolio gold",
    isDark: true,
    swatch: "linear-gradient(145deg, #c9a06b, #5c4030)",
  },
];

export function isPhoneThemeId(value: string): value is PhoneThemeId {
  return PHONE_THEME_LIST.some((t) => t.id === value);
}

export function isDarkPhoneTheme(theme: PhoneThemeId): boolean {
  return PHONE_THEME_LIST.find((t) => t.id === theme)?.isDark ?? true;
}

export function migrateLegacyTheme(stored: string): PhoneThemeId {
  if (stored === "daylight") return "obsidian";
  if (isPhoneThemeId(stored)) return stored;
  if (stored === "light") return "graphite";
  if (stored === "dark" || stored === "auto") return "graphite";
  return "graphite";
}