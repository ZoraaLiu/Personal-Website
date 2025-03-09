import React, { useState } from "react";
import styles from "./Navbar.module.css"; // Import the CSS module

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <a className={styles.title} href="/">
        Portfolio
      </a>
      <div className={styles.menu}>
        {/* Mobile Menu Button */}
        <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* Navigation Items */}
        <ul className={`${styles.menuItems} ${menuOpen ? styles.menuOpen : ""}`} onClick={() => setMenuOpen(false)}>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#experience">Experience</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
