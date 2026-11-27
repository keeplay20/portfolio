import React, { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import {
  OPEN_SOURCE_INTRO,
  openSourceContributions,
} from "../../data/openSourceContributions";
import { StickyBoardCard } from "./ExperienceStickyBoard";
import "./ExperienceHub.css";
import "./ExperienceStickyBoard.css";
import "./OpenSourceHub.css";

const CONTRIBUTION_TONES = ["sky", "coral", "mint", "yellow"] as const;

type OpenSourceHubProps = {
  onClose: () => void;
};

const OpenSourceHub: React.FC<OpenSourceHubProps> = ({ onClose }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="exp-hub exp-hub--detail oss-hub">
      <header className="exp-hub__topbar">
        <button
          type="button"
          className="exp-hub__nav-btn"
          onClick={onClose}
        >
          ← Back
        </button>
        <p className="exp-hub__topbar-title">Open Source Contribution</p>
        <button
          type="button"
          className="exp-hub__nav-btn exp-hub__nav-btn--ghost"
          onClick={onClose}
        >
          Close
        </button>
      </header>

      <div ref={scrollRef} className="exp-hub__detail-scroll">
        <section
          className="exp-sticky-board exp-sticky-board--hub oss-hub__board"
          aria-label="Open source contributions"
        >
          <StickyBoardCard
            title="Summary"
            tone="yellow"
            index={0}
            reduceMotion={!!reduceMotion}
            scrollContainerRef={scrollRef}
          >
            <p className="exp-sticky-board__paragraph">{OPEN_SOURCE_INTRO}</p>
          </StickyBoardCard>

          {openSourceContributions.map((item, index) => (
            <StickyBoardCard
              key={item.id}
              title={item.project}
              tone={CONTRIBUTION_TONES[index % CONTRIBUTION_TONES.length]}
              index={index + 1}
              reduceMotion={!!reduceMotion}
              scrollContainerRef={scrollRef}
            >
              {item.mergedLabel ? (
                <p className="oss-hub__meta">{item.mergedLabel}</p>
              ) : null}
              <p className="exp-sticky-board__paragraph oss-hub__pr-title">
                {item.title}
              </p>
              <p className="exp-sticky-board__paragraph">{item.summary}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="oss-hub__link"
              >
                {item.url.replace(/^https:\/\//, "")}
              </a>
            </StickyBoardCard>
          ))}
        </section>
      </div>
    </div>
  );
};

export default OpenSourceHub;