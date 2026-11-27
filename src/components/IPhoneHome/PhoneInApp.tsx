import React from "react";
import { Experience } from "../../types";
import { PhoneApp } from "../../data/iphoneHome";
import ExperienceDeepDive from "./ExperienceDeepDive";
import ExperienceHub from "./ExperienceHub";
import OpenSourceHub from "./OpenSourceHub";

export type PhoneInAppLaunch =
  | { mode: "iframe"; src: string }
  | { mode: "game"; gameId: string }
  | { mode: "experience"; experience: Experience }
  | { mode: "experience-hub" }
  | { mode: "open-source-hub" }
  | { mode: "placeholder" };

interface PhoneInAppProps {
  app: PhoneApp;
  launch: PhoneInAppLaunch;
  onBack: () => void;
  games: Record<string, React.FC>;
}

const PhoneInApp: React.FC<PhoneInAppProps> = ({ app, launch, onBack, games }) => {
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
          <iframe title={app.name} className="iphone-inapp__iframe" src={launch.src} />
        ) : null}

        {launch.mode === "game" ? (
          <div className="iphone-inapp__embed iphone-inapp__embed--game">
            {games[launch.gameId] ? (
              React.createElement(games[launch.gameId])
            ) : (
              <p className="iphone-inapp__empty">Game not found.</p>
            )}
          </div>
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