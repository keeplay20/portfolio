import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { experiences } from "../../data/portfolio";
import { getExperienceIconImage } from "../../data/iphoneHome";
import { Experience } from "../../types";
import ExperienceDeepDive from "./ExperienceDeepDive";
import ExperienceStickyBoard from "./ExperienceStickyBoard";
import "./ExperienceHub.css";

const SWIPE_OFFSET_PX = 48;

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
  sectionRef,
}: {
  exp: Experience;
  onKnowMore: (id: string) => void;
  sectionRef: (node: HTMLElement | null) => void;
}) {
  const highlight = getCardHighlight(exp);
  const tenureMeta = [exp.duration, exp.location].filter(Boolean).join(" · ");

  return (
    <section
      ref={sectionRef}
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
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
    const section = sectionRefs.current[index];
    const scroller = scrollRef.current;
    if (!section || !scroller) return;
    scroller.scrollTo({
      top: section.offsetTop,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [index, reduceMotion]);

  const onShowcasePointerDown = useCallback((event: React.PointerEvent) => {
    swipeStartXRef.current = event.clientX;
    showcaseRef.current?.setPointerCapture(event.pointerId);
  }, []);

  const onShowcasePointerUp = useCallback(
    (event: React.PointerEvent) => {
      const startX = swipeStartXRef.current;
      swipeStartXRef.current = null;
      if (showcaseRef.current?.hasPointerCapture(event.pointerId)) {
        showcaseRef.current.releasePointerCapture(event.pointerId);
      }
      if (startX === null) return;
      const delta = event.clientX - startX;
      if (delta < -SWIPE_OFFSET_PX) {
        paginate(1);
        return;
      }
      if (delta > SWIPE_OFFSET_PX) {
        paginate(-1);
      }
    },
    [paginate]
  );

  const onShowcasePointerCancel = useCallback((event: React.PointerEvent) => {
    swipeStartXRef.current = null;
    if (showcaseRef.current?.hasPointerCapture(event.pointerId)) {
      showcaseRef.current.releasePointerCapture(event.pointerId);
    }
  }, []);

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
            <ExperienceDeepDive
              experience={detail}
              variant="hub"
              scrollContainerRef={detailScrollRef}
            />
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

  const logoTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 26, mass: 0.95 };

  return (
    <div className="exp-hub">
      <header className="exp-hub__topbar">
        <button type="button" className="exp-hub__nav-btn" onClick={onClose}>
          ← Home
        </button>
        <p className="exp-hub__topbar-title">Experience</p>
        <span className="exp-hub__topbar-slot" aria-hidden />
      </header>

      <div
        ref={showcaseRef}
        className="exp-hub__showcase"
        role="region"
        aria-label={`${activeExperience.company}, ${activeExperience.position}. Swipe for more.`}
        tabIndex={0}
        onPointerDown={onShowcasePointerDown}
        onPointerUp={onShowcasePointerUp}
        onPointerCancel={onShowcasePointerCancel}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") paginate(1);
          if (event.key === "ArrowLeft") paginate(-1);
        }}
      >
        <LayoutGroup id="exp-hub-logo-carousel">
          <motion.div className="exp-hub__hero" layout={false} aria-hidden>
            <LogoCarouselTile
              key={prevExperience.id}
              exp={prevExperience}
              slot="left"
              transition={logoTransition}
            />
            <LogoCarouselTile
              key={activeExperience.id}
              exp={activeExperience}
              slot="center"
              transition={logoTransition}
            />
            <LogoCarouselTile
              key={nextExperience.id}
              exp={nextExperience}
              slot="right"
              transition={logoTransition}
            />
          </motion.div>
        </LayoutGroup>

        <article className="exp-hub__card" aria-live="polite">
          <div ref={scrollRef} className="exp-hub__card-scroll">
            {experiences.map((exp, i) => (
              <ExperienceCardSection
                key={exp.id}
                exp={exp}
                onKnowMore={setDetailId}
                sectionRef={(node) => {
                  sectionRefs.current[i] = node;
                }}
              />
            ))}
          </div>
        </article>
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
    </div>
  );
};

export default ExperienceHub;