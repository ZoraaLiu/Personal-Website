import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import styles from './Experience.module.css';
import { type Education } from '../../db/education';

type EducationCardProps = Education & { id: string };

export default function EducationCard({ id, title, school, graduationYear, description }: EducationCardProps) {
    return (
        <div id={id} className={styles.educationCard}>
            <div className={styles.eduCardTop}>
                <span className={styles.iconBox2}>
                    <LibraryBooksIcon fontSize="small" />
                </span>
                <span className={styles.classOf}>CLASS OF {graduationYear}</span>
            </div>
            <h2 className={styles.eduTitle}>{title}</h2>
            <p className={styles.eduSchool}>{school}</p>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
}
