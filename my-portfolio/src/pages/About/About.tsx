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
          I have experience working with full-stack development, machine learning, and ROS, and I enjoy creating efficient, high-performance solutions. 
          </p>
          <p>
          My previous internships have exposed me to a variety of technologies, including Python, TypeScript, C++, React, and Azure.
          </p>
          <p>
          In my free time, I love learning new technologies and solving complex challenges. I also love making new friends and share my stories with them.
          </p>
        </div>

        <div className={styles.aboutImage}>
          <img src={img1} alt="About Me" />
        </div>

      </div>
    </section>
  );
};

export default About;

