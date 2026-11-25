import React from "react";
import Header from "../Header/Header";
import WorkArchive from "./WorkArchive";
import Footer from "../Footer/Footer";
import "./ProjectsPage.css";

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <Header />

      <main className="projects-page__content">
        <WorkArchive />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;