"use client";

import { useState } from "react";
import { Copy, Check, FileCheck, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

export default function DiffRemediationStudio({
  originalOutput = "",
  correctedOutput = "",
  alternatives = {},
  primaryIssue = "",
}) {
  const [copied, setCopied] = useState(false);
  const [activeAlt, setActiveAlt] = useState("corrected");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDisplayedOutput = () => {
    if (activeAlt === "corrected") return correctedOutput || originalOutput;
    if (activeAlt === "evidenceBased" && Array.isArray(alternatives?.evidenceBased) && alternatives.evidenceBased[0]) {
      return alternatives.evidenceBased[0];
    }
    if (activeAlt === "ethical" && Array.isArray(alternatives?.ethical) && alternatives.ethical[0]) {
      return alternatives.ethical[0];
    }
    if (activeAlt === "neutral" && Array.isArray(alternatives?.neutral) && alternatives.neutral[0]) {
      return alternatives.neutral[0];
    }
    return correctedOutput || originalOutput;
  };

  const currentDisplay = getDisplayedOutput();

  return (
    <div className="fade-in-up">
      {/* Studio Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
            Clause-Level Diff & Production Remediation Studio
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
            Side-by-side inspection of epistemic vulnerabilities vs. verified guardrailed output.
          </p>
        </div>

        {/* Alternate Tones Selector */}
        <div className="nm-inset" style={{ padding: "4px", borderRadius: 10, display: "flex", gap: 4 }}>
          <button
            onClick={() => setActiveAlt("corrected")}
            className={`nm-button ${activeAlt === "corrected" ? "active" : ""}`}
            style={{
              padding: "4px 10px",
              fontSize: "0.76rem",
              borderRadius: 8,
              background: activeAlt === "corrected" ? "var(--bg-surface)" : "transparent",
            }}
          >
            Recommended Guardrail
          </button>
          {Array.isArray(alternatives?.evidenceBased) && alternatives.evidenceBased.length > 0 && (
            <button
              onClick={() => setActiveAlt("evidenceBased")}
              className={`nm-button ${activeAlt === "evidenceBased" ? "active" : ""}`}
              style={{
                padding: "4px 10px",
                fontSize: "0.76rem",
                borderRadius: 8,
                background: activeAlt === "evidenceBased" ? "var(--bg-surface)" : "transparent",
              }}
            >
              Evidence-Strict
            </button>
          )}
          {Array.isArray(alternatives?.ethical) && alternatives.ethical.length > 0 && (
            <button
              onClick={() => setActiveAlt("ethical")}
              className={`nm-button ${activeAlt === "ethical" ? "active" : ""}`}
              style={{
                padding: "4px 10px",
                fontSize: "0.76rem",
                borderRadius: 8,
                background: activeAlt === "ethical" ? "var(--bg-surface)" : "transparent",
              }}
            >
              Ethical Gated
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Diff Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Left: Original Candidate Output */}
        <div
          className="nm-card"
          style={{
            padding: "20px",
            borderRadius: 14,
            borderTop: "3px solid var(--accent-red)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="nm-pill nm-pill-red" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                ORIGINAL DRAFT
              </span>
              <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-main)" }}>
                Unverified Output
              </span>
            </div>
            {primaryIssue && (
              <span style={{ fontSize: "0.72rem", color: "var(--accent-red)", fontWeight: 600 }}>
                Flaw: {primaryIssue}
              </span>
            )}
          </div>

          <div
            className="nm-inset"
            style={{
              padding: "16px",
              borderRadius: 10,
              fontSize: "0.88rem",
              lineHeight: 1.6,
              color: "var(--text-muted)",
              whiteSpace: "pre-wrap",
              flex: 1,
              maxHeight: 440,
              overflowY: "auto",
            }}
          >
            {originalOutput}
          </div>
        </div>

        {/* Right: Guardrailed Production Output */}
        <div
          className="nm-card"
          style={{
            padding: "20px",
            borderRadius: 14,
            borderTop: "3px solid var(--accent-green)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="nm-pill nm-pill-green" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                GUARDRAILED DRAFT
              </span>
              <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-main)" }}>
                Sanitized & Grounded
              </span>
            </div>

            <button
              onClick={() => handleCopy(currentDisplay)}
              className="nm-button nm-button-primary"
              style={{
                padding: "4px 10px",
                fontSize: "0.74rem",
                gap: 6,
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy Draft"}</span>
            </button>
          </div>

          <div
            className="nm-inset"
            style={{
              padding: "16px",
              borderRadius: 10,
              fontSize: "0.88rem",
              lineHeight: 1.6,
              color: "var(--text-main)",
              whiteSpace: "pre-wrap",
              flex: 1,
              maxHeight: 440,
              overflowY: "auto",
              background: "var(--accent-green-bg)",
              border: "1px solid rgba(4, 120, 87, 0.2)",
            }}
          >
            {currentDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}
