"use client";

import { useState } from "react";
import { Users, ShieldAlert, Sparkles, Scale, CheckCircle2 } from "lucide-react";

export default function MultiAgentDeliberation({
  agents = {},
  verdict = "",
  scoreExplanation = {},
}) {
  const [activeTab, setActiveTab] = useState("all");

  const criticText = agents?.critic || "No critical review generated.";
  const optimistText = agents?.optimist || "No constructive review generated.";
  const realistText = agents?.realist || "No empirical review generated.";

  const agentCards = [
    {
      id: "critic",
      name: "Red-Team Adversarial Critic",
      role: "Failure Modes & Edge-Case Vulnerabilities",
      icon: ShieldAlert,
      badge: "Pessimistic Stress Test",
      color: "var(--accent-red)",
      bgPill: "nm-pill-red",
      content: criticText,
    },
    {
      id: "optimist",
      name: "Constructive Value Optimist",
      role: "Intent Fulfillment & Salvageable Concepts",
      icon: Sparkles,
      badge: "User Objective Alignment",
      color: "var(--accent-green)",
      bgPill: "nm-pill-green",
      content: optimistText,
    },
    {
      id: "realist",
      name: "Pragmatic Empiric Realist",
      role: "Operational Feasibility & Resource Constraints",
      icon: Scale,
      badge: "Probability & Feasibility",
      color: "var(--accent-blue)",
      bgPill: "nm-pill-blue",
      content: realistText,
    },
  ];

  return (
    <div className="fade-in-up">
      {/* Header and Filter Controls */}
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
            Dialectic Multi-Agent Debate (MAD) Deliberation
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
            Mitigating LLM sycophancy via 3 independent adversarial and constructive perspectives.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="nm-inset" style={{ padding: "4px", borderRadius: 10, display: "flex", gap: 4 }}>
          <button
            onClick={() => setActiveTab("all")}
            className={`nm-button ${activeTab === "all" ? "active" : ""}`}
            style={{
              padding: "4px 12px",
              fontSize: "0.76rem",
              borderRadius: 8,
              background: activeTab === "all" ? "var(--bg-surface)" : "transparent",
            }}
          >
            All Perspectives
          </button>
          {agentCards.map((a) => (
            <button
              key={a.id}
              onClick={() => setActiveTab(a.id)}
              className={`nm-button ${activeTab === a.id ? "active" : ""}`}
              style={{
                padding: "4px 12px",
                fontSize: "0.76rem",
                borderRadius: 8,
                background: activeTab === a.id ? "var(--bg-surface)" : "transparent",
              }}
            >
              {a.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Verdict Banner */}
      {verdict && (
        <div
          className="nm-inset"
          style={{
            padding: "16px 20px",
            borderRadius: 12,
            marginBottom: 20,
            borderLeft: "4px solid var(--accent-gold)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", color: "var(--accent-gold)", letterSpacing: "0.04em" }}>
              Arbiter Consensus Verdict
            </span>
          </div>
          <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-main)" }}>
            {verdict}
          </p>
        </div>
      )}

      {/* Agent Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            activeTab === "all"
              ? "repeat(auto-fit, minmax(320px, 1fr))"
              : "1fr",
          gap: 18,
        }}
      >
        {agentCards
          .filter((a) => activeTab === "all" || activeTab === a.id)
          .map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="nm-card"
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  borderTop: `3px solid ${agent.color}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      className={`nm-pill ${agent.bgPill}`}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-main)" }}>
                        {agent.name}
                      </h4>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: 1 }}>
                        {agent.role}
                      </p>
                    </div>
                  </div>
                  <span className={`nm-pill ${agent.bgPill}`} style={{ fontSize: "0.68rem" }}>
                    {agent.badge}
                  </span>
                </div>

                <div
                  className="nm-inset"
                  style={{
                    padding: "16px",
                    borderRadius: 10,
                    fontSize: "0.86rem",
                    lineHeight: 1.6,
                    color: "var(--text-muted)",
                    whiteSpace: "pre-line",
                    flex: 1,
                  }}
                >
                  {agent.content}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
