import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  dockApps,
  InPhoneLaunch,
  phoneFolders,
  PhoneApp,
  PhoneFolder,
  resolveInPhoneLaunch,
} from "../../data/iphoneHome";
import { experiences, projects } from "../../data/portfolio";
import TicTacToe from "../Games/TicTacToe/TicTacToe";
import RockPaperScissors from "../Games/RockPaperScissors/RockPaperScissors";
import Snake from "../Games/Snake/Snake";
import TypingTest from "../Games/TypingTest/TypingTest";
import MemoryCardGame from "../Games/MemoryCardGame/MemoryCardGame";
import IOSAppIcon, { IOSFolderPreview } from "./IOSAppIcon";
import IPhoneStatusBar from "./IPhoneStatusBar";
import LocationWidget from "./LocationWidget";
import PhoneInApp, { PhoneInAppLaunch } from "./PhoneInApp";
import woodTexture from "../../assets/images/wood-table-texture.jpg";
import phoneWallpaper from "../../assets/images/phone-wallpapers/midnight-oil.jpg";
import "./IPhoneHome.css";

const PHONE_GAMES: Record<string, React.FC> = {
  tictactoe: TicTacToe,
  rps: RockPaperScissors,
  snake: Snake,
  typing: TypingTest,
  memory: MemoryCardGame,
};

type PhoneView = "home" | "folder" | "inapp";

function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  );
  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
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
  return (
    <button
      type="button"
      className={`iphone-app ${size !== "md" ? `iphone-app--${size}` : ""}`}
      onClick={() => onSelect(app)}
    >
      <span className="iphone-app__icon">
        <IOSAppIcon app={app} size={size === "dock" ? "dock" : "md"} />
      </span>
      <span className="iphone-app__label">{app.label}</span>
    </button>
  );
}

function FolderIcon({
  folder,
  onOpen,
}: {
  folder: PhoneFolder;
  onOpen: (folder: PhoneFolder) => void;
}) {
  return (
    <button
      type="button"
      className="iphone-folder"
      onClick={() => onOpen(folder)}
    >
      <IOSFolderPreview apps={folder.apps} />
      <span className="iphone-folder__label">{folder.name}</span>
    </button>
  );
}

const IPhoneHome: React.FC = () => {
  const clock = useClock();
  const navigate = useNavigate();
  const [view, setView] = useState<PhoneView>("home");
  const [activeFolder, setActiveFolder] = useState<PhoneFolder | null>(null);
  const [inApp, setInApp] = useState<{
    app: PhoneApp;
    launch: PhoneInAppLaunch;
  } | null>(null);

  const archiveDockApp = useMemo(
    () => dockApps.find((a) => a.id === "archive"),
    []
  );

  const openFolder = useCallback((folder: PhoneFolder) => {
    setActiveFolder(folder);
    setView("folder");
    setInApp(null);
  }, []);

  const goHome = useCallback(() => {
    setView("home");
    setActiveFolder(null);
    setInApp(null);
  }, []);

  const exitInApp = useCallback(() => {
    setInApp(null);
    setView(activeFolder ? "folder" : "home");
  }, [activeFolder]);

  const launchAppInPhone = useCallback((app: PhoneApp) => {
    const raw = resolveInPhoneLaunch(app.destination, projects);
    if (raw === null) {
      const dest = app.destination;
      if (dest.type === "external" && dest.url.startsWith("mailto:")) {
        window.location.href = dest.url;
      }
      return;
    }

    setInApp({ app, launch: toPhoneInAppLaunch(raw) });
    setView("inapp");
  }, []);

  const openArchiveInPhone = useCallback(() => {
    if (archiveDockApp) {
      launchAppInPhone(archiveDockApp);
    } else {
      navigate("/work");
    }
  }, [archiveDockApp, launchAppInPhone, navigate]);

  return (
    <div className="iphone-home">
      <div
        className="iphone-home__wood"
        style={{ backgroundImage: `url(${woodTexture})` }}
        aria-hidden="true"
      />

      <div className="iphone-home__layout">
        <div className="iphone-home__phone-stage">
          <motion.div
            className="iphone-device"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="iphone-device__bezel">
              <div className="iphone-device__hardware" aria-hidden="true">
                <span className="iphone-device__control iphone-device__control--action" />
                <span className="iphone-device__control iphone-device__control--volume-up" />
                <span className="iphone-device__control iphone-device__control--volume-down" />
                <span className="iphone-device__control iphone-device__control--power" />
              </div>
              <div
                className={`iphone-device__screen${
                  view === "inapp" ? " iphone-device__screen--inapp" : ""
                }`}
              >
                <div
                  className={`iphone-device__wallpaper${
                    view === "inapp" ? " iphone-device__wallpaper--dim" : ""
                  }`}
                  aria-hidden="true"
                >
                  <div
                    className="iphone-device__wallpaper-slide"
                    style={{ backgroundImage: `url(${phoneWallpaper})` }}
                  />
                  <div className="iphone-device__wallpaper-scrim" />
                </div>

                <IPhoneStatusBar time={clock} />

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
                      <LocationWidget />

                      <div className="iphone-grid iphone-grid--folders">
                        {phoneFolders.map((folder) => (
                          <FolderIcon
                            key={folder.id}
                            folder={folder}
                            onOpen={openFolder}
                          />
                        ))}
                      </div>

                      <div className="iphone-search">
                        <button
                          type="button"
                          className="iphone-search__pill"
                          onClick={openArchiveInPhone}
                        >
                          Search projects
                        </button>
                      </div>
                    </>
                  ) : activeFolder ? (
                    <div className="iphone-folder-view">
                      <button
                        type="button"
                        className="iphone-folder-view__back"
                        onClick={goHome}
                      >
                        ‹ Home
                      </button>
                      <h2 className="iphone-folder-view__title">
                        {activeFolder.name}
                      </h2>
                      <div className="iphone-grid iphone-grid--apps">
                        {activeFolder.apps.map((app) => (
                          <AppIcon
                            key={app.id}
                            app={app}
                            onSelect={launchAppInPhone}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {view !== "inapp" ? (
                  <div className="iphone-dock">
                    {dockApps.map((app) => (
                      <AppIcon
                        key={app.id}
                        app={app}
                        size="dock"
                        onSelect={launchAppInPhone}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
          <p className="iphone-device__hint">
            Tap a folder or app · Everything opens inside the phone
          </p>
        </div>
      </div>
    </div>
  );
};

export default IPhoneHome;