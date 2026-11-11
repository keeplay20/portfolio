import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import HomePage from "./pages/HomePage";
import CaseStudyPage from "./pages/CaseStudyPage";
import ProjectsPage from "./components/ProjectsPage/ProjectsPage";
import GameCenter from "./components/GameCenter/GameCenter";
import CustomCursor from "./components/CustomCursor/CustomCursor";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/work/:projectId"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CaseStudyPage />
            </motion.div>
          }
        />
        <Route
          path="/work"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectsPage />
            </motion.div>
          }
        />
        <Route
          path="/play"
          element={
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameCenter />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CustomCursor />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
