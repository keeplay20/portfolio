import React from "react";

type IPhoneStatusBarProps = {
  time: string | null;
};

export function StatusGlyphs() {
  return (
    <span className="iphone-status__tray" aria-hidden="true">
      <svg
        className="iphone-status__glyph iphone-status__glyph--cellular"
        viewBox="0 0 18 12"
        aria-hidden
      >
        <rect x="0" y="8" width="3" height="4" rx="0.6" fill="currentColor" opacity="0.4" />
        <rect x="5" y="6" width="3" height="6" rx="0.6" fill="currentColor" opacity="0.65" />
        <rect x="10" y="3" width="3" height="9" rx="0.6" fill="currentColor" opacity="0.85" />
        <rect x="15" y="0" width="3" height="12" rx="0.6" fill="currentColor" />
      </svg>
      <svg
        className="iphone-status__glyph iphone-status__glyph--wifi"
        viewBox="0 0 16 12"
        aria-hidden
      >
        <path
          d="M8 11.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
          fill="currentColor"
        />
        <path
          d="M4.9 7.8a5.2 5.2 0 0 1 6.2 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M1.8 4.7a9.4 9.4 0 0 1 12.4 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="iphone-status__glyph iphone-status__glyph--battery"
        viewBox="0 0 28 13"
        aria-hidden
      >
        <rect
          x="0.75"
          y="0.75"
          width="22.5"
          height="11.5"
          rx="3.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.15"
          opacity="0.45"
        />
        <rect
          x="2.25"
          y="2.25"
          width="17.5"
          height="8.5"
          rx="1.6"
          fill="currentColor"
        />
        <path
          d="M25.25 4.6v3.8"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}

function DynamicIsland() {
  return (
    <div className="iphone-status__island" aria-hidden>
      <span className="iphone-status__island-sensor" aria-hidden />
      <span className="iphone-status__island-lens" aria-hidden />
    </div>
  );
}

const IPhoneStatusBar: React.FC<IPhoneStatusBarProps> = ({ time }) => {
  return (
    <header className="iphone-status shell-status" role="presentation">
      <time
        className="iphone-status__time"
        dateTime={time ?? undefined}
        suppressHydrationWarning
      >
        {time ?? "\u00a0"}
      </time>
      <DynamicIsland />
      <StatusGlyphs />
    </header>
  );
};

export default IPhoneStatusBar;