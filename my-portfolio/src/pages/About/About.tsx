import styles from "./About.module.css";
import img1 from "../../assets/851679844716_.pic.jpg";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const SKILLS = [
  { label: "Fullstack Development", pct: 88 },
  { label: "Systems & Robotics", pct: 75 },
];

const STATS = [
  { value: "4+", label: "Co-ops completed" },
  { value: "10+", label: "Projects shipped" },
];

const About: React.FC = () => {
  return (
    <section className={styles.about}>
      <div className={styles.container}>

        {/* ── Left column ── */}
        <div className={styles.left}>
          <p className={styles.kicker}>SOFTWARE ENGINEER · UWATERLOO</p>

          <h1 className={styles.heading}>
            Building things that{" "}
            <span className={styles.accent}>scale</span>{" "}
            &amp;{" "}
            <span className={styles.cyan}>think</span>
          </h1>

          <p className={styles.bio}>
            I'm <strong>Zora</strong>, a third-year Software Engineering student at the
            University of Waterloo. I thrive at the intersection of robust systems and
            thoughtful product design — writing code that's efficient, readable, and
            actually fun to work with.
          </p>
          <p className={styles.bio}>
            My "lab" is wherever the hard problems are — whether that's real-time robot
            diagnostics, ML pipelines for visual inspection, or building dashboards
            people actually enjoy using.
          </p>

          <div className={styles.skills}>
            {SKILLS.map(({ label, pct }) => (
              <div key={label} className={styles.skillRow}>
                <div className={styles.skillMeta}>
                  <span>{label}</span>
                  <span className={styles.skillPct}>{pct}%</span>
                </div>
                <div className={styles.bar}>
                  <div className={styles.barFill} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <a href="/resume.pdf" target="_blank" className={styles.cta}>Download CV</a>
            <a href="#experience" className={styles.secondaryCta}>View journey</a>
          </div>
        </div>

        {/* ── Right column – photo card ── */}
        <div className={styles.right}>
          {/* floating decorations */}
          <span className={styles.decoTL} aria-hidden>✏️</span>
          <span className={styles.decoR}  aria-hidden>🩷</span>
          <span className={styles.decoBR} aria-hidden>✦</span>

          <div className={styles.photoCard}>
            <img src={img1} alt="Zora Liu" className={styles.photo} />
            <div className={styles.devBadge}>
              <span className={styles.devBadgeIcon}>&gt;_</span>
              CREATIVE_DEV.V1
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom stats row ── */}
      <div className={styles.bottomRow}>
        <div className={styles.philosophyCell}>
          <AutoStoriesIcon fontSize="small" style={{ color: 'var(--accent)' }} />
          <h3>The Philosophy</h3>
          <p>Good software isn't just functional — it should be clear, fast, and leave the next developer smiling.</p>
        </div>
        {STATS.map(({ value, label }) => (
          <div key={label} className={styles.statCell}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label.toUpperCase()}</span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default About;
