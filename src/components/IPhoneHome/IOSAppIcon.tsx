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

function isBrandAppIcon(src?: string): boolean {
  return Boolean(src?.includes("/app-icons/"));
}

function wordmarkSizeClass(text: string): string {
  const len = text.trim().length;
  if (len <= 5) return "ios-icon__wordmark--s";
  if (len <= 8) return "ios-icon__wordmark--m";
  if (len <= 11) return "ios-icon__wordmark--l";
  return "ios-icon__wordmark--xl";
}

const IOSAppIcon: React.FC<Props> = ({ app, size = "md", badge }) => {
  const brandIcon = isBrandAppIcon(app.iconImage);
  const bg =
    app.iconBackground ?? app.iconBg ?? "linear-gradient(145deg, #3a3a3c, #1c1c1e)";

  const wordmark = app.iconWordmark?.trim();

  return (
    <span
      className={`ios-icon ios-icon--${size}${
        brandIcon ? " ios-icon--brand" : ""
      }${wordmark && !app.iconImage ? " ios-icon--wordmark" : ""}`}
      style={{ background: brandIcon ? "transparent" : bg }}
    >
      {app.iconImage ? (
        <img
          className="ios-icon__photo"
          src={app.iconImage}
          alt=""
          loading="lazy"
          draggable={false}
        />
      ) : wordmark ? (
        <span
          className={`ios-icon__wordmark ${wordmarkSizeClass(wordmark)}`}
          style={{ color: app.iconFg ?? "#ffffff" }}
          aria-hidden="true"
        >
          {wordmark}
        </span>
      ) : (
        <span className="ios-icon__art" aria-hidden="true">
          <IconGraphic id={app.id} light={iconUsesLightArt(app.iconFg)} />
        </span>
      )}
      {brandIcon ? null : (
        <span className="ios-icon__shine" aria-hidden="true" />
      )}
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
            d="M18 26a6 6 0 1 1 4.24-10.24"
            stroke={stroke}
            strokeWidth="2.75"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M30 16h6v6M33 19l-8 8"
            stroke={stroke}
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M14 34h20"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      );
    case "animate-spotlight-showcase":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path
            d="M14 38h20"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 36V22M24 22 12 10h24z"
            fill={fill}
            opacity="0.9"
          />
          <circle cx="34" cy="14" r="5" fill={stroke} opacity="0.95" />
          <path
            d="M34 19v3M31 22h6"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "transition-trail-explorer":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <circle cx="12" cy="26" r="5" fill={fill} />
          <circle cx="26" cy="14" r="5" fill={fill} />
          <circle cx="36" cy="32" r="5" fill={fill} />
          <path
            d="M17 24l6-6m4 2 7 4"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case "moviebuzz":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="9" y="13" width="30" height="22" rx="4" fill={fill} opacity="0.4" />
          <path
            d="M21 13v22l14-11-14-11z"
            fill={stroke}
          />
          <path
            d="M11 17h6M11 21h4"
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.45"
          />
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
            fill={fill}
            opacity="0.35"
          />
          <path
            d="M10 26h28M26 10v28M18 10v28M34 10v28M10 18h28"
            stroke={stroke}
            strokeWidth="1.35"
          />
          <text
            x="14"
            y="22"
            fontSize="8"
            fill={stroke}
            fontWeight="800"
            fontFamily="Graphik, Helvetica Neue, sans-serif"
          >
            9
          </text>
          <text
            x="30"
            y="38"
            fontSize="8"
            fill={stroke}
            fontWeight="800"
            fontFamily="Graphik, Helvetica Neue, sans-serif"
          >
            3
          </text>
        </svg>
      );
    case "wander-travel":
    case "wander":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <circle
            cx="24"
            cy="24"
            r="13"
            stroke={stroke}
            strokeWidth="2.5"
            fill="none"
            opacity="0.55"
          />
          <path
            d="M24 13v22M24 24l9-4"
            stroke={stroke}
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          <circle cx="24" cy="24" r="3.5" fill={fill} />
          <path
            d="M30 34l4 4M14 34l-4 4"
            stroke={stroke}
            strokeWidth="2.25"
            strokeLinecap="round"
          />
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
          <rect
            x="11"
            y="11"
            width="26"
            height="26"
            rx="4"
            fill={fill}
            opacity="0.35"
          />
          <path
            d="M19 11v26M29 11v26M11 19h26M11 29h26"
            stroke={stroke}
            strokeWidth="2.25"
          />
          <circle cx="15" cy="15" r="2.75" fill={stroke} />
          <path
            d="M33 33l-6-6M27 33l6-6"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "rps":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <path
            d="M16 32c0-6 4-12 8-14 4 2 8 8 8 14"
            fill={fill}
          />
          <rect x="12" y="26" width="8" height="6" rx="2" fill={stroke} opacity="0.35" />
          <path
            d="M28 14v8c0 3 2 5 5 5"
            stroke={stroke}
            strokeWidth="2.75"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M34 27 28 20v-3"
            stroke={stroke}
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    case "snake":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="10" y="26" width="7" height="7" rx="2" fill={fill} />
          <rect x="17" y="26" width="7" height="7" rx="2" fill={fill} />
          <rect x="24" y="22" width="7" height="7" rx="2" fill={fill} />
          <rect x="31" y="18" width="7" height="7" rx="2" fill={fill} />
          <circle cx="36" cy="20" r="1.75" fill="#ff375f" />
          <rect x="14" y="14" width="6" height="6" rx="2" fill="#ff375f" opacity="0.9" />
        </svg>
      );
    case "typing":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="8" y="17" width="32" height="19" rx="5" fill={fill} />
          <rect x="12" y="21" width="5" height="4" rx="1" fill={stroke} opacity="0.65" />
          <rect x="19" y="21" width="5" height="4" rx="1" fill={stroke} opacity="0.65" />
          <rect x="26" y="21" width="5" height="4" rx="1" fill={stroke} opacity="0.65" />
          <rect x="33" y="21" width="3" height="4" rx="1" fill={stroke} opacity="0.65" />
          <rect x="16" y="29" width="16" height="4" rx="1" fill={stroke} opacity="0.5" />
          <text
            x="24"
            y="13"
            textAnchor="middle"
            fontSize="7"
            fill={stroke}
            fontWeight="700"
            opacity="0.85"
          >
            WPM
          </text>
        </svg>
      );
    case "memory":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <rect x="9" y="13" width="14" height="22" rx="3" fill={fill} />
          <rect x="25" y="13" width="14" height="22" rx="3" fill={fill} />
          <path
            d="M16 20h2v8h-2zM20 22h4v4h-4z"
            fill={stroke}
            opacity="0.7"
          />
          <path
            d="M32 20h2v8h-2zM28 22h4v4h-4z"
            fill={stroke}
            opacity="0.7"
          />
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
          <text x="24" y="32" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="800" fontFamily="Graphik, Helvetica Neue, sans-serif">
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
    case "opensource":
      return (
        <svg viewBox="0 0 48 48" className="ios-icon__svg">
          <circle cx="17" cy="14" r="5.25" fill={fill} />
          <circle cx="31" cy="24" r="5.25" fill={fill} />
          <circle cx="17" cy="34" r="5.25" fill={fill} />
          <path
            d="M17 19.5v9M22.2 17.8 27.5 22M22.2 30.2 27.5 26"
            stroke={stroke}
            strokeWidth="2.35"
            strokeLinecap="round"
            fill="none"
          />
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