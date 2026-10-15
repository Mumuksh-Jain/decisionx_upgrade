"use client";

import { useState, useEffect } from "react";
import styles from "./RiskDashboard.module.css";

function ScoreCard({ label, value, max = 100, index, metricType = "risk" }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const percentage = Math.max(0, Math.min(100, (safeValue / max) * 100));
  const getScoreColor = (score) => {
    if (score < 33) return "low";
    if (score < 66) return "medium";
    return "high";
  };
  const colorClass =
    metricType === "quality"
      ? getScoreColor(100 - safeValue)
      : getScoreColor(safeValue);
  return (
    <div className={`${styles.scoreCard} ${animated ? styles.animate : ""}`}>
      <div className={styles.label}>{label}</div>
      <div className={`${styles.circle} ${styles[colorClass]}`}>
        <span className={styles.score}>{animated ? safeValue : "-"}</span>
      </div>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: animated ? `${percentage}%` : "0%", transition: "width 0.6s ease-out" }}></div>
      </div>
    </div>
  );
}
export default function RiskDashboard({
  promptRisk,
  promptIntent,
  biasScore,
  accuracyScore,
  hallucinationScore,
  finalRisk,
  severity,
}) {
  const score = Number(finalRisk || 0);
  const riskLabel = score >= 75 ? "dangerous" : score >= 35 ? "risky" : "safe";
  const riskLabelText =
    riskLabel === "dangerous" ? "🔴 Dangerous" : riskLabel === "risky" ? "🟡 Risky" : "🟢 Safe";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Risk Analysis</h2>
      <div className={styles.metaRow}>
        <span>Prompt Intent: {String(promptIntent || "neutral")}</span>
        <span>Severity: {String(severity || "medium")}</span>
        <span className={`${styles.riskBadge} ${styles[riskLabel]}`}>{riskLabelText}</span>
      </div>
      <div className={styles.grid}>
        <ScoreCard label="Prompt Risk" value={promptRisk} index={0} />
        <ScoreCard label="Bias Score" value={biasScore} index={1} />
        <ScoreCard label="Accuracy Score" value={accuracyScore ?? 0} index={2} metricType="quality" />
        <ScoreCard label="Hallucination Score" value={hallucinationScore} index={3} />
        <ScoreCard label="Final Risk" value={finalRisk} index={4} />
      </div>
    </div>
  );
}
