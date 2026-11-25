import React from "react";
import { PhoneApp } from "../../data/iphoneHome";
import "./IOSAppIcon.css";

type Props = {
  app: PhoneApp;
  size?: "md" | "dock" | "mini";
  badge?: string;
};

function iconUsesLightArt(iconFg?: string): boolean {
  if (!iconFg) return true;
  const fg = iconFg.trim().toLowerCase();
  return fg === "#fff" || fg === "#ffffff" || fg === "white";
}

const IOSAppIcon: React.FC<Props> = ({ app, size = "md", badge }) => {
  const bg =
    app.iconBackground ?? app.iconBg ?? "linear-gradient(145deg, #3a3a3c, #1c1c1e)";

  return (
    <span
      className={`ios-icon ios-icon--${size}`}
      style={{ background: bg }}
    >
      {app.iconImage ? (
        <img
          className="ios-icon__photo"
          src={app.iconImage}
          alt=""
          loading="lazy"
          draggable={false}
        />
      ) : (
        <span className="ios-icon__art" aria-hidden="true">
          <IconGraphic id={app.id} light={iconUsesLightArt(app.iconFg)} />
        </span>
      )}
      <span className="ios-icon__shine" aria-hidden="true" />
      {badge ? <span className="ios-icon__badge">{badge}</span> : null}
      {app.badge && !badge ? (
        <span className="ios-icon__badge">{app.badge}</span>
      ) : null}
    </span>
  );
};

function IconGraphic({ id, light }: { id: string; light?: boolean }) {
  const stroke = light ? "#fff" : "#1c1c1e";
  const fill = light ? "rgba(255,255,255,0.92)" : "rgba(28,28,30,0.9)";

  switch (id) {
    case "deep-link-doctor":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path
            d="M14 24h8M22 16v16M30 20a6 6 0 1 1-6 6"
            stroke={stroke}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M34 14l4 4M34 22l4-4"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "animate-spotlight-showcase":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path
            d="M8 36 L24 8 L40 36 Z"
            fill={fill}
            opacity="0.35"
          />
          <path d="M8 36h32" stroke={stroke} strokeWidth="2" />
          <circle cx="36" cy="14" r="6" fill={fill} />
        </svg>
      );
    case "transition-trail-explorer":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <circle cx="12" cy="24" r="4" fill={fill} />
          <circle cx="24" cy="16" r="4" fill={fill} />
          <circle cx="36" cy="28" r="4" fill={fill} />
          <path
            d="M16 22 L20 18 M28 18 L32 26"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "moviebuzz":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="10" y="14" width="28" height="20" rx="3" fill={fill} />
          <path d="M20 14v20l12-10-12-10z" fill={stroke} />
        </svg>
      );
    case "sudoku":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect
            x="10"
            y="10"
            width="28"
            height="28"
            rx="4"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
          />
          <path d="M10 26h28M26 10v28" stroke={stroke} strokeWidth="1.5" />
          <text x="15" y="22" fontSize="8" fill={stroke} fontWeight="700">
            9
          </text>
          <text x="30" y="36" fontSize="8" fill={stroke} fontWeight="700">
            3
          </text>
        </svg>
      );
    case "wander-travel":
    case "wander":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <circle cx="24" cy="20" r="8" fill={fill} />
          <path
            d="M12 38c4-8 20-8 24 0"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    case "javascript-mini-projects":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <text x="24" y="30" textAnchor="middle" fontSize="14" fill={stroke} fontWeight="700">
            JS
          </text>
        </svg>
      );
    case "html-css-projects":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <text x="24" y="28" textAnchor="middle" fontSize="11" fill={stroke} fontWeight="700">
            HTML
          </text>
        </svg>
      );
    case "playground":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="14" y="18" width="20" height="14" rx="4" fill={fill} />
          <circle cx="20" cy="35" r="3" fill={fill} />
          <circle cx="28" cy="35" r="3" fill={fill} />
        </svg>
      );
    case "tictactoe":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path d="M16 10v28M32 10v28M10 16h28M10 32h28" stroke={stroke} strokeWidth="2" />
          <path d="M13 13l6 6M35 35l-6-6M35 13l-6 6M13 35l6-6" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "rps":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <circle cx="18" cy="28" r="7" fill={fill} />
          <rect x="26" y="20" width="10" height="14" rx="2" fill={fill} />
          <path d="M32 12v6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "snake":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="12" y="22" width="8" height="8" rx="2" fill={fill} />
          <rect x="20" y="22" width="8" height="8" rx="2" fill={fill} />
          <rect x="28" y="18" width="8" height="8" rx="2" fill={fill} />
          <circle cx="36" cy="20" r="3" fill="#ff375f" />
        </svg>
      );
    case "typing":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="8" y="18" width="32" height="18" rx="4" fill={fill} />
          <rect x="12" y="22" width="4" height="3" rx="0.5" fill={stroke} opacity="0.5" />
          <rect x="18" y="22" width="4" height="3" rx="0.5" fill={stroke} opacity="0.5" />
          <rect x="24" y="22" width="12" height="3" rx="0.5" fill={stroke} opacity="0.5" />
        </svg>
      );
    case "memory":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="10" y="14" width="12" height="20" rx="2" fill={fill} />
          <rect x="26" y="14" width="12" height="20" rx="2" fill={fill} />
          <text x="16" y="28" fontSize="10" fill={stroke}>?</text>
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="8" y="14" width="32" height="22" rx="4" fill={fill} />
          <path d="M8 16l16 12 16-12" stroke={stroke} strokeWidth="2" fill="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <text x="24" y="32" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="800" fontFamily="system-ui">
            in
          </text>
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 16 16" className="ios-icon__svg" aria-hidden="true">
          <path
            fill={stroke}
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.18.82a7.49 7.49 0 0 1 2-.27 7.5 7.5 0 0 1 2 .27c1.51-1.04 2.18-.82 2.18-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      );
    case "archive":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path d="M10 18h28v18a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V18z" fill={fill} />
          <path d="M8 14h32v6H8z" fill={fill} />
          <path d="M20 26h8v2h-8z" fill={stroke} opacity="0.6" />
        </svg>
      );
    case "superhealth":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path d="M24 12v24M12 24h24" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "dream11":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <text x="24" y="30" textAnchor="middle" fontSize="11" fill={stroke} fontWeight="800">
            D11
          </text>
        </svg>
      );
    case "gupshup":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path
            d="M14 14h20a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H18l-6 6v-6h-2a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z"
            fill={fill}
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <text x="24" y="30" textAnchor="middle" fontSize="12" fill={stroke} fontWeight="700">
            {id.slice(0, 2).toUpperCase()}
          </text>
        </svg>
      );
  }
}

export function IOSFolderPreview({ apps }: { apps: PhoneApp[] }) {
  const slice = apps.slice(0, 4);
  return (
    <span className="ios-folder-icon">
      <span className="ios-folder-icon__glass" />
      <span className="ios-folder-icon__grid">
        {slice.map((app) => (
          <span key={app.id} className="ios-folder-icon__cell">
            <IOSAppIcon app={app} size="mini" />
          </span>
        ))}
      </span>
    </span>
  );
}

export default IOSAppIcon;