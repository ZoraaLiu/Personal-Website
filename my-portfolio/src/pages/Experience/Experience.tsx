import React from "react";
import styles from "./Experience.module.css";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import { experiences } from "../../db/experience";
import { education } from "../../db/education";

const DOT_COLORS = ['#f472b6', '#38bdf8', '#a78bfa', '#34d399'];

const allDots = [
  ...experiences.map((exp, i) => ({
    id: `experience-${i}`,
    label: `${exp.company} — ${exp.role}`,
    color: DOT_COLORS[i % DOT_COLORS.length],
  })),
  ...education.map((edu, i) => ({
    id: `education-${i}`,
    label: `${edu.school} — ${edu.title}`,
    color: '#34d399',
  })),
];

export function Experience() {
  return (
    <section className={styles.experience}>
      <div className={styles.pageWrapper}>
        <div className={styles.timelineBar}>
          <div className={styles.timelineLine} />
          {allDots.map((dot, index) => (
            <button
              key={index}
              className={styles.timelineDot}
              style={{ '--dot-color': dot.color } as React.CSSProperties}
              title={dot.label}
              onClick={() => document.getElementById(dot.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            />
          ))}
        </div>
        <div className={styles.pageContent}>
          <ExperienceSection />
          <EducationSection />
        </div>
      </div>
    </section>
  );
}

export default Experience;
