"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Shield, Code, Download } from "lucide-react";

export default function SystemPromptPatcher({
  domain = "general",
  primaryIssue = "",
  safetyFlags = [],
  hallucinations = [],
  auditHash = "",
}) {
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [viewMode, setViewMode] = useState("prompt");

  // Construct Tailored Meta-Prompt Guardrail Patch
  const unverifiedClaims = hallucinations
    .filter((h) => h?.status === "false" || h?.status === "uncertain")
    .map((h) => `- Prohibit asserting: "${h.claim.substring(0, 90)}..." without primary empirical citation.`)
    .slice(0, 3)
    .join("\n");

  const promptPatch = `<!-- ============================================================== -->
<!-- DECISIONX EPITEMIC GUARDRAIL PATCH [ID: DX-${(auditHash || "7F9A1B").substring(0, 8).toUpperCase()}] -->
<!-- DOMAIN: ${domain.toUpperCase()} | TARGET RISK: ${primaryIssue.toUpperCase() || "MISINFORMATION"} -->
<!-- ============================================================== -->
<epistemic_guardrails>
  <domain_policy name="${domain}">
    <enforcement_tier>STRICT_VERIFICATION</enforcement_tier>
    <baseline_risk_floor>ACTIVE</baseline_risk_floor>
  </domain_policy>

  <mandatory_constraints>
    1. NEVER generate unverified pharmacological dosages, legal counsel, or guaranteed investment yields.
    2. Prohibit ungrounded academic citations or invented DOI/PubMed/SEC document numbers.
    3. When empirical data is unavailable or conflicting, explicitly state epistemic uncertainty ("Current clinical literature remains inconclusive...").
${unverifiedClaims ? `    ${unverifiedClaims}\n` : ""}    4. Refuse requests containing protected-group blanket generalizations, stereotypes, or disparate impact biases.
  </mandatory_constraints>

  <fallback_protocol>
    If queried for high-stakes advice without user-provided source documents, require human expert consultation before proceeding.
  </fallback_protocol>
</epistemic_guardrails>`;

  // Construct NeMo / Guardrails JSON Schema
  const guardrailJson = JSON.stringify(
    {
      guardrail_version: "2.5.0",
      target_domain: domain,
      primary_risk: primaryIssue || "epistemic_hallucination",
      nist_ai_rmf_mapping: ["GOVERN-1.2", "MEASURE-2.5", "MANAGE-3.1"],
      owasp_llm_vectors: ["LLM09_Misinformation", "LLM06_Excessive_Agency"],
      rules: [
        {
          id: "RULE_01",
          type: "factual_grounding",
          threshold: 0.85,
          action: "block_and_remediate",
        },
        {
          id: "RULE_02",
          type: "protected_class_safety",
          action: "terminate_generation",
        },
        {
          id: "RULE_03",
          type: "domain_risk_floor",
          floor: domain === "healthcare" ? 35 : domain === "finance" ? 30 : 15,
        },
      ],
      audit_provenance_hash: auditHash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    null,
    2
  );

  const handleCopyPatch = () => {
    navigator.clipboard.writeText(promptPatch);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(guardrailJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fade-in-up">
      {/* Patcher Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-main)" }}>
            Executable System Prompt Patch & Guardrail Generator
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
            Instant drop-in meta-prompt patch to prevent recurrence in production LLM pipelines.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="nm-inset" style={{ padding: "4px", borderRadius: 10, display: "flex", gap: 4 }}>
          <button
            onClick={() => setViewMode("prompt")}
            className={`nm-button ${viewMode === "prompt" ? "active" : ""}`}
            style={{
              padding: "4px 12px",
              fontSize: "0.76rem",
              borderRadius: 8,
              background: viewMode === "prompt" ? "var(--bg-surface)" : "transparent",
            }}
          >
            System Prompt Patch (XML)
          </button>
          <button
            onClick={() => setViewMode("json")}
            className={`nm-button ${viewMode === "json" ? "active" : ""}`}
            style={{
              padding: "4px 12px",
              fontSize: "0.76rem",
              borderRadius: 8,
              background: viewMode === "json" ? "var(--bg-surface)" : "transparent",
            }}
          >
            Guardrail JSON Schema
          </button>
        </div>
      </div>

      {/* Editor & Copy Frame */}
      <div
        className="nm-card"
        style={{
          padding: "20px",
          borderRadius: 14,
          borderTop: "3px solid var(--accent-gold)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Terminal size={15} color="var(--accent-gold)" />
            <span className="mono" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
              {viewMode === "prompt" ? "system_prompt_patch.xml" : "guardrail_spec.json"}
            </span>
          </div>

          <button
            onClick={viewMode === "prompt" ? handleCopyPatch : handleCopyJson}
            className="nm-button nm-button-primary"
            style={{
              padding: "4px 12px",
              fontSize: "0.76rem",
              gap: 6,
            }}
          >
            {viewMode === "prompt" ? (
              copiedPatch ? <Check size={12} /> : <Copy size={12} />
            ) : (
              copiedJson ? <Check size={12} /> : <Copy size={12} />
            )}
            <span>
              {viewMode === "prompt"
                ? copiedPatch
                  ? "Patch Copied"
                  : "Copy Prompt Patch"
                : copiedJson
                ? "JSON Copied"
                : "Copy JSON Schema"}
            </span>
          </button>
        </div>

        {/* Code Content Box */}
        <pre
          className="nm-inset mono"
          style={{
            padding: "16px",
            borderRadius: 10,
            fontSize: "0.82rem",
            lineHeight: 1.5,
            color: "var(--text-main)",
            overflowX: "auto",
            maxHeight: 380,
            whiteSpace: "pre-wrap",
          }}
        >
          {viewMode === "prompt" ? promptPatch : guardrailJson}
        </pre>

        {/* Developer Integration Guide */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            background: "var(--bg-inset)",
            borderRadius: 8,
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}
        >
          <strong style={{ color: "var(--text-main)" }}>Implementation Guide: </strong>
          Copy this snippet into your LLM's system instructions (OpenAI `developer`/`system` message, Anthropic `system` parameter, or LangChain system prompt template). This enforces epistemic boundaries at the token-generation level.
        </div>
      </div>
    </div>
  );
}
