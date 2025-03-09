import React from "react";
import styles from "./Navbar.module.css"; // Import CSS module

interface NavbarProps {
  scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void; // Allow null
  refs: {
    homeRef: React.RefObject<HTMLElement | null>;
    aboutRef: React.RefObject<HTMLElement | null>;
    experienceRef: React.RefObject<HTMLElement | null>;
    contactRef: React.RefObject<HTMLElement | null>;
  };
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection, refs }) => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.menuItems}>
        <li><button onClick={() => refs.homeRef.current && scrollToSection(refs.homeRef)}>Home</button></li>
        <li><button onClick={() => refs.aboutRef.current && scrollToSection(refs.aboutRef)}>About</button></li>
        <li><button onClick={() => refs.experienceRef.current && scrollToSection(refs.experienceRef)}>Experience</button></li>
        <li><button onClick={() => refs.contactRef.current && scrollToSection(refs.contactRef)}>Contact</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
