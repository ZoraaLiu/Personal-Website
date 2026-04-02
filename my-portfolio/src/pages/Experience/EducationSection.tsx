import styles from "./Experience.module.css";
import { education, type Education } from "../../db/education";
import EducationCard from "./EducationCard";
import SchoolIcon from '@mui/icons-material/School';

export default function EducationSection() {
  return (
    <div className={styles.contentSection}>
      <div className={styles.sectionTitle}>
        <span className={styles.iconBox2}>
          <SchoolIcon fontSize="small" />
        </span>
        EDUCATION
      </div>
      <div className={styles.educationGrid}>
        {education.map((edu: Education, index: number) => (
          <EducationCard
            key={index}
            id={`education-${index}`}
            title={edu.title}
            school={edu.school}
            graduationYear={edu.graduationYear}
            description={edu.description}
          />
        ))}
      </div>
    </div>
  );
}
