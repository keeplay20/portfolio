import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  dockApps,
  InPhoneLaunch,
  phoneArcadeSection,
  phoneHomeSections,
  PhoneApp,
  resolveInPhoneLaunch,
} from "../../data/iphoneHome";
import { experiences, personalInfo, projects } from "../../data/portfolio";
import TicTacToe from "../Games/TicTacToe/TicTacToe";
import RockPaperScissors from "../Games/RockPaperScissors/RockPaperScissors";
import Snake from "../Games/Snake/Snake";
import TypingTest from "../Games/TypingTest/TypingTest";
import MemoryCardGame from "../Games/MemoryCardGame/MemoryCardGame";
import IOSAppIcon from "./IOSAppIcon";
import IPhoneStatusBar, { ARCADE_TAP_TARGET } from "./IPhoneStatusBar";
import HomeStatsWidget from "./HomeStatsWidget";
import LocationWidget from "./LocationWidget";
import PhoneInApp, { PhoneInAppLaunch } from "./PhoneInApp";
import PhoneLockScreen from "./PhoneLockScreen";
import { openSourceHubApp } from "../../data/openSourceContributions";
import {
  WARRANTY_VAULT_TEASER_ID,
  warrantyVaultTeaserApp,
} from "../../data/warrantyVaultTeaser";
import "./IPhoneHome.css";
import "./MotionShellSkin.css";
import "./MobileShellNative.css";
import "./HomeWidgetsLayout.css";
import { useIphoneStageScale } from "./useIphoneStageScale";
import phoneWallpaperSrc from "../../assets/images/phone-wallpapers/background.svg";
import PhoneThemeTransition from "./PhoneThemeTransition";
import {
  PhoneShellAudioProvider,
  usePhoneShellAudio,
} from "./PhoneShellAudioProvider";
import { PhoneShellSettingsProvider, usePhoneShellSettings } from "../../theme/PhoneShellSettingsProvider";
import PhoneHardwareControls from "./PhoneHardwareControls";
import VolumeHUD from "./VolumeHUD";
import { useTheme } from "../../theme/ThemeProvider";
import "./PhoneShellTheme.css";
import "./PhoneThemeTransition.css";

const PHONE_GAMES: Record<string, React.FC> = {
  tictactoe: TicTacToe,
  rps: RockPaperScissors,
  snake: Snake,
  typing: TypingTest,
  memory: MemoryCardGame,
};

type PhoneView = "home" | "inapp";

/** Live clock — populated in `useEffect` only so SSR/prerender HTML matches first client paint. */
function useClock(): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

