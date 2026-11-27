import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./VolumeHUD.css";

type VolumeHUDProps = {
  visible: boolean;
  volume: number;
  muted: boolean;
};

const VolumeHUD: React.FC<VolumeHUDProps> = ({ visible, volume, muted }) => {
  const fill = muted ? 0 : Math.min(1, Math.max(0, volume));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="phone-volume-hud"
          role="presentation"
          aria-hidden
          initial={{ opacity: 0, x: -8, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -6, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="phone-volume-hud__pill">
            {muted ? (
              <svg
                className="phone-volume-hud__icon phone-volume-hud__icon--mute"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.58 4.58c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.24 1.57-.65 2.22l1.45 1.45A5.94 5.94 0 0 0 21 12c0-3.11-2.29-5.8-5.4-6.32V3.51C18.35 4.01 21 7.73 21 12zm-8-8v2.34c.9.21 1.71.63 2.36 1.2l1.45-1.45A6.91 6.91 0 0 0 11 4z"
                />
              </svg>
            ) : (
              <svg
                className="phone-volume-hud__icon"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 9.97v4.06c1.48-.73 2.5-2.25 2.5-4.03z"
                />
              </svg>
            )}
            <div className="phone-volume-hud__track" aria-hidden>
              <motion.div
                className="phone-volume-hud__fill"
                initial={false}
                animate={{ height: `${fill * 100}%` }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default VolumeHUD;