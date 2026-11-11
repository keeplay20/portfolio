import React from "react";
import { personalInfo } from "../../data/portfolio";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__content">
          <p className="footer__copyright">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p className="footer__built">
            Designed & engineered by {personalInfo.name}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
