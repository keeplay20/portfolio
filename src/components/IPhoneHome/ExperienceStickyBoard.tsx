import React, { useRef, type RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ExperienceSkillGroup, ExperienceStickyNoteTone } from "../../types";
import "./ExperienceStickyBoard.css";

const SECTION_TONES: ExperienceStickyNoteTone[] = ["yellow", "sky", "coral", "mint"];

export type StickyImpactSection = {
  title: string;
  bullets: string[];
};

const PIN_REVEAL_START = 0.86;

function StickyBoardPin({
  scrollYProgress,
  staticPin,
}: {
  scrollYProgress: MotionValue<number>;
  staticPin: boolean;
}) {
  const pinOpacity = useTransform(scrollYProgress, [PIN_REVEAL_START, 1], [0, 1]);
  const pinY = useTransform(scrollYProgress, [PIN_REVEAL_START, 0.96, 1], [-16, 3, 0]);
  const pinScale = useTransform(scrollYProgress, [PIN_REVEAL_START, 0.96, 1], [0.72, 1.1, 1]);
  const needleScaleY = useTransform(scrollYProgress, [0.9, 1], [0.12, 1]);

  if (staticPin) {
    return (
      <span className="exp-sticky-board__pin" aria-hidden="true">
        <span className="exp-sticky-board__pin-head" />
        <span className="exp-sticky-board__pin-needle" />
      </span>
    );
  }

  return (
    <motion.span
      className="exp-sticky-board__pin"
      aria-hidden="true"
      style={{
        opacity: pinOpacity,
        y: pinY,
        scale: pinScale,
      }}
    >
      <span className="exp-sticky-board__pin-head" />
      <motion.span
        className="exp-sticky-board__pin-needle"
        style={{ scaleY: needleScaleY }}
      />
    </motion.span>
  );
}

type StickyBoardCardProps = {
  title: string;
  tone: ExperienceStickyNoteTone;
  index: number;
  children: React.ReactNode;
  reduceMotion: boolean;
  scrollContainerRef?: RefObject<HTMLElement | null>;
};

export function StickyBoardCard({
  title,
  tone,
  index,
  children,
  reduceMotion,
  scrollContainerRef,
}: StickyBoardCardProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    ...(scrollContainerRef
      ? { container: scrollContainerRef as RefObject<HTMLElement> }
      : {}),
    offset: ["start 0.92", "start 0.38"],
  });

  const restRotate = index % 2 === 0 ? -3.25 : 2.75;
  const rotate = useTransform(scrollYProgress, [0, 1], [restRotate, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.72, 0.92, 1]);

  const motionStyle = reduceMotion
    ? undefined
    : {
        rotate: rotate as MotionValue<number>,
        y: y as MotionValue<number>,
        scale: scale as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
      };

  const className = `exp-sticky-board__card exp-sticky-board__card--${tone}`;

  const titleAndBody = (
    <>
      <h3 className="exp-sticky-board__card-title">{title}</h3>
      <div className="exp-sticky-board__card-body">{children}</div>
    </>
  );

  if (reduceMotion) {
    return (
      <article ref={ref} className={className}>
        <StickyBoardPin scrollYProgress={scrollYProgress} staticPin />
        {titleAndBody}
      </article>
    );
  }

  return (
    <motion.article ref={ref} className={className} style={motionStyle}>
      <StickyBoardPin scrollYProgress={scrollYProgress} staticPin={false} />
      {titleAndBody}
    </motion.article>
  );
}

type ExperienceStickyBoardProps = {
  summary: string;
  impact: StickyImpactSection[];
  stack: ExperienceSkillGroup[];
  variant?: "default" | "hub";
  scrollContainerRef?: RefObject<HTMLElement | null>;
};

const ExperienceStickyBoard: React.FC<ExperienceStickyBoardProps> = ({
  summary,
  impact,
  stack,
  variant = "hub",
  scrollContainerRef,
}) => {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      className={`exp-sticky-board exp-sticky-board--${variant}`}
      aria-label="Role detail notes"
    >
      {summary ? (
        <StickyBoardCard
          title="Summary"
          tone="yellow"
          index={0}
          reduceMotion={!!reduceMotion}
          scrollContainerRef={scrollContainerRef}
        >
          <p className="exp-sticky-board__paragraph">{summary}</p>
        </StickyBoardCard>
      ) : null}

      {impact.map((section, index) => (
        <StickyBoardCard
          key={section.title}
          title={section.title}
          tone={SECTION_TONES[(index + 1) % SECTION_TONES.length]}
          index={index + 1}
          reduceMotion={!!reduceMotion}
          scrollContainerRef={scrollContainerRef}
        >
          <ul className="exp-sticky-board__list">
            {section.bullets.map((line) => (
              <li key={line.slice(0, 56)}>{line}</li>
            ))}
          </ul>
        </StickyBoardCard>
      ))}

      {stack.length > 0 ? (
        <StickyBoardCard
          title="Stack"
          tone="mint"
          index={impact.length + 2}
          reduceMotion={!!reduceMotion}
          scrollContainerRef={scrollContainerRef}
        >
          {stack.map((group) => (
            <div key={group.label} className="exp-sticky-board__stack-row">
              <p className="exp-sticky-board__stack-label">{group.label}</p>
              <ul className="exp-sticky-board__chips" aria-label={group.label}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </StickyBoardCard>
      ) : null}
    </section>
  );
};

export default ExperienceStickyBoard;