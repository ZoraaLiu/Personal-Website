import React from "react";
import styles from "./Experience.module.css";

const experiences = [
  {
    company: "MovableInk 📨",
    role: "Software Engineer Intern",
    duration: "Apr. 2025 - Aug. 2025",
    description: 
    "Worked on backend && API developemnt",
  },
  {
    company: "OTTO by Rockwell 🤖",
    role: "Software Engineer Intern",
    duration: "Sep. 2024 - Dec. 2024",
    description: 
    "Worked on OS Team, contributed to robot diagnostics aggregator and command-line tools",
  },
  {
    company: "Arcelormittal Tailored Blanks 🛠️",
    role: "Software Engineer Intern",
    duration: "Jan. 2024 – Apr. 2024",
    description: "Deployed YOLOv8 and create data piplines to enabling real-time steel blank detection for quantity monitoring",
  },
  {
    company: "Hanjie Technology Co Ltd ⚙️",
    role: "Software Engineer Intern",
    duration: "May 2023 – Aug. 2023",
    description: "Built a React + TypeScript dashboard for real-time data visualization",
  },
];

const Experience: React.FC = () => {
  return (
    <section className={styles.experience}>
      <div className={styles.timeline}>
        {experiences.map((exp, index) => (
          <div key={index} className={styles.experienceCard}>
            <div className={styles.headerRow}>
              <h2>{exp.company}</h2>
              <span className={styles.duration}>{exp.duration}</span>
            </div>
            <h3>{exp.role}</h3>
            <p className={styles.description}>{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
