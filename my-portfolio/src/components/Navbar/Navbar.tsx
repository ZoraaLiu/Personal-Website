import React from "react";
import styles from "./Navbar.module.css";

interface NavbarProps {
  scrollToSection: (ref: React.RefObject<HTMLElement>) => void;
  refs: {
    homeRef: React.RefObject<HTMLElement | null>;
    aboutRef: React.RefObject<HTMLElement | null>;
    experienceRef: React.RefObject<HTMLElement | null>;
    projectsRef: React.RefObject<HTMLElement | null>;
    contactRef: React.RefObject<HTMLElement | null>;
  };
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection, refs }) => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.menuItems}>
        <li><button onClick={() => scrollToSection(refs.homeRef)}>Home</button></li>
        <li><button onClick={() => scrollToSection(refs.aboutRef)}>About</button></li>
        <li><button onClick={() => scrollToSection(refs.experienceRef)}>Experience</button></li>
        <li><button onClick={() => scrollToSection(refs.projectsRef)}>Projects</button></li>
        <li><button onClick={() => scrollToSection(refs.contactRef)}>Contact</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
