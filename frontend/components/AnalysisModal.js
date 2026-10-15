"use client";

import { useRef, useState } from "react";
import RiskDashboard from "./RiskDashboard";
import MultiAgentPanel from "./MultiAgentPanel";
import FailureMap from "./FailureMap";
import ReportPanel from "./ReportPanel";
import styles from "./AnalysisModal.module.css";

function parseBulletText(text) {
  if (!text) return [];

  const prepared = String(text)
    // Some model outputs place many bullet markers in one line.
    .replace(/\s[-*•]\s+/g, "\n- ");

  return uniqueNormalized(
    prepared
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
  );
}

function formatScore(value) {
  const num = Number(value);
  return Number.isFinite(num) ? `${Math.round(num)}/100` : "n/a";
}

function normalizeList(value) {
  return Array.isArray(value)
    ? uniqueNormalized(value.map((item) => String(item || "").trim()).filter(Boolean))
    : [];
}

function uniqueNormalized(items) {
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    const text = String(item || "").trim();
    if (!text) return;

    const key = text
      .toLowerCase()
      .replace(/[^\w\s']/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(text);
  });

  return result;
}

function normalizeAlternatives(alternatives) {
  const source = alternatives && typeof alternatives === "object" ? alternatives : {};
  return {
    evidenceBased: normalizeList(source.evidenceBased).slice(0, 5),
    ethical: normalizeList(source.ethical).slice(0, 5),
    neutral: normalizeList(source.neutral).slice(0, 5),
  };
}

function normalizeScoreExplanation(explanation, results) {
  const source = explanation && typeof explanation === "object" ? explanation : {};
  const asLines = (value, fallback) => {
    if (Array.isArray(value) && value.length > 0) return value.map((item) => String(item || "").trim()).filter(Boolean);
    return fallback;
  };

  return {
    promptRisk: asLines(source.promptRisk, [
      `Prompt risk score: ${formatScore(results?.promptRisk)}.`,
      "Calculated from prompt-output review and calibration.",
    ]),
    biasScore: asLines(source.biasScore, [
      `Bias score: ${formatScore(results?.biasScore)}.`,
      "Uses harmful-language checks and calibration rules.",
    ]),
    accuracyScore: asLines(source.accuracyScore, [
      `Accuracy score: ${formatScore(results?.accuracyScore)}.`,
      "Derived from output claim verification outcomes.",
    ]),
    hallucinationScore: asLines(source.hallucinationScore, [
      `Hallucination score: ${formatScore(results?.hallucinationScore)}.`,
      "Derived from output claim statuses: verified, uncertain, and false.",
    ]),
    finalRisk: asLines(source.finalRisk, [
      `Final risk score: ${formatScore(results?.finalRisk)}.`,
      "Computed from weighted components with safety gating.",
    ]),
  };
}

