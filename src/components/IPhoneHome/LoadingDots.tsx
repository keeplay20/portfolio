import React, { useId } from "react";
import "./LoadingDots.css";

const DOT_COUNT = 4;

type LoadingDotsProps = {
  size?: number;
  speed?: number;
  reduceMotion?: boolean;
  /** When true, centers inside a flex parent (iframe loader). */
  fill?: boolean;
  className?: string;
};

/**
 * Web port of the staggered hop loader (Skia reference); gradient from phone theme tokens.
 */
const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 100,
  speed = 1,
  reduceMotion = false,
  fill = true,
  className = "",
}) => {
  const uid = useId().replace(/:/g, "");
  const gradientId = `loading-dots-grad-${uid}`;
  const durationSec = 1.2 / speed;
  const height = (size * 50) / 140;

  return (
    <div
      className={`loading-dots${fill ? " loading-dots--fill" : ""}${
        reduceMotion ? " loading-dots--still" : ""
      }${className ? ` ${className}` : ""}`}
      role="progressbar"
      aria-label="Loading"
      style={
        fill
          ? undefined
          : ({ width: size, height } as React.CSSProperties)
      }
    >
      <svg
        className="loading-dots__svg"
        viewBox="0 0 140 50"
        width={size}
        height={height}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="18"
            y1="0"
            x2="122"
            y2="0"
          >
            <stop offset="0%" stopColor="var(--phone-loader-dot-a, var(--phone-accent-soft, #d4a574))" />
            <stop offset="100%" stopColor="var(--phone-loader-dot-b, var(--phone-settings-accent, #0a84ff))" />
          </linearGradient>
        </defs>
        {Array.from({ length: DOT_COUNT }, (_, i) => {
          const cx = 70 - ((DOT_COUNT - 1) * 32) / 2 + i * 32;
          return (
            <circle
              key={i}
              className="loading-dots__dot"
              cx={cx}
              cy={33}
              r={9}
              fill={`url(#${gradientId})`}
              style={
                reduceMotion
                  ? undefined
                  : ({
                      animationDuration: `${durationSec}s`,
                      animationDelay: `${(i * 140) / 1000 / speed}s`,
                    } as React.CSSProperties)
              }
            />
          );
        })}
      </svg>
    </div>
  );
};

export default LoadingDots;