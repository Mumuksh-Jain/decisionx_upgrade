"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import {
  Activity,
  ShieldCheck,
  Search,
  Users,
  Terminal,
  FileCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu
} from "lucide-react";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="enterprise-container" style={{ flex: 1, paddingBottom: 40 }}>
        {/* Hero Section */}
        <section style={{ textAlign: "center", padding: "40px 16px 48px 16px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span className="nm-pill nm-pill-gold">
              DECISIONX ENTERPRISE v3.2
            </span>
            <span className="nm-pill nm-pill-blue">
              PRODUCTION AI GOVERNANCE
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-main)",
              maxWidth: 960,
              margin: "0 auto 18px auto",
              lineHeight: 1.15,
            }}
          >
            Autonomous Epistemic Diagnostics & Guardrails for High-Stakes AI
          </h1>

          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              maxWidth: 720,
              margin: "0 auto 32px auto",
              lineHeight: 1.6,
            }}
          >
            Detect hallucinations, prevent covert disparate impact, and enforce NIST/OWASP safety boundaries using dialectic multi-agent consensus, retrieval-backed proposition grounding, and executable system prompt patches.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/analyzer"
              className="nm-button nm-button-primary"
              style={{
                fontSize: "0.95rem",
                padding: "12px 28px",
                borderRadius: 12,
                gap: 8,
              }}
            >
              <Activity size={18} />
              <span style={{ fontWeight: 800 }}>Launch Mission Control</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/benchmarks"
              className="nm-button"
              style={{
                fontSize: "0.95rem",
                padding: "12px 24px",
                borderRadius: 12,
              }}
            >
              <Terminal size={18} />
              <span>Explore Benchmark Lab</span>
            </Link>
          </div>
        </section>

        {/* Live Interactive Product Teaser Card */}
        <section style={{ marginBottom: 48 }}>
          <div
            className="nm-card fade-in-up"
            style={{
              padding: "28px",
              borderRadius: 20,
              borderTop: "4px solid var(--accent-gold)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 14,
                borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="mono" style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--accent-gold)" }}>
                  TELEMETRY HUD PREVIEW
                </span>
                <span className="nm-pill nm-pill-green" style={{ fontSize: "0.7rem" }}>
                  LIVE ARBITER ENGINE
                </span>
              </div>
              <div className="mono" style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                MODEL: GROQ LLAMA-3.3-70B • GROUNDING: TAVILY API
              </div>
            </div>

            {/* 4 Quick Stat Wells */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div className="nm-inset" style={{ padding: "16px", borderRadius: 12 }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)" }}>CALIBRATED RISK FLOOR</div>
                <div className="mono" style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--accent-red)", marginTop: 4 }}>
                  78 <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>/100</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>High-stakes clinical hazard detected</div>
              </div>

              <div className="nm-inset" style={{ padding: "16px", borderRadius: 12 }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)" }}>FACTUAL GROUNDING</div>
                <div className="mono" style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--accent-gold)", marginTop: 4 }}>
                  40%
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>2 of 5 claims verified via web citations</div>
              </div>

              <div className="nm-inset" style={{ padding: "16px", borderRadius: 12 }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)" }}>DIALECTIC CONSENSUS</div>
                <div className="mono" style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--accent-blue)", marginTop: 4 }}>
                  3 / 3
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>Critic, Optimist & Realist converged</div>
              </div>

              <div className="nm-inset" style={{ padding: "16px", borderRadius: 12 }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)" }}>PROMPT PATCH STATUS</div>
                <div className="mono" style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--accent-green)", marginTop: 4 }}>
                  READY
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>XML meta-prompt patch compiled</div>
              </div>
            </div>

            {/* Quick Live Demo Prompt Banner */}
            <div
              className="nm-inset"
              style={{
                padding: "16px 20px",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", color: "var(--accent-gold)" }}>
                  Sample High-Stakes Evaluation:
                </span>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)", marginTop: 2 }}>
                  Pediatric Dual NSAID Stacking & Hallucinated 2024 Lancet Clinical Trial
                </p>
              </div>

              <Link
                href="/analyzer"
                className="nm-button nm-button-primary"
                style={{ padding: "8px 16px", fontSize: "0.8rem", gap: 6 }}
              >
                <span>Run This Diagnostic Live</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Enterprise Pillars Grid */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-main)" }}>
              Engineered for Enterprise LLM Trust & Alignment
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: 4 }}>
              Moving beyond fragile single-pass LLM self-evaluation to mathematical, multi-source verification.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 20,
            }}
          >
            {/* Pillar 1 */}
            <div className="nm-card" style={{ padding: "24px", borderRadius: 16 }}>
              <div
                className="nm-pill nm-pill-gold"
                style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, marginBottom: 14 }}
              >
                <Users size={18} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
                Dialectic Multi-Agent Debate
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Dispatches an Adversarial Red-Team Critic, a Value Optimist, and an Empiric Realist to debate candidate responses in parallel, systematically removing confirmation bias.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="nm-card" style={{ padding: "24px", borderRadius: 16 }}>
              <div
                className="nm-pill nm-pill-blue"
                style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, marginBottom: 14 }}
              >
                <Search size={18} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)" }}>
                Atomic Fact Grounding (NLI)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Isolates testable factual claims using Natural Language Inference and verifies them in real time against Tavily web search citations, labeling each claim verified, false, or uncertain.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="nm-card" style={{ padding: "24px", borderRadius: 16 }}>
              <div
                className="nm-pill nm-pill-green"
                style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, marginBottom: 14 }}
              >
                <Terminal size={18} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
                System Prompt Patch Generator
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Does not stop at diagnosis. Generates an immediate, copyable XML meta-prompt patch and JSON guardrail schema that developers can drop into production system instructions to prevent regression.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="nm-card" style={{ padding: "24px", borderRadius: 16 }}>
              <div
                className="nm-pill nm-pill-gold"
                style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, marginBottom: 14 }}
              >
                <FileCheck size={18} />
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
                Tamper-Evident SHA-256 Ledger
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Every audit receives a unique cryptographic hash and generates an executive PDF report for regulatory compliance, internal AI safety juries, and executive leadership memos.
              </p>
            </div>
          </div>
        </section>

        {/* Regulatory Alignment Banner */}
        <section>
          <div
            className="nm-card"
            style={{
              padding: "24px 28px",
              borderRadius: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
              background: "var(--bg-inset)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <ShieldCheck size={20} color="var(--accent-green)" />
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-main)" }}>
                  Aligned with Global AI Safety Frameworks
                </span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Complies with NIST AI RMF 1.0 (Govern, Map, Measure, Manage) and OWASP Top 10 for LLM Applications 2025/2026.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/about" className="nm-button" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
                <span>View Mathematical Formulas</span>
              </Link>
              <Link href="/analyzer" className="nm-button nm-button-primary" style={{ padding: "8px 18px", fontSize: "0.82rem" }}>
                <span>Run Diagnostics</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
