import Tag from "../../components/tag.tsx"
import styles from './Experience.module.css'

type ExperienceHeaderProps = {
    role: string
    company: string
    startDate:string
    endDate:string
    location:string
    tags:string[]
}

export default function ExperienceHeader({role, company, startDate, endDate, location, tags}: ExperienceHeaderProps) {
    return (
        <div className={styles.experienceHeader}>
            <div className={styles.headerRow}>
                <div className={styles.tagsRow}>
                    {tags.map((tag) => (<Tag key={tag} label={tag} color="#FF86C3"/>))}
                </div>
                <div className={styles.dateMeta}>
                    <span className={styles.duration}>{startDate} – {endDate}</span>
                    <span className={styles.location}>{location}</span>
                </div>
            </div>
            <h2>{role}</h2>
            <div className={styles.secondaryHeaderRow}>{company}</div>
        </div>
    )
}
