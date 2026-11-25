import React from "react";

type IPhoneStatusBarProps = {
  time: string;
};

export function StatusGlyphs() {
  return (
    <span className="iphone-status__tray" aria-hidden="true">
      <svg
        className="iphone-status__glyph iphone-status__glyph--cellular"
        viewBox="0 0 18 12"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="0" y="8" width="3" height="4" rx="0.6" />
        <rect x="5" y="6" width="3" height="6" rx="0.6" />
        <rect x="10" y="3" width="3" height="9" rx="0.6" />
        <rect x="15" y="0" width="3" height="12" rx="0.6" />
      </svg>
      <svg
        className="iphone-status__glyph iphone-status__glyph--wifi"
        viewBox="0 0 16 12"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 11.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" />
        <path
          d="M4.7 7.8a5.2 5.2 0 0 1 6.6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M1.4 4.5a9.2 9.2 0 0 1 13.2 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="iphone-status__glyph iphone-status__glyph--battery"
        viewBox="0 0 28 13"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="12"
          rx="3.2"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
        <rect
          x="2.2"
          y="2.2"
          width="17.5"
          height="8.6"
          rx="2"
          fill="currentColor"
        />
        <path
          d="M25.5 4.2v4.6c1.2-.35 2-1.35 2-2.3s-.8-1.95-2-2.3Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
      </svg>
    </span>
  );
}

const IPhoneStatusBar: React.FC<IPhoneStatusBarProps> = ({ time }) => {
  return (
    <header className="iphone-status" role="presentation">
      <time className="iphone-status__time" dateTime={time}>
        {time}
      </time>
      <div className="iphone-status__island" aria-hidden="true">
        <span className="iphone-status__island-lens" />
      </div>
      <StatusGlyphs />
    </header>
  );
};

export default IPhoneStatusBar;