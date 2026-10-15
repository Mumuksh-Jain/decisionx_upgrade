"use client";

import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import {
  Database,
  Cpu,
  ShieldCheck,
  Search,
  BookOpen,
  ArrowRight,
  Layers,
  Activity,
  FileCheck,
  CheckCircle2
} from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="enterprise-container" style={{ flex: 1, paddingBottom: 40 }}>
        {/* Ribbon Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-gold)", letterSpacing: "0.05em" }}>
              ACADEMIC SPECIFICATION & ARCHITECTURE
            </span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>/</span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)", fontWeight: 600 }}>
              SYSTEM LIFELINE
            </span>
          </div>

          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-main)" }}>
            The Science & Architecture of DecisionX Enterprise
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginTop: 6, maxWidth: 840, lineHeight: 1.6 }}>
            Autonomous epistemic verification, multi-agent dialectic consensus, retrieval-backed claim grounding, and production guardrail patch generation for high-stakes AI outputs.
          </p>
        </div>

        {/* Section 1: Executive Architectural Overview */}
        <section style={{ marginBottom: 36 }}>
          <div
            className="nm-card fade-in-up"
            style={{
              padding: "28px",
              borderRadius: 16,
              borderLeft: "4px solid var(--accent-gold)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 10 }}>
              1. Theoretical Foundation: The RAG Triad & Multi-Agent Debate
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
              Production LLMs routinely suffer from authoritative-sounding epistemic failure. DecisionX bridges three peer-reviewed evaluation frameworks to guarantee verifiable truth in automated reasoning:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <div className="nm-inset" style={{ padding: "16px", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Search size={16} color="var(--accent-blue)" />
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>
                    The RAG Triad (TruLens / DeepEval)
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Measures Context Relevance, Faithfulness (entailment ratio of claims grounded in retrieved evidence), and Answer Relevance to prevent unanchored hallucinations.
                </p>
              </div>

              <div className="nm-inset" style={{ padding: "16px", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Cpu size={16} color="var(--accent-gold)" />
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>
                    Dialectic Multi-Agent Debate (MAD)
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Based on MIT CSAIL research (Du et al.). Multiple independent agent personas (Adversarial Critic, Value Optimist, Empiric Realist) cross-examine outputs to eliminate single-model sycophancy.
                </p>
              </div>

              <div className="nm-inset" style={{ padding: "16px", borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <ShieldCheck size={16} color="var(--accent-green)" />
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>
                    NIST AI RMF & OWASP LLM09
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Maps directly to OWASP Top 10 for LLMs (LLM09 Misinformation, LLM01 Prompt Injection) and NIST Risk Management Framework 1.0 (Govern, Map, Measure, Manage).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Mathematical Scoring Formulations */}
        <section style={{ marginBottom: 36 }}>
          <div className="nm-card fade-in-up" style={{ padding: "28px", borderRadius: 16 }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 12 }}>
              2. Deterministic Scoring Equations & Calibrations
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
              All diagnostics in DecisionX are governed by deterministic, transparent mathematical formulas clamped to the [0, 100] integer domain. No black-box arbitrary scores.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Formula 1: Accuracy */}
              <div className="nm-inset" style={{ padding: "18px", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>
                    Factual Accuracy Equation
                  </span>
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent-green)" }}>
                    Verified = 100 | Uncertain = 60 | False = 0
                  </span>
                </div>
                <div className="nm-inset-deep mono" style={{ padding: "10px 14px", borderRadius: 8, fontSize: "0.88rem", color: "var(--text-main)", marginBottom: 8 }}>
                  AccuracyScore = round((100 • N_verified + 60 • N_uncertain + 0 • N_false) / max(1, N_total))
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Derived from propositional natural language inference against authoritative Tavily web citations.
                </p>
              </div>

              {/* Formula 2: Hallucination Score */}
              <div className="nm-inset" style={{ padding: "18px", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>
                    Confidence-Weighted Hallucination Risk
                  </span>
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent-red)" }}>
                    Weighted Penalty Curve
                  </span>
                </div>
                <div className="nm-inset-deep mono" style={{ padding: "10px 14px", borderRadius: 8, fontSize: "0.88rem", color: "var(--text-main)", marginBottom: 8 }}>
                  HallucinationPenalty = (70 + 30 • c) for False | (25 + 55 • c) for Uncertain | 20 • (1 - c) for Verified
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Where c is the calibration confidence score [0.0 - 1.0] derived from empirical retrieval relevance.
                </p>
              </div>

              {/* Formula 3: Composite Final Risk */}
              <div className="nm-inset" style={{ padding: "18px", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-main)" }}>
                    Composite Final Risk Formulation (Convex Combination with Safety Gating)
                  </span>
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--accent-gold)" }}>
                    NIST Clamped Floor
                  </span>
                </div>
                <div className="nm-inset-deep mono" style={{ padding: "10px 14px", borderRadius: 8, fontSize: "0.88rem", color: "var(--text-main)", marginBottom: 8 }}>
                  FinalRisk = clamp(0.15 • R_domain + 0.25 • H_score + 0.20 • (100 - Accuracy) + 0.15 • Safety + 0.10 • Bias + 0.10 • Impact + 0.05 • Prompt)
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <strong>Hard Safety Gating Override:</strong> If critical clinical contraindications or severe protected-class discrimination is detected, FinalRisk is clamped to a strict floor of 85.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: High-Stakes Domain Baseline Risk Floors */}
        <section style={{ marginBottom: 36 }}>
          <div className="nm-card fade-in-up" style={{ padding: "28px", borderRadius: 16 }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 12 }}>
              3. Regulatory Domain Risk Floors (NIST Taxonomy)
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 18 }}>
              High-consequence domains cannot have a risk score of zero because operational and regulatory liabilities exist regardless of linguistic plausibility.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {[
                { domain: "Healthcare / Clinical", floor: "30%", color: "var(--accent-red)", desc: "Dosage error, contraindications, HIPAA compliance." },
                { domain: "Legal / Statutory", floor: "26%", color: "var(--accent-gold)", desc: "Unauthorized legal practice, contractual liability." },
                { domain: "Finance / Advisory", floor: "24%", color: "var(--accent-gold)", desc: "SEC/FINRA non-compliance, fraudulent guarantees." },
                { domain: "Cybersecurity", floor: "28%", color: "var(--accent-red)", desc: "CWE vulnerabilities, credential leakage, jailbreaks." },
                { domain: "Corporate HR", floor: "20%", color: "var(--accent-blue)", desc: "Disparate impact, EEOC protected class bias." },
                { domain: "General Context", floor: "8%", color: "var(--text-dim)", desc: "Baseline epistemic and operational uncertainty." },
              ].map((item, idx) => (
                <div key={idx} className="nm-inset" style={{ padding: "16px", borderRadius: 10 }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-main)" }}>{item.domain}</div>
                  <div className="mono" style={{ fontSize: "1.4rem", fontWeight: 800, color: item.color, margin: "6px 0" }}>
                    {item.floor}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Launch */}
        <div
          className="nm-card"
          style={{
            padding: "24px",
            borderRadius: 16,
            textAlign: "center",
            background: "var(--bg-surface)",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>
            Ready to Verify Production LLM Outputs?
          </h3>
          <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginTop: 6, marginBottom: 18 }}>
            Experience live dialectic debate, claim extraction, and guardrail prompt patch generation.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/analyzer" className="nm-button nm-button-primary" style={{ padding: "10px 24px" }}>
              <span>Launch Mission Control</span>
              <ArrowRight size={14} />
            </Link>
            <Link href="/benchmarks" className="nm-button" style={{ padding: "10px 24px" }}>
              <span>Explore Benchmark Lab</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
