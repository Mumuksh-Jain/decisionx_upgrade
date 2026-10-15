"use client";

import styles from "./ReportPanel.module.css";

function HallucinationItem({ claim, status }) {
  const getStatusClass = (s) => {
    if (s === "verified") return "verified";
    if (s === "false") return "false";
    return "uncertain";
  };

  return (
    <div className={`${styles.hallucinationItem} ${styles[getStatusClass(status)]}`}>
      <span className={styles.status}>{status.toUpperCase()}</span>
      <p className={styles.claim}>{claim}</p>
    </div>
  );
}

export default function ReportPanel({ hallucinations, correctedOutput }) {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}>Hallucinations Detected</h2>
        {hallucinations && hallucinations.length > 0 ? (
          <div className={styles.hallucinations}>
            {hallucinations.map((item, idx) => (
              <HallucinationItem key={idx} claim={item.claim} status={item.status} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No hallucinations detected.</p>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>Corrected Output</h2>
        {correctedOutput ? (
          <div className={styles.correctedOutput}>
            <p>{correctedOutput}</p>
          </div>
        ) : (
          <p className={styles.empty}>No correction available.</p>
        )}
      </div>
    </div>
  );
}
