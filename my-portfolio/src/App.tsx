import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Experience from "./pages/Experience/Experience";
import Contact from "./pages/Contacts/Contact";
import Footer from "./components/Footer";
import WaveDivider from "./components/WaveDivider";

type Theme = "light" | "dark";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = window.localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(prefersLight ? "light" : "dark");
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <div>
      <Navbar scrollToSection={scrollToSection} refs={{ homeRef, aboutRef, experienceRef, contactRef }} theme={theme} onToggleTheme={toggleTheme} />

      <section id="home" ref={homeRef}><Home /></section>
      <WaveDivider />
      <section id="about" ref={aboutRef}><About /></section>
      <WaveDivider flip />
      <section id="experience" ref={experienceRef}><Experience /></section>
      <WaveDivider />
      <section id="contact" ref={contactRef}><Contact /></section>

      <Footer />
    </div>
  );
};

export default App;
