"use client";

import { useState } from "react";
import { ArrowRight, AlertTriangle, ShieldX, Flame, Building2, Zap, CheckCircle2 } from "lucide-react";

export default function FailureCascadeDag({
  impact = [],
  primaryIssue = "",
  domain = "general",
}) {
  const [selectedPhase, setSelectedPhase] = useState(0);

  const steps = Array.isArray(impact) && impact.length > 0
    ? impact
    : [
        "Core empirical assumption stays unverified.",
        "Downstream automated agent ingests ungrounded premise.",
        "Operational slippage & regulatory audit trigger.",
        "Terminal liability, compliance violation & financial loss.",
      ];

  const phaseDetails = [
    {
      title: "Inception Anomaly",
      badge: "LATENT FAILURE",
      color: "#f59e0b",
      icon: AlertTriangle,
      desc: "The AI output establishes an unverified assertion or fabricated citation as ground truth.",
      propagationProb: "100%",
    },
    {
      title: "Execution Drift",
      badge: "SYSTEMIC INGESTION",
      color: "#38bdf8",
      icon: Zap,
      desc: "Downstream microservices, automated workflows, or human operators act upon the flawed premise without citation checking.",
      propagationProb: "84%",
    },
    {
      title: "Compliance Trigger",
      badge: "STATUTORY BREACH",
      color: "#a855f7",
      icon: Flame,
      desc: "Internal audit, healthcare contraindication, or SEC/EEOC regulatory guidelines are violated.",
      propagationProb: "68%",
    },
    {
      title: "Terminal Liability",
      badge: "ORGANIZATIONAL IMPACT",
      color: "#ef4444",
      icon: ShieldX,
      desc: "Direct financial damages, malpractice lawsuits, contract cancellation, or brand trust collapse.",
      propagationProb: "52%",
    },
  ];

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--accent-red)", letterSpacing: "0.04em" }}>
            CAUSAL DAG TOPOLOGY & IMPACT GRAPH
          </span>
          <span className="nm-pill nm-pill-red" style={{ fontSize: "0.68rem" }}>
            HIGH BLAST RADIUS
          </span>
        </div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>
          Simulated Failure Cascade & Error Propagation
        </h3>
        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: 2 }}>
          Trace how an epistemic error compounds exponentially from output inception to terminal regulatory liability.
        </p>
      </div>

      {/* DAG Visual Container with Interactive Nodes */}
      <div
        className="nm-card"
        style={{
          padding: "28px 24px",
          borderRadius: 16,
          borderTop: "3px solid var(--accent-red)",
          position: "relative",
        }}
      >
        {/* Dynamic Nodes Row with Visual Inter-Node Wire Indicators */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
            position: "relative",
          }}
        >
          {steps.map((step, idx) => {
            const meta = phaseDetails[idx % phaseDetails.length];
            const Icon = meta.icon;
            const isSelected = selectedPhase === idx;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={idx}
                onClick={() => setSelectedPhase(idx)}
                className={isSelected ? "nm-card" : "nm-inset"}
                style={{
                  padding: "18px 16px",
                  borderRadius: 14,
                  cursor: "pointer",
                  border: isSelected
                    ? `2px solid ${meta.color}`
                    : "1px solid var(--border-subtle)",
                  background: isSelected ? "var(--bg-surface)" : undefined,
                  boxShadow: isSelected ? `0 8px 24px -6px ${meta.color}40` : undefined,
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        color: meta.color,
                        padding: "2px 8px",
                        background: `${meta.color}18`,
                        borderRadius: 6,
                      }}
                    >
                      PHASE 0{idx + 1}
                    </span>
                    <Icon size={16} color={meta.color} />
                  </div>

                  <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 6 }}>
                    {meta.title}
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45, fontWeight: 500 }}>
                    "{step}"
                  </p>
                </div>

                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: 8 }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
                    Compound Risk:
                  </span>
                  <span className="mono" style={{ fontSize: "0.74rem", fontWeight: 800, color: meta.color }}>
                    {meta.propagationProb}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase Deep Dive Inspection Card */}
        {(() => {
          const activeMeta = phaseDetails[selectedPhase % phaseDetails.length];
          const activeStep = steps[selectedPhase] || steps[0];
          const ActiveIcon = activeMeta.icon;

          return (
            <div
              className="nm-inset fade-in-up"
              style={{
                padding: "20px 22px",
                borderRadius: 14,
                borderLeft: `4px solid ${activeMeta.color}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ActiveIcon size={18} color={activeMeta.color} />
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-main)" }}>
                    Phase 0{selectedPhase + 1}: {activeMeta.title} Analysis
                  </span>
                  <span className="nm-pill" style={{ fontSize: "0.7rem", color: activeMeta.color }}>
                    {activeMeta.badge}
                  </span>
                </div>
                <span className="mono" style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>
                  Target Vector: {primaryIssue || "Epistemic Drift"}
                </span>
              </div>

              <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 12 }}>
                {activeMeta.desc}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: "0.78rem" }}>
                <span className="nm-pill">Domain Sensitivity: {domain.toUpperCase()}</span>
                <span className="nm-pill">Recommended Guardrail: Proactive XML Prompt Patching</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
