import React, { type RefObject } from "react";
import { Experience } from "../../types";
import ExperienceStickyBoard from "./ExperienceStickyBoard";
import "./ExperienceDeepDive.css";

type Props = {
  experience: Experience;
  variant?: "default" | "hub";
  scrollContainerRef?: RefObject<HTMLElement | null>;
};

const ExperienceDeepDive: React.FC<Props> = ({
  experience,
  variant = "default",
  scrollContainerRef,
}) => {
  const dive = experience.deepDive;
  if (!dive) return null;

  const isHub = variant === "hub";

  const brandClass =
    !isHub && experience.id === "superhealth"
      ? "exp-dive--superhealth"
      : !isHub && experience.id === "dream11"
        ? "exp-dive--dream11"
        : "";

  const impactSections = dive.themes.map((theme) => ({
    title: theme.title,
    bullets: theme.bullets,
  }));

  const stackGroups = dive.skillGroups ?? [];

  return (
    <article
      className={`exp-dive exp-dive--${variant} ${brandClass}`.trim()}
      aria-labelledby={`exp-dive-title-${experience.id}`}
    >
      {isHub ? (
        <h2 className="exp-dive__sr-title" id={`exp-dive-title-${experience.id}`}>
          {experience.position}, {experience.company}
        </h2>
      ) : (
        <>
          <header className="exp-dive__hero">
            <p className="exp-dive__kicker">Experience · Project line</p>
            <h2 className="exp-dive__company" id={`exp-dive-title-${experience.id}`}>
              {experience.company}
            </h2>
            <p className="exp-dive__product">{dive.productLine}</p>
            <p className="exp-dive__role">{experience.position}</p>
            {[experience.duration, experience.location].filter(Boolean).length > 0 ? (
              <p className="exp-dive__meta">
                {[experience.duration, experience.location].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </header>
          <p className="exp-dive__tagline">{dive.tagline}</p>
        </>
      )}

      {isHub ? (
        <ExperienceStickyBoard
          variant="hub"
          summary={dive.summary}
          impact={impactSections}
          stack={stackGroups}
          scrollContainerRef={scrollContainerRef}
        />
      ) : (
        <>
          <p className="exp-dive__summary">{dive.summary}</p>
          <div className="exp-dive__themes">
            {dive.themes.map((theme) => (
              <section key={theme.title} className="exp-dive__theme-block">
                <h3 className="exp-dive__theme-title">{theme.title}</h3>
                <ul className="exp-dive__list">
                  {theme.bullets.map((line) => (
                    <li key={line.slice(0, 56)}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          {stackGroups.length > 0 ? (
            <footer className="exp-dive__skills">
              <p className="exp-dive__skills-label">Stack & focus</p>
              {stackGroups.map((group) => (
                <div key={group.label} className="exp-dive__skill-row">
                  <span className="exp-dive__skill-key">{group.label}</span>
                  <ul className="exp-dive__chips" aria-label={group.label}>
                    {group.items.map((item) => (
                      <li key={item} className="exp-dive__chip">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </footer>
          ) : null}
        </>
      )}
    </article>
  );
};

export default ExperienceDeepDive;