import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { personalInfo } from "../../data/portfolio";
import "./Hero.css";

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="hero" className="hero">
      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__container container">
        <div className="hero__grid">
          <motion.div
            className="hero__copy"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="hero__kicker">
              {personalInfo.title} · Bangalore
            </p>
            <h1 className="hero__title">
              {personalInfo.name} builds{" "}
              <span className="hero__title-accent">interfaces in motion</span>
            </h1>
            <p className="hero__summary">{personalInfo.summary}</p>
            <motion.div
              className="hero__actions"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <a href="#featured-work" className="btn btn-primary hero__btn">
                Selected work
              </a>
              <Link to="/work" className="btn btn-ghost hero__btn">
                Archive
              </Link>
            </motion.div>
          </motion.div>

          <motion.aside
            className="hero__aside"
            initial={reduceMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            aria-label="At a glance"
          >
            <div className="hero__stat">
              <span className="hero__stat-label">Now</span>
              <span className="hero__stat-value">SuperHealth · RN from zero</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-label">Before</span>
              <span className="hero__stat-value">Dream11 · millions of users</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-label">Playground</span>
              <Link to="/play" className="hero__stat-link">
                Small games & reflex tests
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default Hero;
