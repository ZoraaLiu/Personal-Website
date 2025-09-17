import React, { useEffect, useState }from "react";
import styles from "./Home.module.css"; // Import CSS module
import profileImg from "../../assets/profile.jpg"; // Replace with your image

const Home: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <section className={styles.home} style={{ height: `${windowHeight}px` }}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src={profileImg} alt="Zora Liu profile" className={styles.profileImage} />
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>Hello, I’m</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.nameSwap}>
              <span className={styles.nameFront}>Shixiao Liu</span>
              <span className={styles.nameBack}>Zora Liu</span>
            </span>
          </h1>
          <div className={styles.badges}>
            <span className={styles.badge}>Code & Create</span>
            <span className={styles.badge}>Curious Mind</span>
          </div>
          <div className={styles.actions}>
            <a className={styles.cta} href="#experience">View Experience</a>
            <a className={styles.secondaryCta} href="#contact">Get in touch</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
