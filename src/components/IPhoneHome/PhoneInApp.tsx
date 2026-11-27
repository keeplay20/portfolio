import React from "react";
import { Experience } from "../../types";
import { PhoneApp } from "../../data/iphoneHome";
import ExperienceDeepDive from "./ExperienceDeepDive";
import ExperienceHub from "./ExperienceHub";
import OpenSourceHub from "./OpenSourceHub";
import AboutMeApp from "./AboutMeApp";
import SettingsApp from "./SettingsApp";
import ComingSoonApp from "./ComingSoonApp";
import PhoneInAppIframe from "./PhoneInAppIframe";

export type PhoneInAppLaunch =
  | { mode: "iframe"; src: string }
  | { mode: "experience"; experience: Experience }
  | { mode: "experience-hub" }
  | { mode: "open-source-hub" }
  | { mode: "about-me-hub" }
  | { mode: "settings" }
  | { mode: "coming-soon"; teaserId: string }
  | { mode: "placeholder" };

interface PhoneInAppProps {
  app: PhoneApp;
  launch: PhoneInAppLaunch;
  onBack: () => void;
}

const PhoneInApp: React.FC<PhoneInAppProps> = ({ app, launch, onBack }) => {
  if (launch.mode === "experience-hub") {
    return (
      <div className="iphone-inapp iphone-inapp--experience-hub">
        <ExperienceHub onClose={onBack} />
      </div>
    );
  }

  if (launch.mode === "open-source-hub") {
    return (
      <div className="iphone-inapp iphone-inapp--experience-hub">
        <OpenSourceHub onClose={onBack} />
      </div>
    );
  }

  if (launch.mode === "about-me-hub") {
    return (
      <div className="iphone-inapp iphone-inapp--about-me">
        <AboutMeApp onClose={onBack} />
      </div>
    );
  }

  if (launch.mode === "settings") {
    return (
      <div className="iphone-inapp iphone-inapp--settings">
        <SettingsApp onClose={onBack} />
      </div>
    );
  }

  if (launch.mode === "coming-soon") {
    return (
      <div className="iphone-inapp iphone-inapp--coming-soon">
        <ComingSoonApp onClose={onBack} />
      </div>
    );
  }

  return (
    <div className="iphone-inapp">
      <header className="iphone-inapp__chrome">
        <button type="button" className="iphone-inapp__back" onClick={onBack}>
          ← Back
        </button>
        <p className="iphone-inapp__title">{app.name}</p>
      </header>

      <div className="iphone-inapp__content">
        {launch.mode === "iframe" ? (
          <PhoneInAppIframe title={app.name} src={launch.src} />
        ) : null}

        {launch.mode === "experience" ? (
          launch.experience.deepDive ? (
            <ExperienceDeepDive experience={launch.experience} />
          ) : (
            <div className="iphone-inapp__experience">
              <p className="iphone-inapp__role">{launch.experience.position}</p>
              <p className="iphone-inapp__meta">
                {launch.experience.duration}
                {launch.experience.location
                  ? ` · ${launch.experience.location}`
                  : ""}
              </p>
              <ul className="iphone-inapp__list">
                {launch.experience.description.map((line) => (
                  <li key={line.slice(0, 48)}>{line}</li>
                ))}
              </ul>
              <p className="iphone-inapp__tech">
                {launch.experience.technologies.join(" · ")}
              </p>
            </div>
          )
        ) : null}

        {launch.mode === "placeholder" ? (
          <p className="iphone-inapp__empty">Coming soon — no live demo yet.</p>
        ) : null}
      </div>
    </div>
  );
};

export default PhoneInApp;