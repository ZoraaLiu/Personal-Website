import React from "react";
import styles from "./Footer.module.css";

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM6.89 20.45H3.34V9h3.55v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.44C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const NAV_LINKS = [
  { label: "Home",       href: "#home" },
  { label: "About",      href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#project" },
  { label: "Contact",    href: "#contact" },
];

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.grid}>
      {/* Brand */}
      <div className={styles.brand}>
        <p className={styles.brandName}>Zora Liu</p>
        <p className={styles.brandTagline}>
          Software Engineering @ UWaterloo<br />
          Building things that scale &amp; think.
        </p>
      </div>

      {/* Nav */}
      <nav className={styles.nav} aria-label="Footer navigation">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href} className={styles.navLink}>{label}</a>
        ))}
      </nav>

      {/* Socials */}
      <div className={styles.socials}>
        <a
          href="https://github.com/ZoraaLiu"
          target="_blank"
          rel="noreferrer"
          className={styles.socialLink}
          aria-label="GitHub"
        >
          <GitHubIcon /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/zora-liu-82aa7a271/"
          target="_blank"
          rel="noreferrer"
          className={styles.socialLink}
          aria-label="LinkedIn"
        >
          <LinkedInIcon /> LinkedIn
        </a>
      </div>
    </div>

    <div className={styles.bottom}>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Zora Liu · Built with React &amp; Three.js
      </p>
    </div>
  </footer>
);

export default Footer;
