import styles from "./Experience.module.css";
import { experiences, type Experience } from "../../db/experience";
import ExperienceCard from "./ExperienceCard";
import TerminalIcon from '@mui/icons-material/Terminal';

export default function ExperienceSection() {
  return (
    <div className={styles.contentSection}>
      <div className={styles.sectionTitle}>
        <span className={styles.iconBox1}>
          <TerminalIcon fontSize="small" />
        </span>
        CORE EXPERIENCES
      </div>
      <div className={styles.timelineCards}>
        {experiences.map((exp: Experience, index: number) => (
          <ExperienceCard
            key={index}
            id={`experience-${index}`}
            role={exp.role}
            company={exp.company}
            description={exp.description}
            startDate={exp.startDate}
            endDate={exp.endDate}
            location={exp.location}
            tags={exp.tags}
          />
        ))}
      </div>
    </div>
  );
}
