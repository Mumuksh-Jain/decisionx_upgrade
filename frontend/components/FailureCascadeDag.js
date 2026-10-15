"use client";

import { ArrowRight, AlertTriangle, ShieldX, Flame, Building2 } from "lucide-react";

export default function FailureCascadeDag({
  impact = [],
  primaryIssue = "",
  domain = "general",
}) {
  const steps = Array.isArray(impact) && impact.length > 0
    ? impact
    : [
        "Core empirical assumption stays unverified.",
        "Downstream system executes ungrounded assertion.",
        "Operational slippage & regulatory liability trigger.",
        "Terminal quality drop and compliance violation.",
      ];

  const icons = [AlertTriangle, Flame, ShieldX, Building2];

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
          Causal Failure Cascade & Downstream Impact Timeline
        </h3>
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
          Simulating how unchecked epistemic error propagates across organizational and legal systems.
        </p>
      </div>

      {/* DAG Flow Container */}
      <div
        className="nm-card"
        style={{
          padding: "24px 20px",
          borderRadius: 14,
          borderTop: "3px solid var(--accent-red)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            position: "relative",
          }}
        >
          {steps.map((step, idx) => {
            const Icon = icons[idx % icons.length];
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={idx}
                className="nm-inset"
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  borderLeft: isLast ? "3px solid var(--accent-red)" : "3px solid var(--accent-gold)",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        color: isLast ? "var(--accent-red)" : "var(--accent-gold)",
                        padding: "2px 6px",
                        background: "var(--bg-surface)",
                        borderRadius: 6,
                      }}
                    >
                      PHASE 0{idx + 1}
                    </span>
                    <Icon size={16} color={isLast ? "var(--accent-red)" : "var(--accent-gold)"} />
                  </div>

                  <p
                    style={{
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                      lineHeight: 1.5,
                    }}
                  >
                    {step}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontWeight: 700,
                  }}
                >
                  {idx === 0
                    ? "Inception Point"
                    : idx === 1
                    ? "Execution Drift"
                    : idx === 2
                    ? "Systemic Failure"
                    : "Terminal Impact"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Severity Assessment */}
        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "var(--bg-inset)",
            borderRadius: 10,
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <strong style={{ color: "var(--text-main)" }}>Systemic Risk Boundary: </strong>
            In unchecked production environments, {primaryIssue || "epistemic errors"} in the {domain} domain compound exponentially at each operational handoff.
          </div>
          <span className="nm-pill nm-pill-red" style={{ fontSize: "0.72rem" }}>
            HIGH CASCADING VULNERABILITY
          </span>
        </div>
      </div>
    </div>
  );
}
