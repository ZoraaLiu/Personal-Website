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
        {/* Left Side - Profile Image */}
        <div className={styles.imageContainer}>
          <img src={profileImg} alt="My Profile" className={styles.profileImage} />
        </div>

        {/* Right Side - Text Content */}
        <div className={styles.content}>
        <h1 className={styles.title}>HI<span>/</span>HI<span>/</span>HI</h1>
        <h1 className={styles.title}>THIS<span>/</span>IS<span>/</span>ZORA</h1>
        <h1 className={styles.title}>THIS<span>/</span>IS<span>/</span>ZORA</h1>
        <h1 className={styles.title}>THIS<span>/</span>IS<span>/</span>ZORA</h1>
        <p className={styles.subtitle}>Check out my introduction and experience below.</p>
        </div>
      </div>
    </section>
  );
};

export default Home;
