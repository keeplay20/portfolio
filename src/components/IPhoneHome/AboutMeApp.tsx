import React, { useCallback, useRef, useState } from "react";
import { personalInfo } from "../../data/portfolio";
import {
  ABOUT_ME_PROFILE_IMAGE,
  ABOUT_ME_RESUME_PDF,
  ABOUT_ME_RESUME_DOWNLOAD_NAME,
  aboutMeEducation,
  aboutMeShortBio,
  aboutMeSkills,
  aboutMeTechStack,
} from "../../data/aboutMe";
import "./AboutMeApp.css";

type AboutMeAppProps = {
  onClose: () => void;
};

/** Scroll distance (px) after which the nav bar turns solid and shows its title. */
const COLLAPSE_AT = 220;

const AboutMeApp: React.FC<AboutMeAppProps> = ({ onClose }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const initials = personalInfo.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const top = event.currentTarget.scrollTop;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      rootRef.current?.style.setProperty("--about-scroll", String(Math.max(0, top)));
      setCollapsed(top > COLLAPSE_AT);
    });
  }, []);

  return (
    <div
      ref={rootRef}
      className={`about-me${collapsed ? " about-me--collapsed" : ""}`}
    >
      <header className="about-me__chrome">
        <button type="button" className="about-me__back" onClick={onClose}>
          <svg
            className="about-me__back-icon"
            width="9"
            height="15"
            viewBox="0 0 9 15"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.5 1.5 1.5 7.5l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <h1 className="about-me__title">About me</h1>
      </header>

      <div className="about-me__scroll" onScroll={handleScroll}>
        <section className="about-me__hero" aria-label="Profile">
          <div className="about-me__cover">
            {!portraitFailed ? (
              <img
                className="about-me__cover-img"
                src={ABOUT_ME_PROFILE_IMAGE}
                alt=""
                loading="eager"
                decoding="async"
                onError={() => setPortraitFailed(true)}
              />
            ) : (
              <CoverFallback initials={initials} />
            )}
            <div className="about-me__cover-shade" aria-hidden="true" />
            <p className="about-me__name">
              <span className="iphone-brand-gradient-text">{personalInfo.name}</span>
            </p>
          </div>

          <a
            className="about-me__resume"
            href={ABOUT_ME_RESUME_PDF}
            download={ABOUT_ME_RESUME_DOWNLOAD_NAME}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 2v8m0 0L4.75 6.75M8 10l3.25-3.25M2.5 13.5h11"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download Resume
          </a>
        </section>

        <div className="about-me__body">
          <section className="about-me__group" aria-labelledby="about-bio-heading">
            
            <div className="about-me__panel about-me__panel--bio">
              <p className="about-me__bio">{aboutMeShortBio}</p>
            </div>
          </section>

          <section className="about-me__group" aria-labelledby="about-skills-heading">
            <h2 id="about-skills-heading" className="about-me__group-label">
              Skills
            </h2>
            <div className="about-me__panel">
              <ul className="about-me__tags" aria-label="Skills">
                {aboutMeSkills.map((skill) => (
                  <li key={skill} className="about-me__tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="about-me__group" aria-labelledby="about-stack-heading">
            <h2 id="about-stack-heading" className="about-me__group-label">
              Tech stack
            </h2>
            <div className="about-me__panel">
              <ul
                className="about-me__tags about-me__tags--mono"
                aria-label="Tech stack"
              >
                {aboutMeTechStack.map((tech) => (
                  <li key={tech} className="about-me__tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="about-me__group" aria-labelledby="about-edu-heading">
            <h2 id="about-edu-heading" className="about-me__group-label">
              Education
            </h2>
            <ol className="about-me__timeline">
              {aboutMeEducation.map((item) => (
                <li key={item.id} className="about-me__edu">
                  <p className="about-me__edu-years">{item.years}</p>
                  <p className="about-me__edu-degree">{item.degree}</p>
                  <p className="about-me__edu-school">{item.school}</p>
                  {item.detail ? (
                    <p className="about-me__edu-detail">{item.detail}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

function CoverFallback({ initials }: { initials: string }) {
  return (
    <span
      className="about-me__cover-img about-me__cover-img--fallback"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export default AboutMeApp;