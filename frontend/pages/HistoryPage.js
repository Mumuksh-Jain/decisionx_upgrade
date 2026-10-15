"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/shared/TopNav";
import Footer from "@/components/shared/Footer";
import styles from "./HistoryPage.module.css";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const sortByRecent = (items) => {
    return [...items].sort((a, b) => {
      const aTime = Number(new Date(a?.timestamp || 0));
      const bTime = Number(new Date(b?.timestamp || 0));
      return bTime - aTime;
    });
  };

  useEffect(() => {
    // Load analyses from localStorage
    const stored = localStorage.getItem("decisionx_analyses");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnalyses(Array.isArray(parsed) ? sortByRecent(parsed) : []);
      } catch (err) {
        console.error("Failed to parse stored analyses:", err);
      }
    }
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRiskColor = (score) => {
    if (score < 33) return "low";
    if (score < 66) return "medium";
    return "high";
  };

  return (
    <div className={styles.page}>
      <TopNav currentPage="History" />
      
      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Analysis History</h1>
          <p className={styles.subtitle}>
            {analyses.length} previous analyses saved
          </p>
        </section>

        {analyses.length === 0 ? (
          <section className={styles.empty}>
            <p className={styles.emptyMessage}>No analyses yet. Start by running diagnostics!</p>
          </section>
        ) : (
          <div className={styles.historyLayout}>
            {/* List */}
            <section className={styles.listSection}>
              <h2 className={styles.sectionTitle}>Analyses</h2>
              <div className={styles.analysisList}>
                {analyses.map((analysis, idx) => (
                  <div
                    key={idx}
                    className={`${styles.analysisItem} ${
                      selectedAnalysis === idx ? styles.active : ""
                    }`}
                    onClick={() => setSelectedAnalysis(idx)}
                  >
                    <div className={styles.itemHeader}>
                      <span className={styles.timestamp}>
                        {formatDate(analysis.timestamp)}
                      </span>
                      <span className={`${styles.riskBadge} ${styles[getRiskColor(analysis.finalRisk)]}`}>
                        {analysis.finalRisk}%
                      </span>
                    </div>
                    <p className={styles.itemPreview}>
                      {analysis.prompt.substring(0, 60)}...
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Detail */}
            {selectedAnalysis !== null && analyses[selectedAnalysis] && (
              <section className={styles.detailSection}>
                <h2 className={styles.sectionTitle}>Report Details</h2>
                
                <div className={styles.detailContent}>
                  {/* Scores */}
                  <div className={styles.scoresGrid}>
                    <div className={styles.scoreCard}>
                      <span className={styles.scoreLabel}>Prompt Risk</span>
                      <span className={styles.scoreValue}>
                        {analyses[selectedAnalysis].promptRisk}%
                      </span>
                    </div>
                    <div className={styles.scoreCard}>
                      <span className={styles.scoreLabel}>Bias Score</span>
                      <span className={styles.scoreValue}>
                        {analyses[selectedAnalysis].biasScore}%
                      </span>
                    </div>
                    <div className={styles.scoreCard}>
                      <span className={styles.scoreLabel}>Hallucination</span>
                      <span className={styles.scoreValue}>
                        {analyses[selectedAnalysis].hallucinationScore}%
                      </span>
                    </div>
                    <div className={styles.scoreCard}>
                      <span className={styles.scoreLabel}>Final Risk</span>
                      <span className={styles.scoreValue}>
                        {analyses[selectedAnalysis].finalRisk}%
                      </span>
                    </div>
                  </div>

                  {/* Original Prompt */}
                  <div className={styles.content}>
                    <h3>Original Prompt</h3>
                    <p>{analyses[selectedAnalysis].prompt}</p>
                  </div>

                  {/* Original Output */}
                  <div className={styles.content}>
                    <h3>AI Output Analyzed</h3>
                    <p>{analyses[selectedAnalysis].output}</p>
                  </div>

                  {/* Hallucinations */}
                  {analyses[selectedAnalysis].hallucinations?.length > 0 && (
                    <div className={styles.content}>
                      <h3>Hallucinations Detected</h3>
                      <div className={styles.hallucinations}>
                        {analyses[selectedAnalysis].hallucinations.map((h, idx) => (
                          <div key={idx} className={`${styles.claim} ${styles[h.status]}`}>
                            <span className={styles.status}>{h.status.toUpperCase()}</span>
                            <p>{h.claim}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Corrected Output */}
                  {analyses[selectedAnalysis].correctedOutput && (
                    <div className={styles.content}>
                      <h3>Corrected Output</h3>
                      <p>{analyses[selectedAnalysis].correctedOutput}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
