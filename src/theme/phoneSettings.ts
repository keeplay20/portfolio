export const PHONE_SETTINGS_STORAGE_KEY = "phone-display-settings";

export type PhoneDisplaySettings = {
  trueBlack: boolean;
  reduceTransparency: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: PhoneDisplaySettings = {
  trueBlack: false,
  reduceTransparency: false,
  reduceMotion: false,
};

export function readPhoneDisplaySettings(): PhoneDisplaySettings {
  try {
    const raw = localStorage.getItem(PHONE_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<PhoneDisplaySettings>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function persistPhoneDisplaySettings(next: PhoneDisplaySettings) {
  try {
    localStorage.setItem(PHONE_SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}