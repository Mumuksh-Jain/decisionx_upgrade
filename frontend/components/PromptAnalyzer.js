"use client";

import styles from "./PromptAnalyzer.module.css";

export default function PromptAnalyzer({ prompt, onChange, disabled }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>User Prompt</label>
      <textarea
        className={styles.input}
        placeholder="Enter the user's prompt or decision question..."
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
      />
      <p className={styles.hint}>{prompt.length} characters</p>
    </div>
  );
}
