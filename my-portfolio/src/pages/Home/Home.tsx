import styles from "./Home.module.css";
import CraneMachine3D from "../../components/CraneMachine3D/CraneMachine3D";

const Home: React.FC = () => {
  return (
    <section className={styles.home}>
      <div className={styles.container}>
        <div className={styles.sceneContainer}>
          <CraneMachine3D />
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>Hello, I'm</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.nameSwap}>
              <span className={styles.nameFront}>Zora Liu</span>
              <span className={styles.nameBack}>Shixiao Liu</span>
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
