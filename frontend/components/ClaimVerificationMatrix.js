"use client";

import { CheckCircle2, XCircle, AlertTriangle, ExternalLink, Search } from "lucide-react";

export default function ClaimVerificationMatrix({ hallucinations = [] }) {
  if (!Array.isArray(hallucinations) || hallucinations.length === 0) {
    return (
      <div className="nm-inset" style={{ padding: "24px", textAlign: "center", borderRadius: 12 }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          No atomic claims extracted from this output. Output may be entirely subjective or conversational.
        </p>
      </div>
    );
  }

  const verifiedCount = hallucinations.filter((h) => h?.status === "verified").length;
  const falseCount = hallucinations.filter((h) => h?.status === "false").length;
  const uncertainCount = hallucinations.filter((h) => h?.status === "uncertain").length;

  return (
    <div className="fade-in-up">
      {/* Summary Chips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
            Atomic Claim Verification & Empirical Grounding Matrix
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
            Natural Language Inference (NLI) proposition isolation backed by Tavily search retrieval.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <span className="nm-pill nm-pill-green">
            <CheckCircle2 size={13} /> {verifiedCount} Verified
          </span>
          {falseCount > 0 && (
            <span className="nm-pill nm-pill-red">
              <XCircle size={13} /> {falseCount} False
            </span>
          )}
          {uncertainCount > 0 && (
            <span className="nm-pill nm-pill-gold">
              <AlertTriangle size={13} /> {uncertainCount} Uncertain
            </span>
          )}
        </div>
      </div>

      {/* Claims List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {hallucinations.map((item, index) => {
          const status = String(item?.status || "uncertain").toLowerCase();
          const confidence = Number(item?.confidence ?? 0.5);
          const evidenceList = Array.isArray(item?.evidence) ? item.evidence : [];

          const statusColor =
            status === "verified"
              ? "var(--accent-green)"
              : status === "false"
              ? "var(--accent-red)"
              : "var(--accent-gold)";

          const StatusIcon =
            status === "verified"
              ? CheckCircle2
              : status === "false"
              ? XCircle
              : AlertTriangle;

          return (
            <div
              key={index}
              className="nm-card"
              style={{
                padding: "18px 20px",
                borderRadius: 12,
                borderLeft: `4px solid ${statusColor}`,
              }}
            >
              {/* Header row: Claim index + status pill + confidence */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      color: "var(--text-dim)",
                      padding: "2px 6px",
                      background: "var(--bg-inset)",
                      borderRadius: 6,
                    }}
                  >
                    CLAIM #{index + 1}
                  </span>
                  <span
                    className={`nm-pill ${
                      status === "verified"
                        ? "nm-pill-green"
                        : status === "false"
                        ? "nm-pill-red"
                        : "nm-pill-gold"
                    }`}
                  >
                    <StatusIcon size={12} />
                    <span style={{ textTransform: "uppercase" }}>{status}</span>
                  </span>
                </div>

                <div className="mono" style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                  Calibration Confidence:{" "}
                  <strong style={{ color: "var(--text-main)" }}>
                    {Math.round(confidence * 100)}%
                  </strong>
                </div>
              </div>

              {/* The Claim Text */}
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  lineHeight: 1.5,
                  marginBottom: evidenceList.length > 0 || item?.reason ? 14 : 0,
                }}
              >
                "{item?.claim}"
              </div>

              {/* Grounding Rationale / Reason */}
              {item?.reason && (
                <div
                  className="nm-inset"
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    marginBottom: evidenceList.length > 0 ? 12 : 0,
                  }}
                >
                  <strong style={{ color: "var(--text-main)" }}>Audit Note: </strong>
                  {item.reason === "safety_refusal"
                    ? "Model appropriately refused to generate dangerous content."
                    : item.reason === "unsupported_generalization"
                    ? "Flagged as an unsupported blanket stereotype regarding a protected group."
                    : item.reason === "insufficient_evidence"
                    ? "Web retrieval returned insufficient authoritative evidence to corroborate this assertion."
                    : item.reason}
                </div>
              )}

              {/* Retrieved Sources & Citations */}
              {evidenceList.length > 0 && (
                <div
                  style={{
                    borderTop: "1px solid var(--border-subtle)",
                    paddingTop: 12,
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: "var(--accent-blue)",
                      marginBottom: 8,
                    }}
                  >
                    <Search size={12} />
                    <span>Tavily Grounding Evidence & Citations</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {evidenceList.map((ev, evIdx) => (
                      <div
                        key={evIdx}
                        className="nm-inset"
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          fontSize: "0.82rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            {ev?.title || "Web Citation Reference"}
                          </span>
                          {ev?.link && (
                            <a
                              href={ev.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="nm-button"
                              style={{
                                padding: "2px 8px",
                                fontSize: "0.72rem",
                                gap: 4,
                              }}
                            >
                              <span>Source</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        {ev?.snippet && (
                          <p
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.78rem",
                              lineHeight: 1.4,
                              fontStyle: "italic",
                            }}
                          >
                            "{ev.snippet}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
