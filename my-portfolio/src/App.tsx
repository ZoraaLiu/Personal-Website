import React, { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Experience";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const aboutRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // **Handle window resizing for responsiveness**
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container">
      <Navbar scrollToSection={scrollToSection} refs={{ aboutRef, projectsRef, contactRef }} />
      <p>Window Width: {windowWidth}px</p> {/* Debugging Resizing */}
      <Home />
      <section ref={aboutRef}><About /></section>
      <section ref={projectsRef}><Projects /></section>
      <section ref={contactRef}><Contact /></section>
      <Footer />
    </div>
  );
};

export default App;
