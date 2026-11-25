import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Header.css";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const onGame = location.pathname.startsWith("/games/");
  const showBackHome = onGame;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`header ${isScrolled ? "header--scrolled" : ""}`}
    >
      <div className="header__container">
        {showBackHome ? (
          <Link to="/" className="header__back-home">
            ← Back to home
          </Link>
        ) : (
          <Link to="/" className="header__logo" aria-label="Home">
            <span className="header__logo-text">mv.</span>
          </Link>
        )}
      </div>
    </motion.header>
  );
};

export default Header;