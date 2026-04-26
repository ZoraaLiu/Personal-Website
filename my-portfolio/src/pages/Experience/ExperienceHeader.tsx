import Tag from "../../components/tag.tsx"
import styles from './Experience.module.css'

const TAG_COLOR_MAP: Record<string, string> = {
    Backend:   "#f472b6",
    Robotics:  "#4ade80",
    AI:        "#a78bfa",
    Fullstack: "#fb923c",
    FrontEnd:  "#38bdf8",
    Frontend:  "#38bdf8",
};
const DEFAULT_TAG_COLOR = "#94a3b8";

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
                    {tags.map((tag) => (
                        <Tag key={tag} label={tag} color={TAG_COLOR_MAP[tag] ?? DEFAULT_TAG_COLOR} />
                    ))}
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
