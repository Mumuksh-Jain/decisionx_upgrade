"use client";

import styles from "./FailureMap.module.css";

export default function FailureMap({ impact }) {
  if (!impact || impact.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Impact Chain (Failure Map)</h2>
      <div className={styles.chain}>
        {impact.map((step, idx) => (
          <div key={idx} className={styles.step}>
            <div className={styles.stepNumber}>{idx + 1}</div>
            <p className={styles.stepText}>{step}</p>
            {idx < impact.length - 1 && <div className={styles.arrow}>↓</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
