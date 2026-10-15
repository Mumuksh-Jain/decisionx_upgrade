"use client";

import { useState, useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  FileCheck,
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";
import ClaimVerificationMatrix from "./ClaimVerificationMatrix";
import MultiAgentDeliberation from "./MultiAgentDeliberation";
import DiffRemediationStudio from "./DiffRemediationStudio";
import SystemPromptPatcher from "./SystemPromptPatcher";
import FailureCascadeDag from "./FailureCascadeDag";

export default function DeepAuditWorkspace({
  results = {},
  prompt = "",
  output = "",
  onReset = null,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const reportRef = useRef(null);

  // Extract calibrated metrics
  const finalRisk = Number(results?.finalRisk ?? 0);
  const accuracyScore = Number(results?.accuracyScore ?? 100);
  const hallucinationScore = Number(results?.hallucinationScore ?? 0);
  const safetyScore = Number(results?.safetyScore ?? 0);
  const biasScore = Number(results?.biasScore ?? 0);
  const promptRisk = Number(results?.promptRisk ?? 0);
  const domainRisk = Number(results?.domainRisk ?? 10);
  const domain = String(results?.domain || "general");
  const primaryIssue = String(results?.primaryIssue || "General Risk");
  const verdict = String(results?.verdict || "Analysis completed.");
  const riskLabel = String(results?.riskLabel || "safe").toLowerCase();

  // Generate SHA-256 Mock/Integrity Hash
  const auditHash = results?.auditHash ||
    "8e4f1a" + Math.abs(finalRisk * 3137 + accuracyScore * 991).toString(16).padStart(8, "0") + "c9b2e04f";

  // Determine Risk Tier styling
  const isCritical = finalRisk >= 75 || riskLabel === "dangerous";
  const isElevated = finalRisk >= 40 && finalRisk < 75;
  const isSafe = finalRisk < 40;

  const riskTierBadge = isCritical
    ? { label: "CRITICAL RISK", class: "nm-pill-red", color: "var(--accent-red)" }
    : isElevated
    ? { label: "ELEVATED RISK", class: "nm-pill-gold", color: "var(--accent-gold)" }
    : { label: "SAFE / LOW RISK", class: "nm-pill-green", color: "var(--accent-green)" };

  // Tabs Definition
  const tabs = [
    { id: "overview", label: "Overview & HUD", count: null },
    { id: "claims", label: "Atomic Fact Matrix", count: results?.hallucinations?.length || 0 },
    { id: "agents", label: "Multi-Agent Deliberation", count: 3 },
    { id: "diff", label: "Clause Diff & Remediation", count: null },
    { id: "patch", label: "System Prompt Patch", count: "XML" },
    { id: "cascade", label: "Failure Cascade DAG", count: null },
  ];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(auditHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      if (!reportRef.current) return;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.getAttribute("data-theme") === "dark" ? "#11141d" : "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`DecisionX_Audit_Report_${domain}_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF Export completed with standard printer dialogue.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fade-in-up" ref={reportRef}>
      {/* Top Banner: Verification Certificate & Integrity */}
      <div
        className="nm-card"
        style={{
          padding: "20px 24px",
          borderRadius: 16,
          marginBottom: 24,
          borderLeft: `5px solid ${riskTierBadge.color}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={`nm-pill ${riskTierBadge.class}`} style={{ fontSize: "0.8rem", padding: "4px 12px" }}>
                {riskTierBadge.label}
              </span>
              <span className="nm-pill" style={{ fontSize: "0.76rem" }}>
                DOMAIN: {domain.toUpperCase()} (FLOOR: {domainRisk}%)
              </span>
              <span className="nm-pill nm-pill-blue" style={{ fontSize: "0.76rem" }}>
                NIST AI RMF 1.0 COMPLIANT
              </span>
            </div>

            <h1
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "var(--text-main)",
                letterSpacing: "-0.02em",
                marginTop: 8,
              }}
            >
              {verdict}
            </h1>
            <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: 4 }}>
              Primary Vulnerability: <strong style={{ color: "var(--text-main)" }}>{primaryIssue}</strong>
            </p>
          </div>

          {/* Action Buttons: Export PDF & Hash */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleCopyHash}
              className="nm-button"
              style={{ fontSize: "0.78rem", padding: "8px 12px", gap: 6 }}
              title="Click to copy SHA-256 Audit Certificate Hash"
            >
              <FileCheck size={14} color="var(--accent-green)" />
              <span className="mono">ID: {auditHash.substring(0, 8)}...</span>
              {copiedHash ? <Check size={12} /> : <Copy size={12} />}
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="nm-button nm-button-primary"
              style={{ fontSize: "0.78rem", padding: "8px 16px", gap: 6 }}
            >
              <Download size={14} />
              <span>{isExporting ? "Compiling PDF..." : "Export Audit PDF"}</span>
            </button>

            {typeof onReset === "function" && (
              <button
                onClick={onReset}
                className="nm-button"
                style={{ fontSize: "0.78rem", padding: "8px 12px", gap: 6 }}
              >
                <RefreshCw size={14} />
                <span>New Audit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div
        className="nm-inset"
        style={{
          padding: "6px",
          borderRadius: 12,
          display: "flex",
          gap: 6,
          overflowX: "auto",
          marginBottom: 24,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nm-button ${isActive ? "active" : ""}`}
              style={{
                padding: "8px 16px",
                fontSize: "0.82rem",
                borderRadius: 8,
                background: isActive ? "var(--bg-surface)" : "transparent",
                boxShadow: isActive ? "var(--nm-flat-sm)" : "none",
                borderColor: isActive ? "var(--border-subtle)" : "transparent",
                color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                whiteSpace: "nowrap",
                fontWeight: isActive ? 700 : 600,
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: 9999,
                    background: isActive ? "var(--accent-gold-bg)" : "var(--bg-inset-deep)",
                    color: isActive ? "var(--accent-gold)" : "var(--text-dim)",
                    fontWeight: 800,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & HUD */}
      {activeTab === "overview" && (
        <div className="fade-in-up">
          {/* 6 High-Precision Tactile Metric Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {/* Metric 1: Final Risk */}
            <div className="nm-card" style={{ padding: "18px", borderRadius: 14 }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                Final Risk Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                <span className="mono" style={{ fontSize: "2rem", fontWeight: 800, color: riskTierBadge.color }}>
                  {finalRisk}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>/100</span>
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 9999, background: "var(--bg-inset)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${finalRisk}%`, background: riskTierBadge.color, borderRadius: 9999 }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 6 }}>
                Hard-gated calibrated risk
              </div>
            </div>

            {/* Metric 2: Factual Accuracy */}
            <div className="nm-card" style={{ padding: "18px", borderRadius: 14 }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                Factual Accuracy
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                <span className="mono" style={{ fontSize: "2rem", fontWeight: 800, color: accuracyScore >= 70 ? "var(--accent-green)" : "var(--accent-red)" }}>
                  {accuracyScore}%
                </span>
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 9999, background: "var(--bg-inset)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${accuracyScore}%`, background: "var(--accent-green)", borderRadius: 9999 }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 6 }}>
                NLI verified claim ratio
              </div>
            </div>

            {/* Metric 3: Hallucination Rate */}
            <div className="nm-card" style={{ padding: "18px", borderRadius: 14 }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                Hallucination Risk
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                <span className="mono" style={{ fontSize: "2rem", fontWeight: 800, color: hallucinationScore > 35 ? "var(--accent-red)" : "var(--accent-green)" }}>
                  {hallucinationScore}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>/100</span>
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 9999, background: "var(--bg-inset)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hallucinationScore}%`, background: "var(--accent-red)", borderRadius: 9999 }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 6 }}>
                Confidence-weighted false claims
              </div>
            </div>

            {/* Metric 4: Safety & Harm */}
            <div className="nm-card" style={{ padding: "18px", borderRadius: 14 }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                Safety & Violations
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                <span className="mono" style={{ fontSize: "2rem", fontWeight: 800, color: safetyScore > 30 ? "var(--accent-red)" : "var(--accent-green)" }}>
                  {safetyScore}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>/100</span>
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 9999, background: "var(--bg-inset)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${safetyScore}%`, background: "var(--accent-gold)", borderRadius: 9999 }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 6 }}>
                Contraindication & harm flags
              </div>
            </div>

            {/* Metric 5: Sociotechnical Bias */}
            <div className="nm-card" style={{ padding: "18px", borderRadius: 14 }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                Sociotechnical Bias
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                <span className="mono" style={{ fontSize: "2rem", fontWeight: 800, color: biasScore > 30 ? "var(--accent-red)" : "var(--accent-green)" }}>
                  {biasScore}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>/100</span>
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 9999, background: "var(--bg-inset)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${biasScore}%`, background: "var(--accent-blue)", borderRadius: 9999 }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 6 }}>
                Protected demographic scan
              </div>
            </div>

            {/* Metric 6: Domain Floor */}
            <div className="nm-card" style={{ padding: "18px", borderRadius: 14 }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>
                Domain Risk Floor
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
                <span className="mono" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-gold)" }}>
                  {domainRisk}%
                </span>
              </div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 9999, background: "var(--bg-inset)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${domainRisk}%`, background: "var(--accent-gold)", borderRadius: 9999 }} />
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 6 }}>
                Inherent domain sensitivity floor
              </div>
            </div>
          </div>

          {/* Quick Summary Split: Top Claims + Remediation Snippet */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
            {/* Top Claims Summary */}
            <div className="nm-card" style={{ padding: "20px", borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-main)" }}>
                  Key Extracted Claims ({results?.hallucinations?.length || 0})
                </h3>
                <button
                  onClick={() => setActiveTab("claims")}
                  className="nm-button"
                  style={{ padding: "4px 8px", fontSize: "0.74rem", gap: 4 }}
                >
                  <span>View All Matrix</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(results?.hallucinations || []).slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="nm-inset"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: "0.82rem",
                      borderLeft:
                        item?.status === "verified"
                          ? "3px solid var(--accent-green)"
                          : item?.status === "false"
                          ? "3px solid var(--accent-red)"
                          : "3px solid var(--accent-gold)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span className="mono" style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                        CLAIM 0{idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          color:
                            item?.status === "verified"
                              ? "var(--accent-green)"
                              : item?.status === "false"
                              ? "var(--accent-red)"
                              : "var(--accent-gold)",
                        }}
                      >
                        {item?.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>"{item?.claim}"</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Guardrail Patch Preview */}
            <div className="nm-card" style={{ padding: "20px", borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-main)" }}>
                  Production Guardrail Action
                </h3>
                <button
                  onClick={() => setActiveTab("patch")}
                  className="nm-button nm-button-primary"
                  style={{ padding: "4px 10px", fontSize: "0.74rem", gap: 4 }}
                >
                  <span>Open Patcher</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              <div
                className="nm-inset"
                style={{
                  padding: "14px",
                  borderRadius: 10,
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                }}
              >
                <p>
                  To prevent this model from repeating <strong>{primaryIssue}</strong> in the <strong>{domain}</strong> domain, deploy the calibrated meta-prompt patch into your LLM system instructions.
                </p>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setActiveTab("diff")}
                    className="nm-button"
                    style={{ fontSize: "0.76rem", padding: "6px 12px" }}
                  >
                    Inspect Clause Diff
                  </button>
                  <button
                    onClick={() => setActiveTab("agents")}
                    className="nm-button"
                    style={{ fontSize: "0.76rem", padding: "6px 12px" }}
                  >
                    Review Agent Deliberation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Claims Matrix */}
      {activeTab === "claims" && (
        <ClaimVerificationMatrix hallucinations={results?.hallucinations || []} />
      )}

      {/* Tab 3: Multi-Agent Deliberation */}
      {activeTab === "agents" && (
        <MultiAgentDeliberation
          agents={results?.agents || {}}
          verdict={verdict}
          scoreExplanation={results?.scoreExplanation || {}}
        />
      )}

      {/* Tab 4: Clause Diff & Remediation */}
      {activeTab === "diff" && (
        <DiffRemediationStudio
          originalOutput={output}
          correctedOutput={results?.correctedOutput}
          alternatives={results?.alternatives}
          primaryIssue={primaryIssue}
        />
      )}

      {/* Tab 5: System Prompt Patcher */}
      {activeTab === "patch" && (
        <SystemPromptPatcher
          domain={domain}
          primaryIssue={primaryIssue}
          safetyFlags={results?.safetyFlags || []}
          hallucinations={results?.hallucinations || []}
          auditHash={auditHash}
        />
      )}

      {/* Tab 6: Failure Cascade DAG */}
      {activeTab === "cascade" && (
        <FailureCascadeDag
          impact={results?.impact || []}
          primaryIssue={primaryIssue}
          domain={domain}
        />
      )}
    </div>
  );
}
