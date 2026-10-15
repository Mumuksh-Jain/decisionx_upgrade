"use client";

import { useState, useEffect, useRef } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Search,
  Users,
  ShieldCheck,
  FileDiff,
  Terminal,
  Cpu
} from "lucide-react";

const STAGES = [
  {
    id: "domain",
    name: "Domain Taxonomy Classification",
    subtitle: "NIST Risk Taxonomy & Domain Floor Enforcement",
    icon: Cpu,
    durationMs: 1400,
    logs: [
      "Parsing lexical tokens & semantic intent vector...",
      "Matching regulatory domain heuristics (Healthcare, Legal, Finance, Cyber)...",
      "Assigning domain-specific baseline risk floor constraint.",
    ],
  },
  {
    id: "decomposition",
    name: "Propositional Claim Decomposition",
    subtitle: "Natural Language Inference Proposition Isolation",
    icon: Terminal,
    durationMs: 1800,
    logs: [
      "Extracting atomic factual propositions from candidate output...",
      "Separating empirical assertions from subjective stylistic phrasing...",
      "Generating structured claim set for multi-source validation.",
    ],
  },
  {
    id: "retrieval",
    name: "Tavily Web Knowledge Grounding",
    subtitle: "Real-Time Empirical Retrieval & Citation Resolution",
    icon: Search,
    durationMs: 2400,
    logs: [
      "Connecting to Tavily Grounding API endpoint...",
      "Executing web search queries across authoritative academic/regulatory sources...",
      "Parsing evidence snippets, citation URLs, and relevancy confidence scores.",
    ],
  },
  {
    id: "debate",
    name: "Multi-Agent Dialectic Cross-Audit",
    subtitle: "Red-Team Critic, Optimist, Realist & Safety Arbiter",
    icon: Users,
    durationMs: 2800,
    logs: [
      "Deploying Red-Team Adversarial Critic (Llama-3.3-70B)...",
      "Deploying Value Optimist & Pragmatic Realist evaluators...",
      "Synthesizing dialectic debate consensus & resolving epistemic divergence.",
    ],
  },
  {
    id: "scoring",
    name: "Calibrated Risk Vector Synthesis",
    subtitle: "NIST AI RMF 1.0 & OWASP LLM09 Scoring Equations",
    icon: ShieldCheck,
    durationMs: 1600,
    logs: [
      "Calculating accuracy & confidence-weighted hallucination scores...",
      "Evaluating protected-group harmful generalization indicators...",
      "Executing Bayesian uncertainty penalty & hard safety gating overrides.",
    ],
  },
  {
    id: "remediation",
    name: "Clause Diff & Prompt Patch Compilation",
    subtitle: "Turnkey Production Guardrails & Cryptographic Certificate",
    icon: FileDiff,
    durationMs: 1400,
    logs: [
      "Constructing side-by-side clause-level replacement diff...",
      "Generating executable meta-prompt guardrail for system instructions...",
      "Hashing audit payload (SHA-256) & assembling audit report certificate.",
    ],
  },
];

