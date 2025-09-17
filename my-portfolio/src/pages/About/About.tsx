import React from "react";
import styles from "./About.module.css"; // Import CSS module
import img1 from "../../assets/851679844716_.pic.jpg"

const About: React.FC = () => {
  return (
    <section className={styles.about}>
      <div className={styles.aboutContainer}>
        {/* Text Section */}
        <div className={styles.aboutText}>
          <div className={styles.title}>
            <h1>About Me</h1>
          </div>
          <p>
          Welcome to my portfolio! My name is <strong>Zora</strong>, and I am a third-year software engineering student at <strong>UWaterloo</strong>.
          </p>
          <p>
          I have experience working with fullstack development, machine learning, and robotics, and I enjoy creating efficient, high-performance solutions. 
          </p>
          <p>
          Outside of school and work, I spend time on hobbies that keep me creative and balanced
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>🎵 music</span>
            <span className={styles.badge}>🍳 cooking</span>
            <span className={styles.badge}>🏸 badminton</span>
            <span className={styles.badge}>✈️ traveling</span>
            <span className={styles.badge}>📷 photography</span>
          </div>
        </div>

        <div className={styles.aboutImage}>
          <img src={img1} alt="About Me" />
        </div>

      </div>
    </section>
  );
};

export default About;