function useLockDateLabel(): string | null {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Date().toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    setLabel(format());
    const id = window.setInterval(() => setLabel(format()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return label;
}

function toPhoneInAppLaunch(raw: InPhoneLaunch): PhoneInAppLaunch {
  switch (raw.mode) {
    case "iframe":
    case "placeholder":
      return raw;
    case "route": {
      const gameId = raw.path.split("/").filter(Boolean).pop() ?? "";
      return { mode: "game", gameId };
    }
    case "experience-hub":
      return { mode: "experience-hub" };
    case "open-source-hub":
      return { mode: "open-source-hub" };
    case "about-me-hub":
      return { mode: "about-me-hub" };
    case "settings":
      return { mode: "settings" };
    case "coming-soon":
      return { mode: "coming-soon", teaserId: raw.teaserId };
    case "experience": {
      const experience = experiences.find((e) => e.id === raw.experienceId);
      return experience
        ? { mode: "experience", experience }
        : { mode: "placeholder" };
    }
    default:
      return { mode: "placeholder" };
  }
}

function AppIcon({
  app,
  onSelect,
  size = "md",
}: {
  app: PhoneApp;
  onSelect: (app: PhoneApp) => void;
  size?: "sm" | "md" | "dock";
}) {
  const { play } = usePhoneShellAudio();

  return (
    <button
      type="button"
      className={`iphone-app ${size !== "md" ? `iphone-app--${size}` : ""}${
        size !== "dock" ? " iphone-app--no-label" : ""
      }`}
      aria-label={app.name}
      onClick={() => {
        play("tap");
        onSelect(app);
      }}
    >
      <span className="iphone-app__icon">
        <IOSAppIcon app={app} size={size === "dock" ? "dock" : "md"} />
      </span>
    </button>
  );
}

const IPhoneHome: React.FC = () => (
  <PhoneShellSettingsProvider>
    <PhoneShellAudioProvider>
      <IPhoneHomeShell />
    </PhoneShellAudioProvider>
  </PhoneShellSettingsProvider>
);

const IPhoneHomeShell: React.FC = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const clock = useClock();
  const lockDateLabel = useLockDateLabel();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [statsAnimKey, setStatsAnimKey] = useState(0);

  const [view, setView] = useState<PhoneView>("home");
  const [inApp, setInApp] = useState<{
    app: PhoneApp;
    launch: PhoneInAppLaunch;
  } | null>(null);
  const [arcadeUnlocked, setArcadeUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem("mv-shell-arcade") === "1";
    } catch {
      return false;
    }
  });
  const brandTapCountRef = useRef(0);
  const brandTapResetRef = useRef<number | null>(null);
  const [brandTapNudge, setBrandTapNudge] = useState(false);
  const homeSections = useMemo(
    () =>
      arcadeUnlocked
        ? [...phoneHomeSections, phoneArcadeSection]
        : phoneHomeSections,
    [arcadeUnlocked]
  );

  useIphoneStageScale(homeRef, isUnlocked, view, arcadeUnlocked);

  const { play, hudVisible, volume, muted } = usePhoneShellAudio();
  const { theme: phoneTheme, transition, clearTransition } = useTheme();
  const { display } = usePhoneShellSettings();

  const unlockArcade = useCallback(() => {
    setArcadeUnlocked(true);
    try {
      sessionStorage.setItem("mv-shell-arcade", "1");
    } catch {
      /* ignore */
    }
  }, []);

  const onShellBrandTap = useCallback(() => {
    if (arcadeUnlocked) return;
    if (brandTapResetRef.current) {
      window.clearTimeout(brandTapResetRef.current);
    }
    brandTapCountRef.current += 1;
    const count = brandTapCountRef.current;
    if (count >= ARCADE_TAP_TARGET) {
      brandTapCountRef.current = 0;
      unlockArcade();
      return;
    }
    if (count >= 3) {
      setBrandTapNudge(true);
      window.setTimeout(() => setBrandTapNudge(false), 220);
    }
    brandTapResetRef.current = window.setTimeout(() => {
      brandTapCountRef.current = 0;
      brandTapResetRef.current = null;
    }, 900);
  }, [arcadeUnlocked, unlockArcade]);

  const bumpStatsAnim = useCallback(() => {
    setStatsAnimKey((k) => k + 1);
  }, []);

  const unlockPhone = useCallback(() => {
    play("unlock");
    setIsUnlocked(true);
    bumpStatsAnim();
  }, [bumpStatsAnim, play]);

  const exitInApp = useCallback(() => {
    setInApp(null);
    setView("home");
    bumpStatsAnim();
  }, [bumpStatsAnim]);

  const lockPhone = useCallback(() => {
    if (!isUnlocked) return;
    play("lock");
    setIsUnlocked(false);
    setView("home");
    setInApp(null);
  }, [isUnlocked, play]);

  const launchAppInPhone = useCallback((app: PhoneApp) => {
    const raw = resolveInPhoneLaunch(app.destination, projects);
    if (raw === null) {
      const dest = app.destination;
      if (dest.type === "external") {
        if (dest.url.startsWith("mailto:")) {
          window.location.href = dest.url;
        } else {
          window.open(dest.url, "_blank", "noopener,noreferrer");
        }
      }
      return;
    }

    setInApp({ app, launch: toPhoneInAppLaunch(raw) });
    setView("inapp");
  }, []);

  const launchOpenSourceHub = useCallback(() => {
    launchAppInPhone(openSourceHubApp);
  }, [launchAppInPhone]);

  const openWarrantyVaultTeaser = useCallback(() => {
    play("unlock");
    setIsUnlocked(true);
    bumpStatsAnim();
    setInApp({
      app: warrantyVaultTeaserApp,
      launch: { mode: "coming-soon", teaserId: WARRANTY_VAULT_TEASER_ID },
    });
    setView("inapp");
  }, [bumpStatsAnim, play]);

  const deviceClassName = [
    "iphone-device iphone-device--15",
    display.trueBlack ? "iphone-device--true-black" : "",
    display.reduceTransparency ? "iphone-device--reduce-transparency" : "",
    display.reduceMotion ? "iphone-device--reduce-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="iphone-home iphone-home--bare" ref={homeRef}>

      <h1 className="iphone-home__sr-title">{personalInfo.name}</h1>

      <div className="iphone-home__layout">
        <div className="iphone-home__phone-stage">
          <motion.div
            className={deviceClassName}
            data-phone-theme={phoneTheme}
            data-phone-muted={muted ? "true" : undefined}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="iphone-device__bezel">
              <div className="iphone-device__hardware">
                <PhoneHardwareControls
                  onLock={lockPhone}
                  lockEnabled={isUnlocked}
                />
              </div>
              <div
                className={`iphone-device__screen${
                  view === "inapp" ? " iphone-device__screen--inapp" : ""
                }${!isUnlocked ? " iphone-device__screen--locked" : ""}`}
              >
                <VolumeHUD
                  visible={hudVisible}
                  volume={volume}
                  muted={muted}
                />
                <div className="iphone-device__wallpaper" aria-hidden="true">
                  <img
                    src={phoneWallpaperSrc}
                    alt=""
                    className="iphone-device__wallpaper-art"
                    draggable={false}
                  />
                </div>
                {transition ? (
                  <PhoneThemeTransition
                    transitionKey={transition.key}
                    targetTheme={transition.target}
                    origin={transition.origin}
                    onComplete={clearTransition}
                  />
                ) : null}
                <AnimatePresence>
                  {!isUnlocked ? (
                    <PhoneLockScreen
                      key="lock"
                      time={clock}
                      dateLabel={lockDateLabel}
                      onUnlock={unlockPhone}
                      showNotification
                      onOpenNotification={openWarrantyVaultTeaser}
                    />
                  ) : null}
                </AnimatePresence>

                <motion.div
                  className="iphone-screen__surface"
                  initial={false}
                  animate={
                    isUnlocked
                      ? { y: 0, opacity: 1, scale: 1 }
                      : { y: 48, opacity: 0, scale: 1.03 }
                  }
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: isUnlocked ? 0.06 : 0,
                  }}
                  aria-hidden={!isUnlocked}
                >
                  <IPhoneStatusBar
                    time={clock}
                    onIslandTap={isUnlocked ? onShellBrandTap : undefined}
                    islandTapHint={brandTapNudge}
                  />

                  <div className="iphone-screen__scroll">
                    {view === "inapp" && inApp ? (
                      <PhoneInApp
                        app={inApp.app}
                        launch={inApp.launch}
                        onBack={exitInApp}
                        games={PHONE_GAMES}
                      />
                    ) : view === "home" ? (
                      <>
                        {isUnlocked ? (
                          <div className="iphone-home-widgets">
                            <LocationWidget compact />
                            <HomeStatsWidget
                              key={statsAnimKey}
                              compact
                              onOpenSource={launchOpenSourceHub}
                            />
                          </div>
                        ) : null}
                        <div className="iphone-home-screen">
                          {homeSections.map((section) => (
                            <section
                              key={section.id}
                              className={`iphone-home-section${
                                section.id === "arcade"
                                  ? " iphone-home-section--arcade"
                                  : ""
                              }`}
                              aria-label={section.title}
                            >
                              <h2 className="iphone-home-section__title">
                                {section.title}
                                {section.id === "arcade" ? (
                                  <span className="iphone-home-section__egg">
                                    easter egg
                                  </span>
                                ) : null}
                              </h2>
                              <div className="iphone-grid iphone-grid--apps iphone-grid--home">
                                {section.apps.map((app) => (
                                  <AppIcon
                                    key={app.id}
                                    app={app}
                                    onSelect={launchAppInPhone}
                                  />
                                ))}
                              </div>
                            </section>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>

                  {view !== "inapp" ? (
                    <footer className="iphone-dock-shell">
                      <div className="iphone-dock" aria-label="Dock">
                        {dockApps.map((app) => (
                          <AppIcon
                            key={app.id}
                            app={app}
                            size="dock"
                            onSelect={launchAppInPhone}
                          />
                        ))}
                      </div>
                      <div className="iphone-home-indicator" aria-hidden="true" />
                    </footer>
                  ) : null}
                </motion.div>
              </div>
            </div>
          </motion.div>
          <p className="iphone-device__hint" aria-hidden="true">
            {isUnlocked
              ? "Volume keys · side button locks · swipe up on lock screen"
              : "Swipe up to unlock · volume keys still work"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IPhoneHome;