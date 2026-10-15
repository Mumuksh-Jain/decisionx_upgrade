"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import InteractiveOrbitalHero from "@/components/InteractiveOrbitalHero";
import LiveAuditSimulation from "@/components/LiveAuditSimulation";
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
  Cpu,
  Layers,
  Check
} from "lucide-react";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="enterprise-container" style={{ flex: 1, paddingBottom: 40 }}>
        {/* Hero Section: Editorial Headline + Interactive Orbital Celestial Vector */}
        <section style={{ padding: "40px 0 60px 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              alignItems: "center",
              gap: 40,
            }}
          >
            {/* Left Column: Mission Control Pitch */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span className="nm-pill nm-pill-gold">
                  DECISIONX ENTERPRISE v3.2
                </span>
                <span className="nm-pill nm-pill-blue">
                  NIST AI RMF 1.0 & OWASP ALIGNED
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.1rem, 3.8vw, 3.4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  color: "var(--text-main)",
                  lineHeight: 1.14,
                  marginBottom: 20,
                }}
              >
                Autonomous Epistemic Diagnostics & Guardrails for High-Stakes AI
              </h1>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                  marginBottom: 32,
                  maxWidth: 580,
                }}
              >
                Detect hallucinations, prevent covert disparate impact, and enforce mathematical safety boundaries using dialectic multi-agent consensus, retrieval-backed proposition grounding, and executable system prompt patches.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                  marginBottom: 36,
                }}
              >
                <Link
                  href="/analyzer"
                  className="nm-button nm-button-primary"
                  style={{
                    fontSize: "0.95rem",
                    padding: "13px 28px",
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
                    padding: "13px 24px",
                    borderRadius: 12,
                    gap: 8,
                  }}
                >
                  <Terminal size={18} />
                  <span>Explore Benchmark Lab</span>
                </Link>
              </div>

              {/* 4 Architecture Pillars Chips */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                  maxWidth: 540,
                }}
              >
                <div className="nm-inset" style={{ padding: "10px 14px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={16} color="var(--accent-gold)" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>3-Agent Dialectic Consensus</span>
                </div>
                <div className="nm-inset" style={{ padding: "10px 14px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <Search size={16} color="var(--accent-green)" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Tavily Fact Citations</span>
                </div>
                <div className="nm-inset" style={{ padding: "10px 14px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <Terminal size={16} color="var(--accent-blue)" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>XML Meta-Prompt Patcher</span>
                </div>
                <div className="nm-inset" style={{ padding: "10px 14px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <FileCheck size={16} color="var(--accent-gold)" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>SHA-256 Tamper Ledger</span>
                </div>
              </div>
            </div>

            {/* Right Column: Celestial Interactive Orbital Halo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <InteractiveOrbitalHero />
            </div>
          </div>
        </section>

        {/* Live Interactive Benchmark Simulation Section */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span className="nm-pill nm-pill-gold">
                INTERACTIVE AUDIT LABORATORY
              </span>
              <span className="nm-pill nm-pill-green">
                ZERO-LATENCY RADAR SIMULATION
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-main)",
              }}
            >
              Dialectic Multi-Agent Audit in Real-Time
            </h2>
            <p
              style={{
                fontSize: "0.92rem",
                color: "var(--text-muted)",
                maxWidth: 680,
                margin: "8px auto 0 auto",
                lineHeight: 1.6,
              }}
            >
              Select any high-liability scenario below to inspect how DecisionX eliminates hallucinations, recalculates calibrated risk envelopes, and generates immediate XML system prompt patches.
            </p>
          </div>

          <LiveAuditSimulation />
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
