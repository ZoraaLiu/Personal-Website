import React from "react";
import styles from "./Experience.module.css";

const experiences = [
  {
    company: "OTTO by Rockwell",
    role: "Software Engineer Intern",
    duration: "Sep. 2024 - Dec. 2024",
    description: 
    "Worked on OS Team, contribute to robot diagnostics aggregator and command-line tools",
  },
  {
    company: "Arcelormittal Tailored Blanks",
    role: "SOFTWARE ENGINEERING",
    duration: "Jan. 2024 – Apr. 2024",
    description: "Deployed YOLOv8 and create datapiplines to enabling real-time steel blank detection for quantity monitoring",
  },
  {
    company: "Hanjie Technology Co Ltd",
    role: "SOFTWARE DEVELOPER",
    duration: "May 2023 – Aug. 2023",
    description: "Built a React + TypeScript industrial ball detection dashboard with WebSockets for real-time visualization",
  },
];

const Experience: React.FC = () => {
  return (
    <section className={styles.experience}>
      <div className={styles.timeline}>
        {experiences.map((exp, index) => (
          <div key={index} className={styles.experienceCard}>
            <h2>{exp.company}</h2>
            <h3>{exp.role}</h3>
            <p className={styles.duration}>{exp.duration}</p>
            <p className={styles.description}>{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
