"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { BENCHMARK_SUITES } from "@/data/benchmarks";
import {
  Terminal,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function BenchmarksPage() {
  const [activeDomainFilter, setActiveDomainFilter] = useState("all");

  const filteredSuites = BENCHMARK_SUITES.filter(
    (b) => activeDomainFilter === "all" || b.domain === activeDomainFilter
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="enterprise-container" style={{ flex: 1, paddingBottom: 40 }}>
        {/* Ribbon Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-gold)", letterSpacing: "0.05em" }}>
              RESEARCH & EVALUATION
            </span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>/</span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)", fontWeight: 600 }}>
              BENCHMARK LAB
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-main)" }}>
            High-Stakes AI Evaluation Benchmark Suites
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: 4 }}>
            Pre-configured adversarial edge cases across Clinical, Financial, Sociotechnical HR, Cybersecurity, and Factual domains.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          className="nm-inset"
          style={{
            padding: "6px",
            borderRadius: 12,
            display: "inline-flex",
            gap: 6,
            marginBottom: 28,
          }}
        >
          {["all", "healthcare", "finance", "cybersecurity", "general"].map((dom) => (
            <button
              key={dom}
              onClick={() => setActiveDomainFilter(dom)}
              className={`nm-button ${activeDomainFilter === dom ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                fontSize: "0.8rem",
                borderRadius: 8,
                background: activeDomainFilter === dom ? "var(--bg-surface)" : "transparent",
                color: activeDomainFilter === dom ? "var(--accent-gold)" : "var(--text-muted)",
                textTransform: "capitalize",
              }}
            >
              {dom === "all" ? "All Domains" : dom}
            </button>
          ))}
        </div>

        {/* Benchmark Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: 20,
          }}
        >
          {filteredSuites.map((bench) => {
            const isCritical = bench.expectedRiskTier === "Critical";
            return (
              <div
                key={bench.id}
                className="nm-card fade-in-up"
                style={{
                  padding: "24px",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderTop: isCritical ? "3px solid var(--accent-red)" : "3px solid var(--accent-gold)",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <span className="nm-pill" style={{ fontSize: "0.72rem" }}>
                      {bench.domainBadge}
                    </span>
                    <span
                      className={`nm-pill ${
                        isCritical
                          ? "nm-pill-red"
                          : bench.expectedRiskTier === "Elevated"
                          ? "nm-pill-gold"
                          : "nm-pill-green"
                      }`}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {bench.expectedRiskTier}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
                    {bench.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16 }}>
                    {bench.description}
                  </p>

                  {/* Key Vulnerability Bullet Points */}
                  <div className="nm-inset" style={{ padding: "14px", borderRadius: 10, marginBottom: 20 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>
                      Target Vulnerabilities Under Audit:
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {bench.keyRisks.map((risk, rIdx) => (
                        <li key={rIdx} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                          <span style={{ color: "var(--accent-red)" }}>•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Launch CTA */}
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
                  <Link
                    href={`/analyzer`}
                    className="nm-button nm-button-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "10px",
                      fontSize: "0.84rem",
                    }}
                    onClick={() => {
                      try {
                        localStorage.setItem("decisionx_preset_prompt", bench.prompt);
                        localStorage.setItem("decisionx_preset_output", bench.output);
                      } catch {}
                    }}
                  >
                    <span>Inspect & Audit in Mission Control</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