export default function LiveTelemetryConsole({
  isLoading,
  onComplete,
  error,
}) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stageLogs, setStageLogs] = useState([]);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  // Stopwatch timer
  useEffect(() => {
    if (!isLoading && completedStages.length === STAGES.length) return;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 45);

    return () => clearInterval(timerRef.current);
  }, [isLoading, completedStages.length]);

  // Stage progression
  useEffect(() => {
    if (!isLoading) {
      // If loading is done, mark all complete
      setCompletedStages(STAGES.map((s) => s.id));
      setCurrentStageIdx(STAGES.length - 1);
      return;
    }

    let accumulatedTime = 0;
    const timeouts = [];

    STAGES.forEach((stage, idx) => {
      accumulatedTime += stage.durationMs;

      // Stage activation
      const startTimeout = setTimeout(() => {
        setCurrentStageIdx(idx);
        setStageLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ▶ ${stage.name}: ${stage.logs[0]}`,
        ]);
      }, accumulatedTime - stage.durationMs);

      // Stage intermediate logs
      const midTimeout = setTimeout(() => {
        if (stage.logs[1]) {
          setStageLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}]   └─ ${stage.logs[1]}`,
          ]);
        }
      }, accumulatedTime - stage.durationMs / 2);

      // Stage completion
      const finishTimeout = setTimeout(() => {
        setCompletedStages((prev) => [...new Set([...prev, stage.id])]);
        if (stage.logs[2]) {
          setStageLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ✔ Completed ${stage.name}`,
          ]);
        }
      }, accumulatedTime);

      timeouts.push(startTimeout, midTimeout, finishTimeout);
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [isLoading]);

  const totalProgress = Math.min(
    100,
    Math.round(((completedStages.length + (isLoading ? 0.5 : 0)) / STAGES.length) * 100)
  );

  return (
    <div
      className="nm-card fade-in-up"
      style={{
        padding: "28px 24px",
        borderRadius: 16,
        marginBottom: 32,
      }}
    >
      {/* Console Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            className="nm-inset"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)",
              fontSize: "1.3rem",
            }}
          >
            <Activity className="telemetry-pulse" size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "var(--text-main)",
                }}
              >
                Diagnostic Mission Control Telemetry
              </h2>
              <span className="nm-pill nm-pill-gold">
                {isLoading ? "LIVE INGESTION & AUDIT" : "AUDIT COMPLETED"}
              </span>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: 2 }}>
              Executing 6-stage autonomous epistemic verification and multi-agent dialectic consensus.
            </p>
          </div>
        </div>

        {/* Stopwatch & Telemetry Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="nm-inset"
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.85rem",
            }}
          >
            <Clock size={15} color="var(--accent-gold)" />
            <span style={{ color: "var(--text-dim)" }}>Elapsed:</span>
            <span className="mono" style={{ fontWeight: 700, color: "var(--text-main)" }}>
              {(elapsedMs / 1000).toFixed(2)}s
            </span>
          </div>

          <div
            className="nm-inset"
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.85rem",
            }}
          >
            <span style={{ color: "var(--text-dim)" }}>Pipeline Progress:</span>
            <span className="mono" style={{ fontWeight: 800, color: "var(--accent-green)" }}>
              {totalProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Tactile Progress Bar */}
      <div
        className="nm-inset"
        style={{
          height: 10,
          borderRadius: 9999,
          padding: 2,
          marginBottom: 28,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 9999,
            width: `${totalProgress}%`,
            background:
              totalProgress === 100
                ? "var(--accent-green)"
                : "linear-gradient(90deg, var(--accent-gold), #0284c7)",
            transition: "width 0.4s ease",
            boxShadow: "0 0 10px rgba(180, 83, 9, 0.4)",
          }}
        />
      </div>

      {/* 6 Stage Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {STAGES.map((stage, idx) => {
          const isDone = completedStages.includes(stage.id);
          const isCurrent = currentStageIdx === idx && isLoading && !isDone;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={isCurrent ? "nm-card" : isDone ? "nm-card-sm" : "nm-inset"}
              style={{
                padding: "16px",
                borderRadius: 12,
                transition: "all 0.25s ease",
                border: isCurrent
                  ? "1px solid var(--accent-gold)"
                  : isDone
                  ? "1px solid var(--border-subtle)"
                  : "1px solid transparent",
                background: isCurrent ? "var(--bg-surface)" : undefined,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    className={isDone ? "nm-pill nm-pill-green" : isCurrent ? "nm-pill nm-pill-gold" : "nm-inset"}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "var(--text-main)",
                      }}
                    >
                      {stage.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", marginTop: 2 }}>
                      {stage.subtitle}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div>
                  {isDone ? (
                    <span className="nm-pill nm-pill-green" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                      <CheckCircle2 size={11} /> VERIFIED
                    </span>
                  ) : isCurrent ? (
                    <span className="nm-pill nm-pill-gold telemetry-pulse" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                      PROCESSING
                    </span>
                  ) : (
                    <span className="nm-pill" style={{ fontSize: "0.7rem", padding: "2px 8px", color: "var(--text-dim)" }}>
                      QUEUED
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Streaming Execution Terminal */}
      <div
        className="nm-inset-deep"
        style={{
          borderRadius: 12,
          padding: "16px 18px",
          backgroundColor: "var(--bg-inset)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Terminal size={14} color="var(--accent-gold)" />
            <span
              className="mono"
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text-main)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Live Telemetry Console Log
            </span>
          </div>
          <span className="mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
            STREAMING PROTOCOL: ACTIVE
          </span>
        </div>

        <div
          className="mono"
          style={{
            maxHeight: 140,
            overflowY: "auto",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {stageLogs.length === 0 ? (
            <div>[INIT] Initializing DecisionX inference telemetry stream...</div>
          ) : (
            stageLogs.map((log, i) => (
              <div
                key={i}
                style={{
                  color: log.includes("✔")
                    ? "var(--accent-green)"
                    : log.includes("▶")
                    ? "var(--accent-gold)"
                    : "var(--text-muted)",
                }}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Error Banner if API fails */}
      {error && (
        <div
          className="nm-card"
          style={{
            marginTop: 20,
            padding: 16,
            background: "var(--accent-red-bg)",
            borderColor: "rgba(185, 28, 28, 0.3)",
            color: "var(--accent-red)",
            borderRadius: 10,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Telemetry Execution Notice</div>
          <div style={{ fontSize: "0.82rem", marginTop: 4 }}>{error}</div>
        </div>
      )}
    </div>
  );
}