function buildReportContent({ prompt, output, results }) {
  const lines = [];
  const now = new Date();

  lines.push("DecisionX Analysis Report");
  lines.push(`Generated: ${now.toISOString()}`);
  lines.push("");

  if (prompt) {
    lines.push("Prompt:");
    lines.push(String(prompt).trim());
    lines.push("");
  }

  if (output) {
    lines.push("AI Output:");
    lines.push(String(output).trim());
    lines.push("");
  }

  lines.push("Risk Scores:");
  lines.push(`- Prompt Intent: ${String(results?.promptIntent || "neutral")}`);
  lines.push(`- Severity: ${String(results?.severity || "medium")}`);
  lines.push(`- Risk Label: ${String(results?.riskLabel || "safe")}`);
  lines.push(`- Primary Issue: ${String(results?.primaryIssue || "General Risk")}`);
  lines.push(`- Verdict: ${String(results?.verdict || "No verdict available.")}`);
  lines.push(`- Prompt Risk: ${formatScore(results?.promptRisk)}`);
  lines.push(`- Bias Score: ${formatScore(results?.biasScore)}`);
  lines.push(`- Accuracy Score: ${formatScore(results?.accuracyScore)}`);
  lines.push(`- Hallucination Score: ${formatScore(results?.hallucinationScore)}`);
  lines.push(`- Final Risk: ${formatScore(results?.finalRisk)}`);
  lines.push("");

  const critic = parseBulletText(results?.agents?.critic);
  const optimist = parseBulletText(results?.agents?.optimist);
  const realist = parseBulletText(results?.agents?.realist);
  const impact = normalizeList(results?.impact);
  const alternatives = normalizeAlternatives(results?.alternatives);
  const corrected = parseBulletText(results?.correctedOutput);
  const hallucinations = Array.isArray(results?.hallucinations) ? results.hallucinations : [];

  lines.push("Multi-Agent Perspectives:");
  lines.push("- Critic:");
  if (critic.length === 0) {
    lines.push("  - n/a");
  } else {
    critic.forEach((item) => lines.push(`  - ${item}`));
  }

  lines.push("- Optimist:");
  if (optimist.length === 0) {
    lines.push("  - n/a");
  } else {
    optimist.forEach((item) => lines.push(`  - ${item}`));
  }

  lines.push("- Realist:");
  if (realist.length === 0) {
    lines.push("  - n/a");
  } else {
    realist.forEach((item) => lines.push(`  - ${item}`));
  }
  lines.push("");

  lines.push("Hallucination Detection:");
  if (!Array.isArray(hallucinations) || hallucinations.length === 0) {
    lines.push("- No hallucinations detected.");
  } else {
    hallucinations.forEach((item, idx) => {
      const status = String(item?.status || "uncertain").toUpperCase();
      const confidence = Number.isFinite(Number(item?.confidence))
        ? `${Math.round(Number(item.confidence) * 100)}%`
        : "n/a";
      const claim = String(item?.claim || "").trim();
      lines.push(`- ${idx + 1}. [${status}] (${confidence}) ${claim}`);
    });
  }
  lines.push("");

  const explanation = normalizeList(results?.explanation);
  lines.push("Explanation:");
  if (explanation.length === 0) {
    lines.push("- n/a");
  } else {
    explanation.forEach((item, idx) => lines.push(`- ${idx + 1}. ${item}`));
  }
  lines.push("");

  const forecast = normalizeList(results?.forecast);
  lines.push("Forecast:");
  if (forecast.length === 0) {
    lines.push("- n/a");
  } else {
    forecast.forEach((item, idx) => lines.push(`- ${idx + 1}. ${item}`));
  }
  lines.push("");

  lines.push("Impact Chain:");
  if (impact.length === 0) {
    lines.push("- n/a");
  } else {
    impact.forEach((item, idx) => lines.push(`- ${idx + 1}. ${item}`));
  }
  lines.push("");

  lines.push("Corrected Output:");
  if (corrected.length > 0) {
    corrected.forEach((item) => lines.push(`- ${item}`));
  } else {
    lines.push("No correction available.");
  }
  lines.push("");

  lines.push("Alternate Outputs:");
  lines.push("- Evidence-Based:");
  if (alternatives.evidenceBased.length === 0) {
    lines.push("  - n/a");
  } else {
    alternatives.evidenceBased.forEach((item) => lines.push(`  - ${item}`));
  }

  lines.push("- Ethical:");
  if (alternatives.ethical.length === 0) {
    lines.push("  - n/a");
  } else {
    alternatives.ethical.forEach((item) => lines.push(`  - ${item}`));
  }

  lines.push("- Neutral:");
  if (alternatives.neutral.length === 0) {
    lines.push("  - n/a");
  } else {
    alternatives.neutral.forEach((item) => lines.push(`  - ${item}`));
  }

  return `${lines.join("\n")}\n`;
}

function buildReportFileName() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const stamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");

  return `decisionx-analysis-${stamp}.pdf`;
}

async function loadJsPdf() {
  if (typeof window === "undefined") return null;

  try {
    const jsPdfModule = await import("jspdf");
    return jsPdfModule?.jsPDF || null;
  } catch {
    return null;
  }
}

