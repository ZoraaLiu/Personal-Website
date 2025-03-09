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
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.contact}>
      <h1 className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>Get in Touch</h1>
      <p className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>Email: z25liu@uwaterloo.ca</p>
      <p className={`${styles.contactInfo} ${isVisible ? styles.animate : ""}`}>Phone: +1 437-262-6990</p>
    </section>
  );
};

export default Contact;
