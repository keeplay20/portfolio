import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  dockApps,
  phoneFolders,
  PhoneApp,
  PhoneFolder,
  resolveAppHref,
} from "../../data/iphoneHome";
import { experiences, projects } from "../../data/portfolio";
import IOSAppIcon, { IOSFolderPreview } from "./IOSAppIcon";
import IPhoneStatusBar from "./IPhoneStatusBar";
import LocationWidget from "./LocationWidget";
import woodTexture from "../../assets/images/wood-table-texture.jpg";
import phoneWallpaper from "../../assets/images/phone-wallpapers/midnight-oil.jpg";
import "./IPhoneHome.css";

type PhoneView = "home" | "folder";

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
  const [selectedApp, setSelectedApp] = useState<PhoneApp | null>(null);
  const [overviewFolder, setOverviewFolder] = useState<PhoneFolder | null>(
    null
  );

  const openFolder = useCallback((folder: PhoneFolder) => {
    setActiveFolder(folder);
    setView("folder");
    setSelectedApp(null);
    setOverviewFolder(folder);
  }, []);

  const goHome = useCallback(() => {
    setView("home");
    setActiveFolder(null);
    setSelectedApp(null);
    setOverviewFolder(null);
  }, []);

  const selectApp = useCallback(
    (app: PhoneApp) => {
      const dest = app.destination;
      if (dest.type === "route" && dest.path.startsWith("/games/")) {
        navigate(dest.path);
        return;
      }
      setSelectedApp(app);
    },
    [navigate]
  );

  const selectDockApp = useCallback((app: PhoneApp) => {
    const dest = app.destination;
    if (dest.type === "external") {
      if (dest.url.startsWith("mailto:")) {
        window.location.href = dest.url;
      } else {
        window.open(dest.url, "_blank", "noopener,noreferrer");
      }
      return;
    }
    if (dest.type === "route") {
      const url = new URL(dest.path, window.location.origin).href;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedApp(app);
    setOverviewFolder(null);
  }, []);

  const overviewLinks = useMemo(() => {
    if (!selectedApp) return [];
    return resolveAppHref(selectedApp.destination, projects);
  }, [selectedApp]);

  const experienceDetail = useMemo(() => {
    const dest = selectedApp?.destination;
    if (!dest || dest.type !== "experience") return null;
    return experiences.find((e) => e.id === dest.experienceId);
  }, [selectedApp]);

  const handleOpenLink = (href: string, external: boolean) => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(href);
  };

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
            <div className="iphone-device__screen">
              <div className="iphone-device__wallpaper" aria-hidden="true">
                <div
                  className="iphone-device__wallpaper-slide"
                  style={{ backgroundImage: `url(${phoneWallpaper})` }}
                />
                <div className="iphone-device__wallpaper-scrim" />
              </div>

              <IPhoneStatusBar time={clock} />

              <div className="iphone-screen__scroll">
                {view === "home" ? (
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
                      <Link to="/work" className="iphone-search__pill">
                        Search projects
                      </Link>
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
                        <AppIcon key={app.id} app={app} onSelect={selectApp} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="iphone-dock">
                {dockApps.map((app) => (
                  <AppIcon
                    key={app.id}
                    app={app}
                    size="dock"
                    onSelect={selectDockApp}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="iphone-device__hint">
            Tap a folder or app · Overview opens on the right
          </p>
        </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.aside
            key={selectedApp?.id ?? overviewFolder?.id ?? "empty"}
            className="iphone-overview"
            initial={{ opacity: 0, x: 16, rotate: -2.5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: 8, rotate: 1.5 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {!selectedApp && !overviewFolder ? (
              <div className="iphone-overview__note iphone-overview__note--idle">
                <p className="iphone-overview__eyebrow">Overview</p>
                <h2>Select a folder or app</h2>
                <p>
                  Open Web Projects, App Projects, Games, or Experience on the
                  phone, then tap an icon to preview and navigate.
                </p>
              </div>
            ) : selectedApp ? (
              <div
                className={`iphone-overview__note iphone-overview__note--app${
                  experienceDetail ? " iphone-overview__note--experience" : ""
                }`}
              >
                <p className="iphone-overview__eyebrow">
                  {experienceDetail ? "Experience" : "App"}
                </p>
                <h2>{selectedApp.name}</h2>
                {!experienceDetail ? (
                  <p className="iphone-overview__body">{selectedApp.overview}</p>
                ) : null}

                {experienceDetail ? (
                  <>
                    <p className="iphone-overview__role">
                      {experienceDetail.position}
                      <span className="iphone-overview__role-meta">
                        {experienceDetail.duration}
                        {experienceDetail.location
                          ? ` · ${experienceDetail.location}`
                          : ""}
                      </span>
                    </p>
                    <ul className="iphone-overview__list">
                      {experienceDetail.description.map((line) => (
                        <li key={line.slice(0, 40)}>{line}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {overviewLinks.length > 0 ? (
                <div className="iphone-overview__actions">
                  {overviewLinks.map((link) =>
                    link.disabled ? (
                      <button
                        key={link.label}
                        type="button"
                        className="btn btn-ghost iphone-overview__soon"
                        disabled
                      >
                        Coming soon
                      </button>
                    ) : (
                      <button
                        key={link.label}
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          handleOpenLink(link.href, link.external)
                        }
                      >
                        Live site
                        {link.external ? (
                          <span aria-hidden="true"> ↗</span>
                        ) : null}
                      </button>
                    )
                  )}
                </div>
                ) : null}
              </div>
            ) : overviewFolder ? (
              <div className="iphone-overview__note iphone-overview__note--folder">
                <p className="iphone-overview__eyebrow">Folder</p>
                <h2>{overviewFolder.name}</h2>
                <p className="iphone-overview__body">{overviewFolder.overview}</p>
                <ul className="iphone-overview__chips">
                  {overviewFolder.apps.map((app) => (
                    <li key={app.id}>
                      <button
                        type="button"
                        className="iphone-overview__chip"
                        onClick={() => {
                          if (view === "home") openFolder(overviewFolder);
                          selectApp(app);
                        }}
                      >
                        {app.name}
                      </button>
                    </li>
                  ))}
                </ul>
                {view === "home" ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => openFolder(overviewFolder)}
                  >
                    Open folder
                  </button>
                ) : null}
              </div>
            ) : null}
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IPhoneHome;