async function loadHtml2Canvas() {
  if (typeof window === "undefined") return null;
  if (window.html2canvas) return window.html2canvas;

  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-html2canvas]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.html2canvas));
      existing.addEventListener("error", () => reject(new Error("html2canvas failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js";
    script.async = true;
    script.setAttribute("data-html2canvas", "true");
    script.onload = () => resolve(window.html2canvas);
    script.onerror = () => reject(new Error("html2canvas failed to load"));
    document.body.appendChild(script);
  });
}

async function saveReportAsPdf(reportText, fileName) {
  const JsPdf = await loadJsPdf();
  if (!JsPdf) return;

  const doc = new JsPdf({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 42;
  const marginY = 46;
  const contentWidth = pageWidth - marginX * 2;
  const lineHeight = 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let y = marginY;
  const lines = String(reportText || "").split("\n");

  lines.forEach((rawLine) => {
    const wrapped = rawLine.trim().length === 0 ? [""] : doc.splitTextToSize(rawLine, contentWidth);

    wrapped.forEach((line) => {
      if (y > pageHeight - marginY) {
        doc.addPage();
        y = marginY;
      }

      doc.text(String(line || ""), marginX, y);
      y += lineHeight;
    });
  });

  doc.save(fileName);
}

export default function AnalysisModal({ results, loading, onClose, prompt, output }) {
  const isRunning = loading || !results;
  const reportCaptureRef = useRef(null);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const correctedBullets = parseBulletText(results?.correctedOutput);
  const alternatives = normalizeAlternatives(results?.alternatives);
  const scoreExplanation = normalizeScoreExplanation(results?.scoreExplanation, results);

  const handleDownloadReport = async () => {
    if (!results) return;

    const fileName = buildReportFileName();
    const reportNode = reportCaptureRef.current;

    if (!reportNode) {
      const textReport = buildReportContent({ prompt, output, results });
      await saveReportAsPdf(textReport, fileName);
      return;
    }

    try {
      const html2canvas = await loadHtml2Canvas();
      if (!html2canvas) throw new Error("html2canvas unavailable");
      const canvas = await html2canvas(reportNode, {
        scale: 2,
        backgroundColor: "#f4eee3",
        useCORS: true,
        windowWidth: reportNode.scrollWidth,
      });

      const JsPdf = await loadJsPdf();
      if (!JsPdf) throw new Error("jsPDF unavailable");

      const pdf = new JsPdf({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const imageHeight = (canvas.height * contentWidth) / canvas.width;
      const imageData = canvas.toDataURL("image/png");

      let heightLeft = imageHeight;
      let positionY = margin;

      pdf.addImage(imageData, "PNG", margin, positionY, contentWidth, imageHeight, undefined, "FAST");
      heightLeft -= contentHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        positionY = margin - (imageHeight - heightLeft);
        pdf.addImage(imageData, "PNG", margin, positionY, contentWidth, imageHeight, undefined, "FAST");
        heightLeft -= contentHeight;
      }

      pdf.save(fileName);
    } catch {
      const textReport = buildReportContent({ prompt, output, results });
      await saveReportAsPdf(textReport, fileName);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{isRunning ? "Live Analysis In Progress" : "Analysis Complete"}</h1>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {isRunning ? (
            <div className={styles.progressSection}>
              <div className={styles.progressTimeline}>
                <div className={`${styles.timelineItem} ${styles.timelineItemActive}`}>
                  <div className={styles.timelineMarker}>1</div>
                  <div className={styles.timelineContent}>
                    <h3 className={styles.agentTitle}>Critic Agent</h3>
                    <p className={styles.agentSubtitle}>Scanning for risks, blindspots, and weak assumptions.</p>
                  </div>
                </div>

                <div className={`${styles.timelineItem} ${styles.timelineItemActive}`}>
                  <div className={styles.timelineMarker}>2</div>
                  <div className={styles.timelineContent}>
                    <h3 className={styles.agentTitle}>Optimist Agent</h3>
                    <p className={styles.agentSubtitle}>Reviewing strengths, opportunities, and workable advantages.</p>
                  </div>
                </div>

                <div className={`${styles.timelineItem} ${styles.timelineItemActive}`}>
                  <div className={styles.timelineMarker}>3</div>
                  <div className={styles.timelineContent}>
                    <h3 className={styles.agentTitle}>Realist Agent</h3>
                    <p className={styles.agentSubtitle}>Evaluating practical feasibility and real-world constraints.</p>
                  </div>
                </div>
              </div>

              <div className={styles.reportCard}>
                <h2 className={styles.reportCardTitle}>Risk Scores (running)</h2>
                <div className={styles.scoreGrid}>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>Prompt Risk</span>
                    <strong className={styles.scoreValue}>--</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>Bias Score</span>
                    <strong className={styles.scoreValue}>--</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>Accuracy</span>
                    <strong className={styles.scoreValue}>--</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>Hallucination</span>
                    <strong className={styles.scoreValue}>--</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span className={styles.scoreLabel}>Final Risk</span>
                    <strong className={styles.scoreValue}>--</strong>
                  </div>
                </div>
              </div>

              <div className={styles.aggregating}>
                <div className={styles.spinner}></div>
                <p>Running diagnostics and synthesizing report...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Final Report */}
              <div ref={reportCaptureRef} className={styles.reportCaptureArea}>
                <div className={styles.reportSection}>
                <div className={styles.reportCard}>
                  <h2 className={styles.reportCardTitle}>Risk Scores</h2>
                  <RiskDashboard
                    promptRisk={results.promptRisk}
                    promptIntent={results.promptIntent}
                    biasScore={results.biasScore}
                    accuracyScore={results.accuracyScore}
                    hallucinationScore={results.hallucinationScore}
                    finalRisk={results.finalRisk}
                    severity={results.severity}
                  />
                  <button
                    type="button"
                    className={styles.explainButton}
                    onClick={() => setShowScoreExplanation((prev) => !prev)}
                  >
                    {showScoreExplanation ? "Hide Explanation" : "View Explanation"}
                  </button>

                  {showScoreExplanation && (
                    <div className={styles.explainPanel}>
                      <h3 className={styles.explainTitle}>Score Basis</h3>
                      <div className={styles.explainGrid}>
                        <div className={styles.explainBlock}>
                          <h4>Prompt Risk</h4>
                          <ul>
                            {scoreExplanation.promptRisk.map((line, idx) => (
                              <li key={`prompt-${idx}`}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.explainBlock}>
                          <h4>Bias Score</h4>
                          <ul>
                            {scoreExplanation.biasScore.map((line, idx) => (
                              <li key={`bias-${idx}`}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.explainBlock}>
                          <h4>Accuracy Score</h4>
                          <ul>
                            {scoreExplanation.accuracyScore.map((line, idx) => (
                              <li key={`accuracy-${idx}`}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.explainBlock}>
                          <h4>Hallucination Score</h4>
                          <ul>
                            {scoreExplanation.hallucinationScore.map((line, idx) => (
                              <li key={`hallucination-${idx}`}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.explainBlock}>
                          <h4>Final Risk</h4>
                          <ul>
                            {scoreExplanation.finalRisk.map((line, idx) => (
                              <li key={`final-${idx}`}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.reportCard}>
                  <h2 className={styles.reportCardTitle}>Verdict</h2>
                  <p className={styles.summaryText}>{String(results.verdict || "No verdict available.")}</p>
                  <p className={styles.summaryText}>
                    Primary issue: <strong>{String(results.primaryIssue || "General Risk")}</strong>
                  </p>
                </div>

                <div className={styles.reportCard}>
                  <h2 className={styles.reportCardTitle}>Multi-Agent Perspectives</h2>
                  <MultiAgentPanel
                    critic={results.agents?.critic}
                    optimist={results.agents?.optimist}
                    realist={results.agents?.realist}
                  />
                </div>

                <div className={styles.reportCard}>
                  <h2 className={styles.reportCardTitle}>Hallucination Detection</h2>
                  {results.hallucinations && results.hallucinations.length > 0 ? (
                    <div className={styles.hallucinations}>
                      {results.hallucinations.map((h, idx) => (
                        <div key={idx} className={`${styles.claim} ${styles[h.status]}`}>
                          <span className={styles.status}>{h.status.toUpperCase()}</span>
                          <p>{h.claim}</p>
                          {Number.isFinite(Number(h?.confidence)) && (
                            <p>Confidence: {Math.round(Number(h.confidence) * 100)}%</p>
                          )}
                          {Array.isArray(h?.evidence) && h.evidence.length > 0 && (
                            <ul className={styles.bulletContent}>
                              {h.evidence.map((ev, evidenceIdx) => (
                                <li key={evidenceIdx}>
                                  {ev.title || "Source"}
                                  {ev.link ? ` (${ev.link})` : ""}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noResults}>No hallucinations detected.</p>
                  )}
                </div>

                {Array.isArray(results.explanation) && results.explanation.length > 0 && (
                  <div className={styles.reportCard}>
                    <h2 className={styles.reportCardTitle}>Explanation</h2>
                    <ul className={styles.bulletContent}>
                      {results.explanation.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.impact && (
                  <div className={styles.reportCard}>
                    <h2 className={styles.reportCardTitle}>Impact Chain</h2>
                    <FailureMap impact={results.impact} />
                  </div>
                )}

                {Array.isArray(results.forecast) && results.forecast.length > 0 && (
                  <div className={styles.reportCard}>
                    <h2 className={styles.reportCardTitle}>Forecast</h2>
                    <ul className={styles.bulletContent}>
                      {results.forecast.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.correctedOutput && (
                  <div className={styles.reportCard}>
                    <h2 className={styles.reportCardTitle}>Corrected Output</h2>
                    <div className={styles.correctedBox}>
                      {correctedBullets.length > 0 ? (
                        <ul className={styles.bulletContent}>
                          {correctedBullets.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{results.correctedOutput}</p>
                      )}
                    </div>
                  </div>
                )}

                {results.correctedOutput && (
                  <div className={styles.reportCard}>
                    <h2 className={styles.reportCardTitle}>Before vs After</h2>
                    <div className={styles.altGrid}>
                      <div className={styles.altBlock}>
                        <h3 className={styles.altTitle}>Original Output</h3>
                        <p>{String(output || "No original output provided.")}</p>
                      </div>
                      <div className={styles.altBlock}>
                        <h3 className={styles.altTitle}>Corrected Output</h3>
                        {correctedBullets.length > 0 ? (
                          <ul className={styles.bulletContent}>
                            {correctedBullets.map((item, idx) => (
                              <li key={`diff-corrected-${idx}`}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{String(results.correctedOutput || "No corrected output available.")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {(alternatives.evidenceBased.length > 0 ||
                  alternatives.ethical.length > 0 ||
                  alternatives.neutral.length > 0) && (
                  <div className={styles.reportCard}>
                    <h2 className={styles.reportCardTitle}>Alternate Outputs</h2>
                    <div className={styles.altGrid}>
                      <div className={styles.altBlock}>
                        <h3 className={styles.altTitle}>Evidence-Based</h3>
                        <ul className={styles.bulletContent}>
                          {alternatives.evidenceBased.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.altBlock}>
                        <h3 className={styles.altTitle}>Ethical</h3>
                        <ul className={styles.bulletContent}>
                          {alternatives.ethical.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.altBlock}>
                        <h3 className={styles.altTitle}>Neutral</h3>
                        <ul className={styles.bulletContent}>
                          {alternatives.neutral.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {results.summary && (
                  <div className={styles.reportCard}>
                    <h2 className={styles.reportCardTitle}>Summary</h2>
                    <ReportPanel summary={results.summary} />
                  </div>
                )}
                </div>
              </div>

              <div className={styles.reportFooter}>
                <button className={styles.downloadButton} onClick={handleDownloadReport}>
                  Download Report
                </button>
                <button className={styles.doneButton} onClick={onClose}>
                  View Analyzer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
