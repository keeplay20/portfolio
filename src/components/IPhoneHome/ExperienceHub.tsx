import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutGroup,
  motion,
  useReducedMotion,
  type TargetAndTransition,
} from "framer-motion";
import { experiences } from "../../data/portfolio";
import {
  getExperienceHubTheme,
  getExperienceIconImage,
} from "../../data/iphoneHome";
import { Experience } from "../../types";
import ExperienceDeepDive from "./ExperienceDeepDive";
import ExperienceStickyBoard from "./ExperienceStickyBoard";
import "./ExperienceHub.css";

const SWIPE_OFFSET_PX = 48;
const SWIPE_VELOCITY_PX_MS = 0.42;
const WHEEL_GESTURE_IDLE_MS = 140;

/** Shared timing for logo carousel + card pages */
const HUB_PAGE_TRANSITION = {
  type: "spring" as const,
  stiffness: 240,
  damping: 30,
  mass: 1.05,
};

type ExperienceHubProps = {
  onClose: () => void;
};

function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function getCardHighlight(exp: Experience): string {
  return exp.cardHighlight;
}

function ExperienceCardSection({
  exp,
  onKnowMore,
}: {
  exp: Experience;
  onKnowMore: (id: string) => void;
}) {
  const highlight = getCardHighlight(exp);
  const tenureMeta = [exp.duration, exp.location].filter(Boolean).join(" · ");

  return (
    <section
      className="exp-hub__card-section"
      aria-labelledby={`exp-hub-role-${exp.id}`}
    >
      <div className="exp-hub__card-header">
        {tenureMeta ? <p className="exp-hub__card-tenure">{tenureMeta}</p> : null}
        <h2 className="exp-hub__role" id={`exp-hub-role-${exp.id}`}>
          {exp.position}
        </h2>
        <p className="exp-hub__company">{exp.company}</p>
      </div>

      {highlight ? (
        <motion.p className="exp-hub__highlight" layout={false}>
          {highlight}
        </motion.p>
      ) : null}

      <div className="exp-hub__card-grow" aria-hidden />

      <button
        type="button"
        className="exp-hub__cta"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onKnowMore(exp.id)}
      >
        Know more
      </button>
    </section>
  );
}

type LogoCarouselTileProps = {
  exp: Experience;
  slot: "left" | "center" | "right";
  transition: { duration: number } | { type: "spring"; stiffness: number; damping: number; mass: number };
};

function LogoCarouselTile({ exp, slot, transition }: LogoCarouselTileProps) {
  return (
    <motion.div
      layout
      layoutId={`exp-hub-logo-${exp.id}`}
      className={`exp-hub__logo-tile exp-hub__logo-tile--${slot}`}
      transition={transition}
    >
      <img
        src={getExperienceIconImage(exp.id)}
        alt=""
        className="exp-hub__logo-tile-img"
      />
    </motion.div>
  );
}

