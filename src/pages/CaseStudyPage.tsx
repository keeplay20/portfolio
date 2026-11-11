import React, { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { getProjectById } from "../data/portfolio";
import "./CaseStudyPage.css";

const CaseStudyPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Case Study | Mandar Vyas`;
    }
    return () => {
      document.title = "Mandar Vyas — Interfaces in Motion";
    };
  }, [project]);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const study = project.caseStudy;

  return (
    <div className="case-study">
      <Header />
      <article className="case-study__article">
        <header className="case-study__hero container">
          <Link to="/work" className="case-study__back">
            ← Archive
          </Link>
          <motion.p
            className="case-study__tagline"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {project.tagline ?? project.category}
          </motion.p>
          <motion.h1
            className="case-study__title"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.55 }}
          >
            {project.title}
          </motion.h1>
          <motion.p
            className="case-study__lede"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.5 }}
          >
            {project.description}
          </motion.p>

          <div className="case-study__meta">
            <span>{project.duration}</span>
            <span className="case-study__meta-dot" aria-hidden="true" />
            <span>{project.teamSize ? `${project.teamSize} author` : "Solo"}</span>
            <span className="case-study__meta-dot" aria-hidden="true" />
            <span>{project.status}</span>
          </div>

          {(project.previewImage || project.liveDemo) && (
            <div className="case-study__cover">
              {project.previewImage ? (
                <img
                  src={project.previewImage}
                  alt=""
                  className="case-study__cover-img"
                />
              ) : (
                <div className="case-study__cover-placeholder" />
              )}
            </div>
          )}

          <div className="case-study__actions">
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open live site
              </a>
            )}
            {project.githubRepo && (
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Source
              </a>
            )}
          </div>
        </header>

        <div className="case-study__body container">
          {study && (
            <section className="case-study__block">
              <h2 className="case-study__h2">Problem</h2>
              <p className="case-study__prose">{study.problem}</p>
            </section>
          )}

          <section className="case-study__block">
            <h2 className="case-study__h2">Overview</h2>
            {project.longDescription.map((para) => (
              <p key={para.slice(0, 48)} className="case-study__prose">
                {para}
              </p>
            ))}
          </section>

          {study && (
            <>
              <section className="case-study__block">
                <h2 className="case-study__h2">Role</h2>
                <p className="case-study__prose">{study.role}</p>
              </section>

              <section className="case-study__block">
                <h2 className="case-study__h2">Decisions</h2>
                <ul className="case-study__decisions">
                  {study.decisions.map((d) => (
                    <li key={d.title} className="case-study__decision">
                      <h3 className="case-study__h3">{d.title}</h3>
                      <p className="case-study__prose">{d.body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="case-study__block">
                <h2 className="case-study__h2">Outcome</h2>
                <p className="case-study__prose">{study.outcome}</p>
              </section>
            </>
          )}

          <section className="case-study__block">
            <h2 className="case-study__h2">Capabilities</h2>
            <ul className="case-study__features">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          <section className="case-study__block case-study__block--stack">
            <h2 className="case-study__h2">Stack</h2>
            <div className="case-study__tags">
              {project.technologies.map((t) => (
                <span key={t} className="case-study__tag">
                  {t}
                </span>
              ))}
            </div>
          </section>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default CaseStudyPage;
