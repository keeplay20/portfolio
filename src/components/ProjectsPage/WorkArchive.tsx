import React, { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "../../data/portfolio";
import { Project } from "../../types";
import "./WorkArchive.css";

const ROTATE_MS_WEB = 5500;
const ROTATE_MS_MOBILE = 5500;

function projectPreviewSrc(project: Project): string | null {
  if (project.previewImage) return project.previewImage;
  if (project.demoVideo?.startsWith("/")) {
    return `${process.env.PUBLIC_URL ?? ""}${project.demoVideo}`;
  }
  return null;
}

function WorkProjectCard({ project }: { project: Project }) {
  const preview = projectPreviewSrc(project);

  return (
    <article className="work-card">
      <div className="work-card__media">
        {preview ? (
          <img src={preview} alt="" className="work-card__image" loading="lazy" />
        ) : (
          <div className="work-card__placeholder" aria-hidden="true">
            <span>{project.category === "Mobile App" ? "📱" : "🌐"}</span>
          </div>
        )}
        <span
          className={`work-card__status work-card__status--${project.status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {project.status}
        </span>
      </div>

      <div className="work-card__body">
        <p className="work-card__category">{project.category}</p>
        <h3 className="work-card__title">{project.title}</h3>
        <p className="work-card__desc">{project.description}</p>

        <p className="work-card__tech">
          {project.technologies.slice(0, 4).join(" · ")}
          {project.technologies.length > 4 ? " …" : ""}
        </p>

        <div className="work-card__actions">
          {project.liveDemo ? (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="work-card__cta"
            >
              Live site ↗
            </a>
          ) : (
            <span className="work-card__soon">Coming soon</span>
          )}
        </div>
      </div>
    </article>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function SingleCardCarousel({
  items,
  ariaLabel,
  rotateMs,
}: {
  items: Project[];
  ariaLabel: string;
  rotateMs: number;
}) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const elapsedRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
    setProgress(0);
    elapsedRef.current = 0;
    lastFrameRef.current = null;
  }, [items]);

  useEffect(() => {
    if (items.length <= 1 || reducedMotion) {
      setProgress(0);
      return;
    }

    let frame = 0;

    const run = (now: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }

      if (!paused) {
        const delta = now - lastFrameRef.current;
        elapsedRef.current += delta;

        if (elapsedRef.current >= rotateMs) {
          elapsedRef.current = 0;
          setProgress(0);
          setIndex((i) => (i + 1) % items.length);
        } else {
          setProgress(elapsedRef.current / rotateMs);
        }
      }

      lastFrameRef.current = now;
      frame = requestAnimationFrame(run);
    };

    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [items.length, paused, reducedMotion, rotateMs]);

  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
    lastFrameRef.current = null;
  }, [index]);

  const project = items[index] ?? items[0];
  if (!project) return null;

  const progressPct = Math.round(progress * 100);

  return (
    <div
      className="work-carousel work-carousel--single"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="work-carousel__stage" aria-live="polite">
        <WorkProjectCard key={project.id} project={project} />
      </div>

      {items.length > 1 ? (
        <div className="work-carousel__footer">
          <p className="work-carousel__meta">
            <span className="work-carousel__counter">
              {index + 1} / {items.length}
            </span>
            {!reducedMotion ? (
              <span className="work-carousel__hint">
                {paused ? "Paused" : "Next soon"}
              </span>
            ) : null}
          </p>
          {!reducedMotion ? (
            <div
              className="work-carousel__progress"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Time until next project"
            >
              <div
                className="work-carousel__progress-fill"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const WorkArchive: React.FC = () => {
  const { web, mobile } = useMemo(() => {
    return {
      web: projects.filter((p) => p.category === "Web App"),
      mobile: projects.filter((p) => p.category === "Mobile App"),
    };
  }, []);

  const columns = [
    { title: "Web Apps", items: web, rotateMs: ROTATE_MS_WEB },
    { title: "Mobile Apps", items: mobile, rotateMs: ROTATE_MS_MOBILE },
  ].filter((col) => col.items.length > 0);

  return (
    <div className="work-archive">
      <div className="work-archive__columns">
        {columns.map((col) => (
          <section key={col.title} className="work-archive__column">
            <div className="work-archive__section-head">
              <h2 className="work-archive__section-title">{col.title}</h2>
              <span className="work-archive__section-count">
                {col.items.length} project
                {col.items.length === 1 ? "" : "s"}
              </span>
            </div>
            <SingleCardCarousel
              items={col.items}
              ariaLabel={`${col.title} projects`}
              rotateMs={col.rotateMs}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default WorkArchive;