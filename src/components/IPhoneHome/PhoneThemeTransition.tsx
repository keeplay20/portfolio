import React, { useEffect, useState } from "react";
import type { PhoneThemeId } from "../../theme/phoneThemes";
import type { ThemeRevealOrigin } from "../../theme/theme";
import "./PhoneThemeTransition.css";

type PhoneThemeTransitionProps = {
  transitionKey: number;
  targetTheme: PhoneThemeId;
  origin?: ThemeRevealOrigin;
  onComplete: () => void;
};

const PhoneThemeTransition: React.FC<PhoneThemeTransitionProps> = ({
  transitionKey,
  targetTheme,
  origin,
  onComplete,
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
    const start = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(start);
  }, [transitionKey]);

  const handleEnd = () => {
    onComplete();
  };

  const style = origin
    ? ({
        ["--phone-reveal-x" as string]: `${origin.xPct}%`,
        ["--phone-reveal-y" as string]: `${origin.yPct}%`,
      } as React.CSSProperties)
    : undefined;

  return (
    <div
      className={`phone-theme-veil${
        active ? " phone-theme-veil--active" : ""
      }${origin ? " phone-theme-veil--circle" : " phone-theme-veil--fade"}`}
      data-phone-theme={targetTheme}
      style={style}
      onAnimationEnd={handleEnd}
      aria-hidden="true"
    />
  );
};

export default PhoneThemeTransition;