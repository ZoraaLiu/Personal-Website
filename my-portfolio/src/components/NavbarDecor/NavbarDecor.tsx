import React, { useEffect, useRef } from "react";
import styles from "./NavbarDecor.module.css";

const NavbarDecor: React.FC = () => {
  const starsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;
    // Create a few shooting stars with randomized delays
    const count = 3;
    const stars: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = styles.shootingStar;
      star.style.top = `${12 + Math.random() * 50}px`;
      star.style.animation = `shoot ${2.4 + Math.random() * 1.6}s linear ${Math.random() * 6}s infinite`;
      container.appendChild(star);
      stars.push(star);
    }
    return () => {
      stars.forEach(s => s.remove());
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden>
      <div className={styles.line} />
      <div className={styles.hangers}>
        {[160, 200, 140, 220, 180, 150, 210, 170, 190].map((h, i) => (
          <div key={i} className={styles.hanger} style={{ height: `${h}px`, animationDelay: `${i * 0.18}s` }}>
            <div className={styles.bauble} />
          </div>
        ))}
      </div>
      <div className={styles.stars} ref={starsRef} />
    </div>
  );
};

export default NavbarDecor;


