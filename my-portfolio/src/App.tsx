import React, { useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Experience from "./pages/Experience/Experience";
import Contact from "./pages/Contacts/Contact";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar scrollToSection={scrollToSection} refs={{ homeRef, aboutRef, experienceRef, contactRef }} />

      <section ref={homeRef}><Home /></section>
      <section ref={aboutRef}><About /></section>
      <section ref={experienceRef}><Experience /></section>
      <section ref={contactRef}><Contact /></section>

      <Footer />
    </div>
  );
};

export default App;
