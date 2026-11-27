import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  playPhoneShellSound,
  resumePhoneShellAudio,
  type PhoneShellSound,
} from "./phoneShellSounds";

const VOLUME_KEY = "phone-shell-volume";
const MUTED_KEY = "phone-shell-muted";
const VOLUME_STEPS = 16;
const HUD_HIDE_MS = 1500;

function readVolume(): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw === null) return 0.625;
    const n = Number(raw);
    if (!Number.isFinite(n)) return 0.625;
    return Math.min(1, Math.max(0, Math.round(n * VOLUME_STEPS) / VOLUME_STEPS));
  } catch {
    return 0.625;
  }
}

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

type PhoneShellAudioContextValue = {
  volume: number;
  muted: boolean;
  hudVisible: boolean;
  volumeUp: () => void;
  volumeDown: () => void;
  toggleMute: () => void;
  play: (sound: PhoneShellSound) => void;
};

const PhoneShellAudioContext =
  createContext<PhoneShellAudioContextValue | null>(null);

export function usePhoneShellAudio(): PhoneShellAudioContextValue {
  const ctx = useContext(PhoneShellAudioContext);
  if (!ctx) {
    throw new Error(
      "usePhoneShellAudio must be used within PhoneShellAudioProvider"
    );
  }
  return ctx;
}

/** No-op outside the in-phone shell (e.g. standalone /games routes). */
export function useOptionalPhoneShellAudio(): PhoneShellAudioContextValue | null {
  return useContext(PhoneShellAudioContext);
}

export const PhoneShellAudioProvider: React.FC<{ children: React.ReactNode }> =
  ({ children }) => {
    const [volume, setVolume] = useState(readVolume);
    const [muted, setMuted] = useState(readMuted);
    const [hudVisible, setHudVisible] = useState(false);
    const hideTimerRef = useRef<number | null>(null);

    const persistVolume = useCallback((next: number) => {
      try {
        localStorage.setItem(VOLUME_KEY, String(next));
      } catch {
        /* ignore */
      }
    }, []);

    const persistMuted = useCallback((next: boolean) => {
      try {
        localStorage.setItem(MUTED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
    }, []);

    const flashHud = useCallback(() => {
      setHudVisible(true);
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = window.setTimeout(() => {
        setHudVisible(false);
        hideTimerRef.current = null;
      }, HUD_HIDE_MS);
    }, []);

    useEffect(
      () => () => {
        if (hideTimerRef.current) {
          window.clearTimeout(hideTimerRef.current);
        }
      },
      []
    );

    const play = useCallback(
      (sound: PhoneShellSound) => {
        resumePhoneShellAudio();
        playPhoneShellSound(sound, volume, muted);
      },
      [volume, muted]
    );

    const setLevel = useCallback(
      (next: number, withTick: boolean) => {
        const stepped =
          Math.round(Math.min(1, Math.max(0, next)) * VOLUME_STEPS) /
          VOLUME_STEPS;
        setVolume(stepped);
        persistVolume(stepped);
        if (withTick) {
          playPhoneShellSound("tick", stepped, false);
        }
        flashHud();
      },
      [flashHud, persistVolume]
    );

    const volumeUp = useCallback(() => {
      resumePhoneShellAudio();
      setMuted(false);
      persistMuted(false);
      setLevel(volume + 1 / VOLUME_STEPS, true);
    }, [persistMuted, setLevel, volume]);

    const volumeDown = useCallback(() => {
      resumePhoneShellAudio();
      setMuted(false);
      persistMuted(false);
      setLevel(volume - 1 / VOLUME_STEPS, true);
    }, [persistMuted, setLevel, volume]);

    const toggleMute = useCallback(() => {
      resumePhoneShellAudio();
      setMuted((m) => {
        const next = !m;
        persistMuted(next);
        if (!next) {
          playPhoneShellSound("tick", volume, false);
        } else {
          playPhoneShellSound("tick", Math.max(volume, 0.4), false);
        }
        return next;
      });
      flashHud();
    }, [flashHud, persistMuted, volume]);

    const value = useMemo(
      () => ({
        volume,
        muted,
        hudVisible,
        volumeUp,
        volumeDown,
        toggleMute,
        play,
      }),
      [
        volume,
        muted,
        hudVisible,
        volumeUp,
        volumeDown,
        toggleMute,
        play,
      ]
    );

    return (
      <PhoneShellAudioContext.Provider value={value}>
        {children}
      </PhoneShellAudioContext.Provider>
    );
  };