import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { projects, featuredProjectIds } from "../../data/portfolio";
import "./FeaturedWork.css";

const featured = featuredProjectIds
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const FeaturedWork: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="featured-work" className="featured-work section" aria-labelledby="featured-work-title">
      <div className="featured-work__container container">
        <motion.header
          className="featured-work__header"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="featured-work__index">01 — Selected interfaces</p>
          <h2 id="featured-work-title" className="featured-work__title">
            Labs where motion and state are the product
          </h2>
          <p className="featured-work__lede">
            Two shipped playgrounds—open them live, then browse mobile and web work in the archive.
          </p>
        </motion.header>

        <div className="featured-work__grid">
          {featured.map((project, index) => (
            <FeaturedCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <motion.div
          className="featured-work__archive"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link to="/work" className="featured-work__archive-link">
            Full project archive
            <span aria-hidden="true">↗</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

type CardProject = (typeof featured)[number];

function FeaturedCard({ project, index }: { project: CardProject; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`featured-card featured-card--${index % 2 === 0 ? "a" : "b"}`}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={project.liveDemo}
        target="_blank"
        rel="noopener noreferrer"
        className="featured-card__visual"
        aria-label={`Open ${project.title} live demo`}
      >
        {project.previewImage ? (
          <img
            src={project.previewImage}
            alt=""
            className="featured-card__image"
            loading={index === 0 ? "eager" : "lazy"}
          />
        ) : (
          <div className="featured-card__placeholder" />
        )}
        <span className="featured-card__live">Live</span>
      </a>

      <div className="featured-card__body">
        <p className="featured-card__tagline">{project.tagline}</p>
        <h3 className="featured-card__name">{project.title}</h3>
        <p className="featured-card__desc">{project.description}</p>
        <ul className="featured-card__highlights">
          {project.highlights.slice(0, 2).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="featured-card__actions">
          <Link
            to={`/work/${project.id}`}
            className="btn btn-primary featured-card__cta"
          >
            Case study
          </Link>
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost featured-card__cta"
            >
              Live site
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default FeaturedWork;
