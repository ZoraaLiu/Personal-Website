import styles from "./Project.module.css";
import { projects } from "../../db/project";
import { useMemo, useState } from "react";

export default function Project() {
  const [orderedProjects, setOrderedProjects] = useState(projects);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredProjects = useMemo(() => {
    const finAdvisor = projects.find(
      (project) => project.title === "FinAdvisor Serverless"
    );
    const fallback = projects[0];
    const second = projects.find(
      (project) => project.title !== finAdvisor?.title
    ) ?? fallback;

    return [finAdvisor ?? fallback, second];
  }, []);

  const featuredProject = featuredProjects[featuredIndex];
  const insightTags = ["Pastel Precision", "Micro-Feedback", "Human-Centered"];

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    setOrderedProjects((currentProjects) => {
      const nextProjects = [...currentProjects];
      const [moved] = nextProjects.splice(draggedIndex, 1);
      nextProjects.splice(targetIndex, 0, moved);
      return nextProjects;
    });

    setDraggedIndex(null);
  };

  const goToNextFeatured = () => {
    setFeaturedIndex((current) => (current + 1) % featuredProjects.length);
  };

  return (
    <section className={styles.project} id="projects">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.kicker}>Selected Works</p>
          <h2>Projects</h2>
          <p className={styles.dragHint}>Tip: drag cards to reorder.</p>
        </header>

        <div className={styles.gridShell}>
          {orderedProjects.map((project, index) => (
            <article
              key={project.title}
              className={`${styles.card} ${
                draggedIndex === index ? styles.cardDragging : ""
              }`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.cardGlyph} aria-hidden="true">
                  +
                </span>
              </div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={styles.tags}>
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={`${project.title}-${tag}`} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {project.githubUrl && (
                <a
                  className={styles.link}
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
              )}
            </article>
          ))}
        </div>

        {featuredProject && (
          <section className={styles.insight}>
            <div className={styles.insightVisual} aria-hidden="true">
              <div className={styles.ring} />
            </div>
            <div className={styles.insightContent}>
              <div className={styles.insightHeader}>
                <p className={styles.insightKicker}>Featured Insight</p>
                <button
                  type="button"
                  className={styles.nextButton}
                  onClick={goToNextFeatured}
                  aria-label="Go to next featured project"
                >
                  &gt;
                </button>
              </div>
              <h3>{featuredProject.title}</h3>
              <p>{featuredProject.description}</p>
              <div className={styles.insightList}>
                {insightTags.map((label) => (
                  <div className={styles.insightItem} key={label}>
                    <span className={styles.insightDot} aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
