"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import LiveTelemetryConsole from "@/components/LiveTelemetryConsole";
import DeepAuditWorkspace from "@/components/DeepAuditWorkspace";
import { BENCHMARK_SUITES } from "@/data/benchmarks";
import { analyzeDecision } from "@/services/analyzeService";
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity,
  Layers,
  FileCheck,
  RotateCcw
} from "lucide-react";

export default function AnalyzerPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeBenchmarkId, setActiveBenchmarkId] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const telemetryRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    try {
      const presetP = localStorage.getItem("decisionx_preset_prompt");
      const presetO = localStorage.getItem("decisionx_preset_output");
      if (presetP && presetO) {
        setPrompt(presetP);
        setOutput(presetO);
        localStorage.removeItem("decisionx_preset_prompt");
        localStorage.removeItem("decisionx_preset_output");
      }
    } catch {}
  }, []);

  const handleSelectBenchmark = (bench) => {
    setPrompt(bench.prompt);
    setOutput(bench.output);
    setActiveBenchmarkId(bench.id);
    setError(null);
    setResults(null);
  };

  const handleClearInputs = () => {
    setPrompt("");
    setOutput("");
    setActiveBenchmarkId(null);
    setError(null);
    setResults(null);
  };

  const saveToHistory = (data) => {
    try {
      const stored = localStorage.getItem("decisionx_analyses") || "[]";
      const analyses = JSON.parse(stored);
      analyses.unshift({
        id: data.auditHash || Date.now().toString(),
        timestamp: new Date().toISOString(),
        prompt,
        output,
        ...data,
      });
      // Keep last 30 audits
      localStorage.setItem("decisionx_analyses", JSON.stringify(analyses.slice(0, 30)));
    } catch (err) {
      console.error("Failed to save audit history:", err);
    }
  };

  const handleRunDiagnostics = async () => {
    if (!prompt.trim() || !output.trim()) return;

    setError(null);
    setResults(null);
    setLoading(true);

    // Scroll to telemetry console smoothly
    setTimeout(() => {
      if (telemetryRef.current) {
        telemetryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    try {
      const data = await analyzeDecision(prompt, output);
      setResults(data);
      saveToHistory(data);

      // Scroll to deep audit workspace after completion
      setTimeout(() => {
        if (workspaceRef.current) {
          workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 600);
    } catch (err) {
      console.error("Analysis execution error:", err);
      setError(err?.message || "Failed to complete diagnostics. Check network or API rate limits.");
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = prompt.trim().length >= 10 && output.trim().length >= 10 && !loading;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation Enterprise Header */}
      <Header onSelectPersona={(p) => setSelectedPersona(p)} />

      <main className="enterprise-container" style={{ flex: 1, paddingBottom: 40 }}>
        {/* Page Title & Breadcrumb Ribbon */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-gold)", letterSpacing: "0.05em" }}>
              DIAGNOSTICS & TELEMETRY
            </span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>/</span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)", fontWeight: 600 }}>
              MISSION CONTROL
            </span>
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-main)" }}>
            Autonomous Output Epistemic Audit
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: 4 }}>
            Input user prompt and candidate AI response to execute multi-agent dialectic consensus, fact verification, and guardrail synthesis.
          </p>
        </div>

        {/* 1-Click Industry Benchmark Suites Ribbon */}
        <div
          className="nm-card"
          style={{
            padding: "16px 20px",
            borderRadius: 14,
            marginBottom: 24,
            borderLeft: "4px solid var(--accent-gold)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="var(--accent-gold)" />
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-main)" }}>
                Load High-Stakes Production Benchmark Suites
              </span>
            </div>
            <span style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>
              One-click adversarial edge cases
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BENCHMARK_SUITES.map((bench) => {
              const isSelected = activeBenchmarkId === bench.id;
              return (
                <button
                  key={bench.id}
                  onClick={() => handleSelectBenchmark(bench)}
                  className={`nm-button ${isSelected ? "active" : ""}`}
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.76rem",
                    borderRadius: 8,
                    background: isSelected ? "var(--accent-gold-bg)" : "var(--bg-surface)",
                    borderColor: isSelected ? "var(--accent-gold)" : "var(--border-subtle)",
                    color: isSelected ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                  title={bench.description}
                >
                  <span style={{ fontWeight: 700 }}>{bench.domainBadge.split("/")[0]}</span>
                  <span>: {bench.title.split("&")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Input Workspace */}
        <div
          className="nm-card"
          style={{
            padding: "24px",
            borderRadius: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 24,
              marginBottom: 24,
            }}
          >
            {/* Panel 1: User Prompt Input */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>1. User Input Prompt</span>
                  <span className="nm-pill" style={{ fontSize: "0.68rem" }}>
                    ORIGINAL CONTEXT
                  </span>
                </label>
                <span className="mono" style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>
                  {prompt.length} chars
                </span>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste the original prompt, user instruction, or conversational context..."
                disabled={loading}
                rows={9}
                style={{
                  resize: "vertical",
                  minHeight: 180,
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* Panel 2: AI Output Under Audit */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>2. Candidate AI Output</span>
                  <span className="nm-pill nm-pill-gold" style={{ fontSize: "0.68rem" }}>
                    TARGET FOR AUDIT
                  </span>
                </label>
                <span className="mono" style={{ fontSize: "0.74rem", color: "var(--text-dim)" }}>
                  {output.length} chars
                </span>
              </div>

              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Paste the candidate AI response to evaluate for hallucinations, safety violations, and bias..."
                disabled={loading}
                rows={9}
                style={{
                  resize: "vertical",
                  minHeight: 180,
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>

          {/* Action Ribbon: Run Diagnostics & Clear */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--text-dim)" }}>
              <span>Minimum 10 characters required in both fields.</span>
              {activeBenchmarkId && (
                <span className="nm-pill nm-pill-blue">Active: {activeBenchmarkId}</span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleClearInputs}
                disabled={loading || (!prompt && !output)}
                className="nm-button"
                style={{ fontSize: "0.82rem", padding: "10px 16px" }}
              >
                <RotateCcw size={14} />
                <span>Reset Fields</span>
              </button>

              <button
                onClick={handleRunDiagnostics}
                disabled={!canAnalyze}
                className="nm-button nm-button-primary"
                style={{
                  fontSize: "0.92rem",
                  padding: "12px 28px",
                  borderRadius: 12,
                  gap: 10,
                }}
              >
                <Activity size={18} className={loading ? "telemetry-pulse" : ""} />
                <span style={{ fontWeight: 800 }}>
                  {loading ? "Executing Epistemic Audit..." : "Run Diagnostics"}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Live Execution Telemetry Console (Activates upon clicking Run Diagnostics) */}
        {(loading || results || error) && (
          <div ref={telemetryRef}>
            <LiveTelemetryConsole
              isLoading={loading}
              error={error}
              onComplete={() => {}}
            />
          </div>
        )}

        {/* Deep Audit Workspace (Unlocks upon completion) */}
        {results && (
          <div ref={workspaceRef} style={{ marginTop: 32 }}>
            <DeepAuditWorkspace
              results={results}
              prompt={prompt}
              output={output}
              onReset={handleClearInputs}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
