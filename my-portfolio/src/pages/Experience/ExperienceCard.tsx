import ExperienceHeader from './ExperienceHeader.tsx'
import styles from './Experience.module.css'

type ExperienceCardProps = {
    id: string;
    role: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    tags: string[];
}

export default function ExperienceCard(props: ExperienceCardProps)  {
    const {id, role, company, description, startDate, endDate, location, tags} = props;

    return (
        <div id={id} className={styles.experienceCard}>
            <ExperienceHeader
                role={role}
                company={company}
                tags={tags}
                startDate={startDate}
                endDate={endDate}
                location={location}
            />
            <div className={styles.description}>
                {description}
            </div>
        </div>
    )
}