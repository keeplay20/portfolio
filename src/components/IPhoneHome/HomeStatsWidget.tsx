import React, { useEffect, useState } from "react";
import { homeScreenStats, openSourceStat } from "../../data/homeScreenStats";
import { usePhoneShellSettings } from "../../theme/PhoneShellSettingsProvider";
import "./HomeStatsWidget.css";

type HomeStatsWidgetProps = {
  compact?: boolean;
  onOpenSource?: () => void;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const cellVars = (accent: string, index: number): React.CSSProperties =>
  ({
    "--accent": accent,
    "--i": index,
  }) as React.CSSProperties;

const useCountUp = (
  target: number,
  reduceMotion: boolean,
  duration = 900,
  delay = 0
) => {
  const [current, setCurrent] = useState(() =>
    reduceMotion || prefersReducedMotion() || Number.isNaN(target) ? target : 0
  );

  useEffect(() => {
    if (reduceMotion || prefersReducedMotion() || Number.isNaN(target)) {
      setCurrent(target);
      return;
    }
    setCurrent(0);
    let raf = 0;
    let start: number | null = null;
    const timeout = window.setTimeout(() => {
      const tick = (now: number) => {
        start ??= now;
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCurrent(Math.round(target * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, reduceMotion]);

  return current;
};

type AnimatedValueProps = {
  value: number;
  suffix?: string;
  delay?: number;
  reduceMotion: boolean;
};

const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  suffix = "",
  delay,
  reduceMotion,
}) => {
  const current = useCountUp(value, reduceMotion, 900, delay);
  const finalLabel = `${value}${suffix}`;
  return (
    <p className="iphone-stats-widget__value" aria-label={finalLabel}>
      <span aria-hidden="true">
        {current}
        {suffix}
      </span>
    </p>
  );
};

const HomeStatsWidget: React.FC<HomeStatsWidgetProps> = ({
  compact = false,
  onOpenSource,
}) => {
  const { display } = usePhoneShellSettings();
  const reduceMotion = display.reduceMotion;
  const { dream11, superhealth, yearsExperience } = homeScreenStats;
  const repoLabel = `${openSourceStat.repos} repo${
    openSourceStat.repos === 1 ? "" : "s"
  }`;

  return (
    <section
      className={`iphone-stats-widget${
        compact ? " iphone-stats-widget--compact" : ""
      }`}
      aria-label="Career stats"
    >
      <div className="iphone-stats-widget__grid">
        <article
          className="iphone-stats-widget__cell"
          style={cellVars("#ffb454", 0)}
        >
          <div className="iphone-stats-widget__body">
            <AnimatedValue
              value={Number(yearsExperience)}
              suffix="+"
              delay={0}
              reduceMotion={reduceMotion}
            />
            <p className="iphone-stats-widget__label">Years experience</p>
          </div>
        </article>

        <button
          type="button"
          className="iphone-stats-widget__cell iphone-stats-widget__cell--button"
          style={cellVars("#c084fc", 1)}
          onClick={onOpenSource}
          aria-label={`Open source: ${openSourceStat.mergedPrs} merged pull requests across ${repoLabel}. Open details.`}
        >
          <div className="iphone-stats-widget__body">
            <AnimatedValue
              value={openSourceStat.mergedPrs}
              delay={120}
              reduceMotion={reduceMotion}
            />
            <p className="iphone-stats-widget__label">{openSourceStat.label}</p>
          </div>
          <span className="iphone-stats-widget__chevron" aria-hidden="true">
            ›
          </span>
        </button>

        <article
          className="iphone-stats-widget__cell"
          style={cellVars("#60a5fa", 2)}
        >
          <div className="iphone-stats-widget__body">
            <AnimatedValue
              value={dream11.value}
              suffix={dream11.suffix}
              delay={240}
              reduceMotion={reduceMotion}
            />
            <p className="iphone-stats-widget__label">{dream11.label}</p>
          </div>
        </article>

        <article
          className="iphone-stats-widget__cell"
          style={cellVars("#2dd4bf", 3)}
        >
          <div className="iphone-stats-widget__body">
            <p className="iphone-stats-widget__value">{superhealth.headline}</p>
            <p className="iphone-stats-widget__label">{superhealth.label}</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default React.memo(HomeStatsWidget);