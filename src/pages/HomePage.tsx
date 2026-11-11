import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import FeaturedWork from "../components/FeaturedWork/FeaturedWork";
import StoryJourney from "../components/StoryJourney/StoryJourney";
import Skills from "../components/Skills/Skills";
import Footer from "../components/Footer/Footer";

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedWork />
        <StoryJourney />
        <Skills />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
