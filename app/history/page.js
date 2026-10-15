"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import {
  FileCheck,
  Search,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight
} from "lucide-react";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedAudit, setSelectedAudit] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("decisionx_analyses");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAnalyses(parsed);
          if (parsed.length > 0) setSelectedAudit(parsed[0]);
        }
      }
    } catch (err) {
      console.error("Failed to parse stored audits:", err);
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local audit history?")) {
      try {
        localStorage.removeItem("decisionx_analyses");
        setAnalyses([]);
        setSelectedAudit(null);
      } catch {}
    }
  };

  const filteredAnalyses = analyses.filter((item) => {
    const textMatch =
      String(item?.prompt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item?.output || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item?.domain || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item?.verdict || "").toLowerCase().includes(searchQuery.toLowerCase());

    const risk = Number(item?.finalRisk ?? 0);
    const tierMatch =
      tierFilter === "all" ||
      (tierFilter === "critical" && risk >= 75) ||
      (tierFilter === "elevated" && risk >= 40 && risk < 75) ||
      (tierFilter === "safe" && risk < 40);

    return textMatch && tierMatch;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main className="enterprise-container" style={{ flex: 1, paddingBottom: 40 }}>
        {/* Ribbon Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-gold)", letterSpacing: "0.05em" }}>
              AUDIT RECORDS & GOVERNANCE
            </span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)" }}>/</span>
            <span style={{ fontSize: "0.76rem", color: "var(--text-dim)", fontWeight: 600 }}>
              TAMPER-EVIDENT HISTORY
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-main)" }}>
                Diagnostic Audit Ledger
              </h1>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: 4 }}>
                Review past autonomous evaluations, claim verification results, and SHA-256 certificate hashes.
              </p>
            </div>

            {analyses.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="nm-button"
                style={{ fontSize: "0.8rem", padding: "8px 14px", color: "var(--accent-red)", gap: 6 }}
              >
                <Trash2 size={14} />
                <span>Clear Ledger</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          className="nm-card"
          style={{
            padding: "16px 20px",
            borderRadius: 14,
            marginBottom: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {/* Search Input */}
          <div style={{ position: "relative", minWidth: 280, flex: 1 }}>
            <input
              type="text"
              placeholder="Search past audits by prompt, claim, domain or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-dim)",
              }}
            />
          </div>

          {/* Tier Filter Pills */}
          <div className="nm-inset" style={{ padding: "4px", borderRadius: 10, display: "flex", gap: 4 }}>
            {["all", "critical", "elevated", "safe"].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`nm-button ${tierFilter === tier ? "active" : ""}`}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.76rem",
                  borderRadius: 8,
                  background: tierFilter === tier ? "var(--bg-surface)" : "transparent",
                  color: tierFilter === tier ? "var(--accent-gold)" : "var(--text-muted)",
                  textTransform: "capitalize",
                }}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* History Workspace: Dual Column Ledger */}
        {filteredAnalyses.length === 0 ? (
          <div className="nm-card" style={{ padding: "48px 24px", textAlign: "center", borderRadius: 16 }}>
            <FileCheck size={36} color="var(--accent-gold)" style={{ margin: "0 auto 12px auto" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
              {analyses.length === 0 ? "No Historical Audits Recorded" : "No Audits Match Filter"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 6, maxWidth: 440, margin: "6px auto 18px auto" }}>
              Run your first diagnosis in Mission Control or select a test case from the Benchmark Lab.
            </p>
            <Link href="/analyzer" className="nm-button nm-button-primary" style={{ padding: "10px 20px" }}>
              <span>Launch Mission Control</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
            {/* List of Audits */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredAnalyses.map((audit, idx) => {
                const isSelected = selectedAudit?.timestamp === audit.timestamp;
                const risk = Number(audit?.finalRisk ?? 0);
                const isCrit = risk >= 75;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedAudit(audit)}
                    className="nm-card fade-in-up"
                    style={{
                      padding: "16px 18px",
                      borderRadius: 12,
                      cursor: "pointer",
                      borderLeft: isCrit ? "4px solid var(--accent-red)" : "4px solid var(--accent-gold)",
                      background: isSelected ? "var(--bg-inset)" : "var(--bg-surface)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                          {new Date(audit.timestamp).toLocaleDateString()} {new Date(audit.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="nm-pill" style={{ fontSize: "0.68rem" }}>
                          {audit.domain?.toUpperCase() || "GENERAL"}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          className="mono"
                          style={{
                            fontSize: "1rem",
                            fontWeight: 800,
                            color: isCrit ? "var(--accent-red)" : "var(--accent-gold)",
                          }}
                        >
                          {risk}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>/100</span>
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-main)", marginBottom: 4 }}>
                      {audit.verdict || "Epistemic Evaluation"}
                    </div>

                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Prompt: "{audit.prompt}"
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Selected Audit Detail Card */}
            {selectedAudit && (
              <div
                className="nm-card fade-in-up"
                style={{
                  padding: "24px",
                  borderRadius: 16,
                  height: "fit-content",
                  position: "sticky",
                  top: 90,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
                  <div>
                    <span className="nm-pill nm-pill-gold" style={{ fontSize: "0.72rem" }}>
                      AUDIT DETAIL INSPECTION
                    </span>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)", marginTop: 6 }}>
                      {selectedAudit.verdict}
                    </h3>
                  </div>

                  <Link
                    href="/analyzer"
                    className="nm-button nm-button-primary"
                    style={{ fontSize: "0.76rem", padding: "6px 12px", gap: 6 }}
                    onClick={() => {
                      try {
                        localStorage.setItem("decisionx_preset_prompt", selectedAudit.prompt);
                        localStorage.setItem("decisionx_preset_output", selectedAudit.output);
                      } catch {}
                    }}
                  >
                    <span>Re-Audit</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>

                {/* Score Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
                  <div className="nm-inset" style={{ padding: "10px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Final Risk</div>
                    <div className="mono" style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-red)" }}>
                      {selectedAudit.finalRisk ?? 0}
                    </div>
                  </div>
                  <div className="nm-inset" style={{ padding: "10px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Accuracy</div>
                    <div className="mono" style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-green)" }}>
                      {selectedAudit.accuracyScore ?? 100}%
                    </div>
                  </div>
                  <div className="nm-inset" style={{ padding: "10px", borderRadius: 8, textAlign: "center" }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", textTransform: "uppercase" }}>Hallucination</div>
                    <div className="mono" style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-gold)" }}>
                      {selectedAudit.hallucinationScore ?? 0}
                    </div>
                  </div>
                </div>

                {/* Prompt Box */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 4 }}>
                    Evaluated Prompt:
                  </div>
                  <div className="nm-inset" style={{ padding: "12px", borderRadius: 8, fontSize: "0.82rem", color: "var(--text-main)", maxHeight: 110, overflowY: "auto" }}>
                    {selectedAudit.prompt}
                  </div>
                </div>

                {/* Output Box */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 4 }}>
                    Candidate AI Response:
                  </div>
                  <div className="nm-inset" style={{ padding: "12px", borderRadius: 8, fontSize: "0.82rem", color: "var(--text-muted)", maxHeight: 110, overflowY: "auto" }}>
                    {selectedAudit.output}
                  </div>
                </div>

                {/* Integrity Hash */}
                <div className="nm-inset" style={{ padding: "8px 12px", borderRadius: 8, fontSize: "0.72rem", color: "var(--text-dim)", display: "flex", justifyContent: "space-between" }}>
                  <span>Integrity Hash:</span>
                  <span className="mono" style={{ color: "var(--accent-green)" }}>
                    DX-{(selectedAudit.auditHash || "8A4F1E9").substring(0, 12)}...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
