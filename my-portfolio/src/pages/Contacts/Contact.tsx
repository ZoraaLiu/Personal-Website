import React, { useState } from "react";
import styles from "./Contact.module.css";
import ScienceIcon from '@mui/icons-material/Science';
import EmailIcon from '@mui/icons-material/Email';
import BoltIcon from '@mui/icons-material/Bolt';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const TOPICS = [
  "Career Opportunity",
  "Project Ideas",
  "Open Source Collaboration",
  "Just saying hi 👋",
];

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.container}>

        {/* ── Left column ── */}
        <div className={styles.left}>
          <p className={styles.kicker}>GET IN TOUCH</p>
          <h1 className={styles.heading}>
            Let's <span className={styles.accent}>chat.</span>
          </h1>
          <p className={styles.subText}>
            Have a project in mind or just want to talk? My inbox is always open.
          </p>

          <div className={styles.labCard}>
            <div className={styles.labCardDots}>
              <span /><span /><span />
            </div>
            <div className={styles.labCardBody}>
              <div className={styles.labIconWrap}>
                <ScienceIcon style={{ fontSize: '2rem', color: 'var(--accent)' }} />
              </div>
              <p className={styles.labCardTitle}>Experimental Phase</p>
              <p className={styles.labCardSub}>ALWAYS ITERATING ON IDEAS</p>
            </div>
          </div>

          <div className={styles.emailRow}>
            <EmailIcon fontSize="small" style={{ color: 'var(--secondary)' }} />
            <div>
              <span className={styles.emailLabel}>EMAIL</span>
              <a className={styles.emailLink} href="mailto:zoraliu658@gmail.com">
                zoraliu658@gmail.com
              </a>
            </div>
            <PhoneIphoneIcon fontSize="small" style={{ color: 'var(--accent)' }} />
            <div>
              <span className={styles.emailLabel}>Phone</span>
              <div className={styles.emailLink} style={{ color: 'var(--accent)' }}>
                +1 437 262 6990
              </div>
            </div>
          </div>
          <div className={styles.emailRow}>
            <LinkedInIcon fontSize="small" style={{ color: 'var(--secondary)' }} />
            <div> 
              <span className={styles.emailLabel}>Linkedin</span>
              <a className={styles.emailLink} href="https://www.linkedin.com/in/zora-liu-180206236/" style={{ color: 'var(--secondary)' }}>
                @Zora Liu
              </a>
            </div>
            <GitHubIcon fontSize="small" style={{ color: 'var(--accent)' }} />
            <div>
              <span className={styles.emailLabel}>Github</span>
              <a className={styles.emailLink} href="https://github.com/zoraaliu" style={{ color: 'var(--accent)' }}>
                @ZoraaLiu
              </a>
            </div>
          </div>
        </div>

        {/* ── Right column – form ── */}
        <div className={styles.right}>
          {submitted ? (
            <div className={styles.successMsg}>
              <BoltIcon style={{ color: 'var(--accent)', fontSize: '2.5rem' }} />
              <h2>Message transmitted!</h2>
              <p>I'll get back to you soon.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>WHAT'S YOUR NAME?</label>
                  <input className={styles.input} type="text" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>EMAIL ADDRESS</label>
                  <input className={styles.input} type="email" required />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>WHAT DO YOU WANT TO SHARE?</label>
                <select className={styles.select}>
                  {TOPICS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>MESSAGE DETAILS</label>
                <textarea
                  className={styles.textarea}
                  rows={5}
                  placeholder="Tell me about your vision, the scope, and the challenges..."
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Transmit Data <BoltIcon fontSize="small" />
              </button>

              <div className={styles.formFooter}>
                <span>ENCRYPTION ACTIVE</span>
                <span>REF: LAB-{new Date().getFullYear()}</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export default Contact;
