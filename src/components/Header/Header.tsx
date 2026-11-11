import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Header.css";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (onHome) {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const menuItems = [
    { id: "featured-work", label: "Work" },
    { id: "experience", label: "Journey" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`header ${isScrolled ? "header--scrolled" : ""}`}
    >
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="Home">
          <span className="header__logo-text">mv.</span>
        </Link>

        <nav className="header__nav" aria-label="Primary">
          <div className="header__nav-pill">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="header__nav-link"
                onClick={() => goToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/work"
              className={`header__nav-link header__nav-link--route ${
                location.pathname === "/work" ? "header__nav-link--active" : ""
              }`}
            >
              Archive
            </Link>
            <Link
              to="/play"
              className={`header__nav-link header__nav-link--route ${
                location.pathname === "/play" ? "header__nav-link--active" : ""
              }`}
            >
              Play
            </Link>
          </div>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className={`header__mobile-toggle ${
              isMobileMenuOpen ? "header__mobile-toggle--active" : ""
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <motion.div
        className={`header__mobile-menu ${
          isMobileMenuOpen ? "header__mobile-menu--open" : ""
        }`}
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <nav className="header__mobile-nav" aria-label="Mobile">
          <ul className="header__mobile-nav-list">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.id}
                className="header__mobile-nav-item"
                initial={{ opacity: 0, x: -16 }}
                animate={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  x: isMobileMenuOpen ? 0 : -16,
                }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  type="button"
                  className="header__mobile-nav-link"
                  onClick={() => goToSection(item.id)}
                >
                  {item.label}
                </button>
              </motion.li>
            ))}
            <li className="header__mobile-nav-item">
              <Link
                to="/work"
                className="header__mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Archive
              </Link>
            </li>
            <li className="header__mobile-nav-item">
              <Link
                to="/play"
                className="header__mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Play
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default Header;
