import React from "react";
import WorkArchive from "./WorkArchive";
import "./ProjectsPage.css";

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <main className="projects-page__content">
        <WorkArchive />
      </main>
    </div>
  );
};

export default ProjectsPage;