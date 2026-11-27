import React, { useState } from "react";
import { personalInfo } from "../../data/portfolio";
import {
  saveNotifyEmail,
  warrantyVaultTeaser,
} from "../../data/warrantyVaultTeaser";
import "./ComingSoonApp.css";

type ComingSoonAppProps = {
  onClose: () => void;
};

const ComingSoonApp: React.FC<ComingSoonAppProps> = ({ onClose }) => {
  const { comingSoon } = warrantyVaultTeaser;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (saveNotifyEmail(email)) {
      setStatus("success");
      setEmail("");
      return;
    }
    setStatus("error");
  };

  return (
    <div className="iphone-coming-soon">
      <header className="iphone-coming-soon__chrome">
        <button
          type="button"
          className="iphone-coming-soon__back"
          onClick={onClose}
        >
          ← Back
        </button>
        <h1 className="iphone-coming-soon__title">{comingSoon.headline}</h1>
      </header>

      <div className="iphone-coming-soon__scroll">
        <p className="iphone-coming-soon__tagline">{comingSoon.tagline}</p>
        <p className="iphone-coming-soon__desc">{comingSoon.description}</p>

        <section className="iphone-coming-soon__progress" aria-labelledby="build-progress">
          <h2 id="build-progress" className="iphone-coming-soon__section-label">
            Build progress
          </h2>
          <div
            className="iphone-coming-soon__progress-track"
            role="progressbar"
            aria-valuenow={comingSoon.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby="build-progress"
          >
            <span
              className="iphone-coming-soon__progress-fill"
              style={{ width: `${comingSoon.progressPercent}%` }}
            />
          </div>
          <p className="iphone-coming-soon__progress-meta">
            <span>{comingSoon.progressPercent}% built</span>
            <span>
              {comingSoon.etaLabel}: {comingSoon.etaValue}
            </span>
          </p>
        </section>

        <section className="iphone-coming-soon__milestones" aria-label="Build milestones">
          <ul className="iphone-coming-soon__milestone-list">
            {comingSoon.milestones.map((item) => (
              <li
                key={item.id}
                className={`iphone-coming-soon__milestone${
                  item.done ? " iphone-coming-soon__milestone--done" : ""
                }`}
              >
                <span className="iphone-coming-soon__milestone-check" aria-hidden="true">
                  {item.done ? "✓" : "·"}
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="iphone-coming-soon__notify" aria-labelledby="notify-heading">
          <h2 id="notify-heading" className="iphone-coming-soon__notify-title">
            Notify me
          </h2>
          <p className="iphone-coming-soon__notify-detail">
            Leave your email for a ping when TestFlight opens. Stored only on this
            device unless you choose to reach out.
          </p>
          {status === "success" ? (
            <p className="iphone-coming-soon__notify-success" role="status">
              You&apos;re on the list — we&apos;ll email you at launch.
            </p>
          ) : (
            <form className="iphone-coming-soon__form" onSubmit={onSubmit}>
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="iphone-coming-soon__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "notify-error" : undefined}
              />
              <button type="submit" className="iphone-coming-soon__submit">
                Keep me posted
              </button>
            </form>
          )}
          {status === "error" ? (
            <p id="notify-error" className="iphone-coming-soon__notify-error" role="alert">
              Enter a valid email address.
            </p>
          ) : null}
          <p className="iphone-coming-soon__contact">
            Prefer DMs?{" "}
            <a href={`mailto:${personalInfo.email}?subject=Warranty%20Vault%20beta`}>
              Email Mandar
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default ComingSoonApp;