const ExperienceHub: React.FC<ExperienceHubProps> = ({ onClose }) => {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [detailId, setDetailId] = useState<string | null>(null);

  const swipeStartXRef = useRef<number | null>(null);
  const dragActiveRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const pointerVelocityRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardViewportRef = useRef<HTMLDivElement>(null);
  const [cardPageHeight, setCardPageHeight] = useState(0);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const count = experiences.length;
  const activeExperience = experiences[index];
  const prevId = wrapIndex(index - 1, count);
  const nextId = wrapIndex(index + 1, count);
  const prevExperience = experiences[prevId];
  const nextExperience = experiences[nextId];

  const detail = detailId
    ? experiences.find((item) => item.id === detailId)
    : undefined;

  const paginate = useCallback((delta: number) => {
    if (count <= 1) return;
    setIndex((prev) => wrapIndex(prev + delta, count));
  }, [count]);

  useEffect(() => {
    const viewport = cardViewportRef.current;
    if (!viewport) return;

    const measure = () => setCardPageHeight(viewport.clientHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = showcaseRef.current;
    if (!root) return;

    const flushWheel = () => {
      const accumulated = wheelAccumRef.current;
      wheelAccumRef.current = 0;
      wheelIdleTimerRef.current = null;
      if (accumulated >= SWIPE_OFFSET_PX) {
        paginate(1);
      } else if (accumulated <= -SWIPE_OFFSET_PX) {
        paginate(-1);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      wheelAccumRef.current += event.deltaX;
      if (wheelIdleTimerRef.current) {
        clearTimeout(wheelIdleTimerRef.current);
      }
      wheelIdleTimerRef.current = setTimeout(flushWheel, WHEEL_GESTURE_IDLE_MS);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      if (wheelIdleTimerRef.current) {
        clearTimeout(wheelIdleTimerRef.current);
      }
    };
  }, [paginate]);

  const onShowcasePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.button !== 0) return;
    dragActiveRef.current = true;
    setIsDragging(true);
    swipeStartXRef.current = event.clientX;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = performance.now();
    pointerVelocityRef.current = 0;
    showcaseRef.current?.setPointerCapture(event.pointerId);
  }, []);

  const onShowcasePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!dragActiveRef.current || swipeStartXRef.current === null) return;

      const now = performance.now();
      const elapsed = now - lastPointerTimeRef.current;
      if (elapsed > 0) {
        pointerVelocityRef.current =
          (event.clientX - lastPointerXRef.current) / elapsed;
      }
      lastPointerXRef.current = event.clientX;
      lastPointerTimeRef.current = now;
    },
    []
  );

  const onShowcasePointerUp = useCallback(
    (event: React.PointerEvent) => {
      const startX = swipeStartXRef.current;
      swipeStartXRef.current = null;
      dragActiveRef.current = false;
      setIsDragging(false);
      if (showcaseRef.current?.hasPointerCapture(event.pointerId)) {
        showcaseRef.current.releasePointerCapture(event.pointerId);
      }
      if (startX === null) return;

      const delta = event.clientX - startX;
      const velocity = pointerVelocityRef.current;
      const shouldAdvance =
        delta < -SWIPE_OFFSET_PX || velocity < -SWIPE_VELOCITY_PX_MS;
      const shouldRetreat =
        delta > SWIPE_OFFSET_PX || velocity > SWIPE_VELOCITY_PX_MS;

      if (shouldAdvance) {
        paginate(1);
      } else if (shouldRetreat) {
        paginate(-1);
      }
    },
    [paginate]
  );

  const onShowcasePointerCancel = useCallback(
    (event: React.PointerEvent) => {
      swipeStartXRef.current = null;
      dragActiveRef.current = false;
      setIsDragging(false);
      if (showcaseRef.current?.hasPointerCapture(event.pointerId)) {
        showcaseRef.current.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  if (detail) {
    return (
      <div className="exp-hub exp-hub--detail">
        <header className="exp-hub__topbar">
          <button
            type="button"
            className="exp-hub__nav-btn"
            onClick={() => setDetailId(null)}
          >
            ← Back
          </button>
          <p className="exp-hub__topbar-title">{detail.company}</p>
          <button
            type="button"
            className="exp-hub__nav-btn exp-hub__nav-btn--ghost"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <div ref={detailScrollRef} className="exp-hub__detail-scroll">
          {detail.deepDive ? (
            <ExperienceDeepDive experience={detail} variant="hub" />
          ) : (
            <article className="exp-hub__detail-panel" aria-label={detail.company}>
              <h2 className="exp-hub__detail-sr-title">
                {detail.position}, {detail.company}
              </h2>
              <ExperienceStickyBoard
                variant="hub"
                summary={detail.cardHighlight}
                impact={[{ title: "Impact", bullets: detail.description }]}
                stack={[{ label: "Tech", items: detail.technologies }]}
                scrollContainerRef={detailScrollRef}
              />
            </article>
          )}
        </div>
      </div>
    );
  }

  const pageTransition = reduceMotion ? { duration: 0 } : HUB_PAGE_TRANSITION;
  const hubTheme = getExperienceHubTheme(activeExperience.id);
  const hubThemeVars = {
    "--exp-hub-deep": hubTheme.deep,
    "--exp-hub-accent": hubTheme.accent,
  };

  return (
    <motion.div
      className="exp-hub"
      style={hubThemeVars as React.CSSProperties}
      initial={false}
      animate={hubThemeVars as TargetAndTransition}
      transition={pageTransition}
    >
      <header className="exp-hub__topbar">
        <button type="button" className="exp-hub__nav-btn" onClick={onClose}>
          ← Home
        </button>
        <p className="exp-hub__topbar-title">Experience</p>
        <span className="exp-hub__topbar-slot" aria-hidden />
      </header>

      <div
        ref={showcaseRef}
        className={`exp-hub__showcase${
          isDragging ? " exp-hub__showcase--dragging" : ""
        }`}
        role="region"
        aria-label={`${activeExperience.company}, ${activeExperience.position}. Swipe for more.`}
        tabIndex={0}
        onPointerDown={onShowcasePointerDown}
        onPointerMove={onShowcasePointerMove}
        onPointerUp={onShowcasePointerUp}
        onPointerCancel={onShowcasePointerCancel}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") paginate(1);
          if (event.key === "ArrowLeft") paginate(-1);
        }}
      >
        <div className="exp-hub__showcase-track">
          <LayoutGroup id="exp-hub-logo-carousel">
            <motion.div className="exp-hub__hero" layout={false} aria-hidden>
              <LogoCarouselTile
                key={prevExperience.id}
                exp={prevExperience}
                slot="left"
                transition={pageTransition}
              />
              <LogoCarouselTile
                key={activeExperience.id}
                exp={activeExperience}
                slot="center"
                transition={pageTransition}
              />
              <LogoCarouselTile
                key={nextExperience.id}
                exp={nextExperience}
                slot="right"
                transition={pageTransition}
              />
            </motion.div>
          </LayoutGroup>

          <article className="exp-hub__card" aria-live="polite">
            <div
              ref={cardViewportRef}
              className="exp-hub__card-scroll"
              style={
                cardPageHeight > 0
                  ? ({
                      "--exp-hub-page-h": `${cardPageHeight}px`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <motion.div
                className="exp-hub__card-track"
                animate={{ y: -index * cardPageHeight }}
                transition={pageTransition}
              >
                {experiences.map((exp) => (
                  <ExperienceCardSection
                    key={exp.id}
                    exp={exp}
                    onKnowMore={setDetailId}
                  />
                ))}
              </motion.div>
            </div>
          </article>
        </div>
      </div>

      <motion.div className="exp-hub__footer" layout={false}>
        <div className="exp-hub__pager" aria-hidden>
          {experiences.map((exp, i) => (
            <span
              key={exp.id}
              className={`exp-hub__dot${i === index ? " exp-hub__dot--active" : ""}`}
            />
          ))}
        </div>
        <p className="exp-hub__swipe-hint">Swipe to change company</p>
      </motion.div>
    </motion.div>
  );
};

export default ExperienceHub;