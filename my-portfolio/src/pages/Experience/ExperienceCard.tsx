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
    accentColor?: string;
    revealDelay?: number;
}

export default function ExperienceCard(props: ExperienceCardProps) {
    const { id, role, company, description, startDate, endDate, location, tags, accentColor, revealDelay = 0 } = props;

    return (
        <div
            id={id}
            className={styles.experienceCard}
            data-reveal
            style={{
                "--card-accent": accentColor ?? "var(--accent)",
                "--reveal-delay": `${revealDelay}s`,
            } as React.CSSProperties}
        >
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