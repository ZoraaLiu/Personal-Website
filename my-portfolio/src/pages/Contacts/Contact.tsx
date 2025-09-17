// Contact.tsx
import React, { useEffect, useState, useRef } from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } // Trigger earlier for smoother effect
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.contact} id="contact">
      <h1 className={`${styles.heading} ${isVisible ? styles.animate : ""}`}>
        Get in Touch
      </h1>
      <p className={`${styles.subText} ${isVisible ? styles.animate : ""}`}>
        I’d love to connect! Feel free to reach out through any of the channels below:
      </p>
      <div className={styles.infoBox}>
        <p className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>
          📧 <a href="mailto:zoraliu658@gmail.com">zoraliu658@gmail.com</a>
        </p>
        <p className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>
          📧 <a href="mailto:z25liu@uwaterloo.ca">z25liu@uwaterloo.ca</a>
        </p>
        <p className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>
          📱 <a href="tel:+14372626990">+1 (437) 262-6990</a>
        </p>
        <p className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>
          💼 <a href="https://www.linkedin.com/in/zora-liu-180206236/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
        <p className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>
          💻 <a href="https://github.com/zoraaliu" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </div>
    </section>
  );
};

export default Contact;