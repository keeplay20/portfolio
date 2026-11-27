import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PhoneApp, PhoneFolder } from "../../data/iphoneHome";
import { IOSFolderPreview } from "./IOSAppIcon";
import IOSAppIcon from "./IOSAppIcon";

type FolderButtonProps = {
  folder: PhoneFolder;
  onOpen: () => void;
};

export function PhoneFolderButton({ folder, onOpen }: FolderButtonProps) {
  return (
    <button
      type="button"
      className="iphone-folder"
      onClick={onOpen}
      aria-label={`Open ${folder.name} folder`}
    >
      <IOSFolderPreview apps={folder.apps} />
      <span className="iphone-folder__label">{folder.name}</span>
    </button>
  );
}

type FolderOverlayProps = {
  folder: PhoneFolder;
  onClose: () => void;
  onSelectApp: (app: PhoneApp) => void;
};

export function PhoneFolderOverlay({
  folder,
  onClose,
  onSelectApp,
}: FolderOverlayProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="iphone-folder-view iphone-folder-view--open"
      role="dialog"
      aria-modal="true"
      aria-label={`${folder.name} folder`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="iphone-folder-view__header">
        <button
          type="button"
          className="iphone-folder-view__done"
          onClick={onClose}
        >
          Done
        </button>
      </div>
      <p className="iphone-folder-view__title">{folder.name}</p>
      <div className="iphone-grid iphone-grid--apps iphone-folder-view__grid">
        {folder.apps.map((app) => (
          <button
            key={app.id}
            type="button"
            className="iphone-app iphone-app--no-label"
            aria-label={app.name}
            onClick={() => onSelectApp(app)}
          >
            <span className="iphone-app__icon">
              <IOSAppIcon app={app} size="md" />
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

type Props = {
  folders: PhoneFolder[];
  openFolder: PhoneFolder | null;
  onOpenFolder: (folder: PhoneFolder) => void;
  onCloseFolder: () => void;
  onSelectApp: (app: PhoneApp) => void;
};

export function PhoneHomeFolders({
  folders,
  openFolder,
  onOpenFolder,
  onCloseFolder,
  onSelectApp,
}: Props) {
  return (
    <>
      <AnimatePresence mode="wait">
        {openFolder ? (
          <PhoneFolderOverlay
            key={openFolder.id}
            folder={openFolder}
            onClose={onCloseFolder}
            onSelectApp={(app) => {
              onCloseFolder();
              onSelectApp(app);
            }}
          />
        ) : (
          <motion.div
            key="home-folders"
            className="iphone-home-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="iphone-grid iphone-grid--folders iphone-grid--home">
              {folders.map((folder) => (
                <PhoneFolderButton
                  key={folder.id}
                  folder={folder}
                  onOpen={() => onOpenFolder(folder)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
