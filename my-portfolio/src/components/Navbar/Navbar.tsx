import React from "react";
import styles from "./Navbar.module.css"; // Import CSS module
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface NavbarProps {
  scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void; // Allow null
  refs: {
    homeRef: React.RefObject<HTMLElement | null>;
    aboutRef: React.RefObject<HTMLElement | null>;
    projectRef: React.RefObject<HTMLElement | null>;
    experienceRef: React.RefObject<HTMLElement | null>;
    contactRef: React.RefObject<HTMLElement | null>;
  };
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection, refs, theme = "dark", onToggleTheme }) => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.menuItems}>
        <li><button onClick={() => refs.homeRef.current && scrollToSection(refs.homeRef)}>Home</button></li>
        <li><button onClick={() => refs.aboutRef.current && scrollToSection(refs.aboutRef)}>About</button></li>
        <li><button onClick={() => refs.experienceRef.current && scrollToSection(refs.experienceRef)}>Experience</button></li>
        <li><button onClick={() => refs.projectRef.current && scrollToSection(refs.projectRef)}>Project</button></li>
        <li><button onClick={() => refs.contactRef.current && scrollToSection(refs.contactRef)}>Contact</button></li>
      </ul>
      <div className={styles.themeToggleWrap}>
        <button aria-label="Toggle theme" onClick={onToggleTheme} className={styles.themeToggle}>
          <span className={styles.bulb} aria-hidden>
            {theme === 'dark' ? <DarkModeIcon></DarkModeIcon> : <LightModeIcon/>}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
