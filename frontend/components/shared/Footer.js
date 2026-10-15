import Link from "next/link";
import { Shield, BookOpen, Terminal, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="nm-card"
      style={{
        maxWidth: "1360px",
        margin: "48px auto 24px auto",
        padding: "32px 24px 20px 24px",
        borderRadius: 14,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 28,
          marginBottom: 28,
        }}
      >
        {/* Column 1: Platform Overview */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: "1.2rem", color: "var(--accent-gold)" }}>⚡</span>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-main)" }}>
              DecisionX Enterprise
            </span>
          </div>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Autonomous epistemic verification, dialectic multi-agent consensus, retrieval-backed claim grounding, and production guardrail patch generation for high-stakes AI pipelines.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <span className="nm-pill nm-pill-gold">NIST AI RMF 1.0</span>
            <span className="nm-pill nm-pill-blue">OWASP LLM09</span>
          </div>
        </div>

        {/* Column 2: Architectural Foundations */}
        <div>
          <h4
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--accent-gold)",
              marginBottom: 12,
            }}
          >
            Scientific Grounding
          </h4>
          <ul style={{ listStyle: "none", fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
            <li>• Dialectic Multi-Agent Debate (Du et al., MIT CSAIL)</li>
            <li>• Natural Language Inference Claim Grounding (NLI)</li>
            <li>• RAG Triad & Faithfulness (TruLens / DeepEval)</li>
            <li>• Bayesian Calibrated Uncertainty Penalty</li>
          </ul>
        </div>

        {/* Column 3: Workspaces */}
        <div>
          <h4
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--accent-gold)",
              marginBottom: 12,
            }}
          >
            Audit Workspaces
          </h4>
          <ul style={{ listStyle: "none", fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 8 }}>
            <li>
              <Link href="/analyzer" style={{ transition: "color 0.15s" }}>
                ⚡ Mission Control Diagnostics
              </Link>
            </li>
            <li>
              <Link href="/benchmarks" style={{ transition: "color 0.15s" }}>
                🧪 Industry Benchmark Lab
              </Link>
            </li>
            <li>
              <Link href="/history" style={{ transition: "color 0.15s" }}>
                📋 Tamper-Evident Audit History
              </Link>
            </li>
            <li>
              <Link href="/about" style={{ transition: "color 0.15s" }}>
                🔬 Mathematical Formulas & Specs
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Verification Engine */}
        <div>
          <h4
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--accent-gold)",
              marginBottom: 12,
            }}
          >
            Engine Telemetry
          </h4>
          <div className="nm-inset" style={{ padding: "12px", borderRadius: 8, fontSize: "0.78rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--text-dim)" }}>Inference:</span>
              <span className="mono" style={{ fontWeight: 600 }}>Groq Llama-3.3-70B</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--text-dim)" }}>Web Retrieval:</span>
              <span className="mono" style={{ fontWeight: 600 }}>Tavily Grounding API</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-dim)" }}>Integrity Hash:</span>
              <span className="mono" style={{ fontWeight: 600, color: "var(--accent-green)" }}>SHA-256 Validated</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          fontSize: "0.78rem",
          color: "var(--text-dim)",
        }}
      >
        <div>
          DecisionX Enterprise v3.2.0 • Senior Architecture & Production AI Safety Specification
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <span>Tactile Neumorphic / Soft-Minimal</span>
          <span>•</span>
          <span>Zero AI-Slop Design</span>
        </div>
      </div>
    </footer>
  );
}
