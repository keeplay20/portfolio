import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type PhoneDisplaySettings,
  persistPhoneDisplaySettings,
  readPhoneDisplaySettings,
} from "./phoneSettings";

type PhoneShellSettingsContextValue = {
  display: PhoneDisplaySettings;
  updateDisplay: (patch: Partial<PhoneDisplaySettings>) => void;
};

const PhoneShellSettingsContext =
  createContext<PhoneShellSettingsContextValue | null>(null);

export function usePhoneShellSettings(): PhoneShellSettingsContextValue {
  const ctx = useContext(PhoneShellSettingsContext);
  if (!ctx) {
    throw new Error(
      "usePhoneShellSettings must be used within PhoneShellSettingsProvider"
    );
  }
  return ctx;
}

export const PhoneShellSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [display, setDisplay] = useState<PhoneDisplaySettings>(() =>
    readPhoneDisplaySettings()
  );

  const updateDisplay = useCallback((patch: Partial<PhoneDisplaySettings>) => {
    setDisplay((prev) => {
      const next = { ...prev, ...patch };
      persistPhoneDisplaySettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ display, updateDisplay }),
    [display, updateDisplay]
  );

  return (
    <PhoneShellSettingsContext.Provider value={value}>
      {children}
    </PhoneShellSettingsContext.Provider>
  );
};