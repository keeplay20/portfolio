import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Header/Header";
import Projects from "../Projects/Projects";
import Footer from "../Footer/Footer";
import "./ProjectsPage.css";

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <Header />
      <motion.header
        className="projects-page__header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="projects-page__header-container container">
          <div>
            <p className="projects-page__eyebrow">Archive</p>
            <h1 className="projects-page__title">Projects</h1>
            <p className="projects-page__intro">
              Interaction labs first—then mobile apps and earlier web experiments.
            </p>
          </div>
          <Link to="/" className="btn btn-ghost projects-page__back-btn">
            ← Home
          </Link>
        </div>
      </motion.header>

      <main className="projects-page__content">
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
