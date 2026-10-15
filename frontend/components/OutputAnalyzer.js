"use client";

import styles from "./OutputAnalyzer.module.css";

export default function OutputAnalyzer({ output, onChange, disabled }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>AI Output</label>
      <textarea
        className={styles.input}
        placeholder="Enter the AI-generated output to analyze..."
        value={output}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
      />
      <p className={styles.hint}>{output.length} characters</p>
    </div>
  );
}
