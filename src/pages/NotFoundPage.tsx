import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./NotFoundPage.css";

const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Page not found | Mandar Vyas";
    return () => {
      document.title = "Mandar Vyas — Interfaces in Motion";
    };
  }, []);

  return (
    <div className="not-found">
      <Header />
      <main className="not-found__main container">
        <motion.p
          className="not-found__code"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          404
        </motion.p>
        <motion.h1
          className="not-found__title"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
        >
          This route isn&apos;t in the build
        </motion.h1>
        <motion.p
          className="not-found__lede"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          Nothing lives at{" "}
          <code className="not-found__path">{location.pathname}</code>. Try the
          home screen or the work archive.
        </motion.p>
        <motion.nav
          className="not-found__actions"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          aria-label="Back to site"
        >
          <Link to="/" className="not-found__btn not-found__btn--primary">
            Back to home
          </Link>
          <Link to="/work" className="not-found__btn">
            View work
          </Link>
        </motion.nav>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;