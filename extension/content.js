const PANEL_ID = "decisionx-risk-panel";
const PANEL_STYLE_ID = "decisionx-risk-style";
const ANALYZE_DEBOUNCE_MS = 2500;

let debounceTimer = null;
let lastHash = "";

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function ensureStyles() {
  if (document.getElementById(PANEL_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = PANEL_STYLE_ID;
  style.textContent = `
    #${PANEL_ID} {
      position: fixed;
      top: 16px;
      right: 16px;
      width: min(360px, calc(100vw - 32px));
      max-height: 60vh;
      overflow: auto;
      z-index: 2147483646;
      background: rgba(255, 255, 255, 0.98);
      color: #1f2937;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      padding: 12px;
      font: 13px/1.4 -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;
      pointer-events: auto;
    }
    #${PANEL_ID} .dx-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    #${PANEL_ID} .dx-subtitle {
      font-size: 11px;
      opacity: 0.75;
      margin-bottom: 10px;
    }
    #${PANEL_ID} .dx-row { margin-bottom: 6px; }
    #${PANEL_ID} .dx-section {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
    }
    #${PANEL_ID} .dx-section-title {
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    #${PANEL_ID} .dx-score-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
    }
    #${PANEL_ID} .dx-score-card {
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 8px;
      padding: 6px;
    }
    #${PANEL_ID} .dx-score-label {
      display: block;
      font-size: 11px;
      opacity: 0.75;
      margin-bottom: 2px;
    }
    #${PANEL_ID} .dx-score-value {
      font-weight: 700;
      font-size: 13px;
    }
    #${PANEL_ID} .dx-risk-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      font-weight: 700;
      color: #111827;
    }
    #${PANEL_ID}.dx-risk-low .dx-risk-pill { background: #86efac; }
    #${PANEL_ID}.dx-risk-medium .dx-risk-pill { background: #fde68a; }
    #${PANEL_ID}.dx-risk-high .dx-risk-pill { background: #fca5a5; }
    #${PANEL_ID} .dx-list {
      margin: 0;
      padding-left: 18px;
    }
    #${PANEL_ID} .dx-list li {
      margin: 0 0 4px;
    }
    #${PANEL_ID} .dx-agent-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 6px;
      margin-bottom: 6px;
      background: #ffffff;
    }
    #${PANEL_ID} .dx-agent-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 4px;
    }
    #${PANEL_ID} .dx-hallucination {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 6px;
      margin-bottom: 6px;
      background: #ffffff;
    }
    #${PANEL_ID} .dx-status {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 999px;
      margin-bottom: 4px;
      background: #e5e7eb;
    }
    #${PANEL_ID} .dx-status-verified { background: #86efac; }
    #${PANEL_ID} .dx-status-false { background: #fca5a5; }
    #${PANEL_ID} .dx-status-uncertain { background: #fde68a; }
    #${PANEL_ID} .dx-text {
      white-space: pre-wrap;
    }
    #${PANEL_ID} .dx-corrected {
      margin-top: 8px;
      padding: 8px;
      border-radius: 8px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      white-space: pre-wrap;
      max-height: 180px;
      overflow: auto;
    }
    #${PANEL_ID} .dx-flags {
      margin: 6px 0 0;
      padding-left: 16px;
    }
    #${PANEL_ID} .dx-muted {
      opacity: 0.75;
      font-size: 12px;
    }
    #${PANEL_ID} .dx-raw {
      margin-top: 8px;
    }
    #${PANEL_ID} .dx-raw summary {
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }
    #${PANEL_ID} .dx-raw pre {
      margin-top: 6px;
      padding: 8px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #f9fafb;
      overflow: auto;
      max-height: 220px;
      font-size: 11px;
      line-height: 1.35;
    }
  `;

  document.documentElement.appendChild(style);
}

function ensurePanel() {
  let panel = document.getElementById(PANEL_ID);
  if (panel) return panel;

  panel = document.createElement("aside");
  panel.id = PANEL_ID;
  panel.className = "dx-risk-low";
  panel.innerHTML = `
    <div class="dx-title">DecisionX Live Analysis</div>
    <div class="dx-row">Waiting for assistant response...</div>
  `;
  document.documentElement.appendChild(panel);
  return panel;
}

function getRiskClass(score) {
  if (score >= 75) return "dx-risk-high";
  if (score >= 35) return "dx-risk-medium";
  return "dx-risk-low";
}

function sanitize(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getLatestAssistantMessageText() {
  const selectors = [
    "article[data-testid^='conversation-turn-'] [data-message-author-role='assistant']",
    "[data-message-author-role='assistant']",
    "main article .markdown",
  ];

  for (const selector of selectors) {
    const nodes = Array.from(document.querySelectorAll(selector));
    if (nodes.length === 0) continue;

    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const text = nodes[i]?.innerText?.trim();
      if (text && text.length >= 5) {
        return text;
      }
    }
  }

  return "";
}

function renderLoading(message) {
  const panel = ensurePanel();
  panel.className = "dx-risk-low";
  panel.innerHTML = `
    <div class="dx-title">DecisionX Live Analysis</div>
    <div class="dx-subtitle">Full report mode</div>
    <div class="dx-row">${sanitize(message)}</div>
  `;
}

function normalizeScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function toBulletItems(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  const text = String(value || "").trim();
  if (!text) return [];

  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function readTextValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  if (value && typeof value === "object") {
    const nested = [
      value.text,
      value.content,
      value.value,
      value.correctedOutput,
      value.correctedText,
      value.corrected_output,
    ];

    for (const item of nested) {
      const candidate = readTextValue(item);
      if (candidate) return candidate;
    }
  }

  return "";
}

function unwrapAnalysisPayload(payload) {
  let current = payload && typeof payload === "object" ? payload : {};
  const wrapperKeys = ["data", "result", "results", "analysis", "report"];

  for (let depth = 0; depth < 4; depth += 1) {
    let next = null;

    for (const key of wrapperKeys) {
      if (current[key] && typeof current[key] === "object") {
        next = current[key];
        break;
      }
    }

    if (!next) break;
    current = next;
  }

  return current;
}

function renderBulletList(items) {
  if (!items.length) return '<div class="dx-muted">No details available.</div>';
  return `<ul class="dx-list">${items.map((item) => `<li>${sanitize(item)}</li>`).join("")}</ul>`;
}

function renderAgentCard(title, value) {
  const bullets = toBulletItems(value).slice(0, 8);
  return `
    <div class="dx-agent-card">
      <div class="dx-agent-title">${sanitize(title)}</div>
      ${renderBulletList(bullets)}
    </div>
  `;
}

function getStatusClass(status) {
  const value = String(status || "").toLowerCase();
  if (value === "verified" || value === "false" || value === "uncertain") {
    return `dx-status-${value}`;
  }
  return "dx-status-uncertain";
}

function renderResult(data) {
  const panel = ensurePanel();
  const source = unwrapAnalysisPayload(data);
  const finalRisk = normalizeScore(source?.finalRisk ?? source?.riskScore);
  const promptRisk = normalizeScore(source?.promptRisk);
  const hallucinationScore = normalizeScore(source?.hallucinationScore);
  const biasScore = normalizeScore(source?.biasScore);
  const safetyScore = normalizeScore(source?.safetyScore);
  const impactScore = normalizeScore(source?.impactScore);
  const domainRisk = normalizeScore(source?.domainRisk);

  const riskLabel = String(source?.riskLabel || "").trim() || "Unknown";
  const domain = String(source?.domain || "general").trim();
  const primaryIssue = String(source?.primaryIssue || "").trim();
  const verdict = String(source?.verdict || "").trim();
  const correctedText =
    readTextValue(source?.correctedOutput) ||
    readTextValue(source?.correctedText) ||
    readTextValue(source?.corrected_output);

  const agents = source?.agents && typeof source.agents === "object" ? source.agents : {};
  const hallucinations = Array.isArray(source?.hallucinations) ? source.hallucinations.slice(0, 6) : [];
  const impact = toBulletItems(source?.impact).slice(0, 8);

  const alternativesObj = source?.alternatives && typeof source.alternatives === "object" ? source.alternatives : {};
  const altEvidence = toBulletItems(alternativesObj?.evidenceBased).slice(0, 5);
  const altEthical = toBulletItems(alternativesObj?.ethical).slice(0, 5);
  const altNeutral = toBulletItems(alternativesObj?.neutral).slice(0, 5);

  const flags = Array.isArray(source?.flags)
    ? source.flags
    : Array.isArray(source?.safetyFlags)
      ? source.safetyFlags
      : [];

  panel.className = getRiskClass(finalRisk);
  panel.innerHTML = `
    <div class="dx-title">DecisionX Live Analysis</div>
    <div class="dx-subtitle">Full report mode</div>
    <div class="dx-row">Final Risk: <span class="dx-risk-pill">${finalRisk}</span> (${sanitize(riskLabel)})</div>
    <div class="dx-row">Domain: ${sanitize(domain)}</div>

    <div class="dx-section">
      <div class="dx-section-title">Scores</div>
      <div class="dx-score-grid">
        <div class="dx-score-card"><span class="dx-score-label">Prompt Risk</span><span class="dx-score-value">${promptRisk}</span></div>
        <div class="dx-score-card"><span class="dx-score-label">Bias Score</span><span class="dx-score-value">${biasScore}</span></div>
        <div class="dx-score-card"><span class="dx-score-label">Hallucination</span><span class="dx-score-value">${hallucinationScore}</span></div>
        <div class="dx-score-card"><span class="dx-score-label">Safety</span><span class="dx-score-value">${safetyScore}</span></div>
        <div class="dx-score-card"><span class="dx-score-label">Impact</span><span class="dx-score-value">${impactScore}</span></div>
        <div class="dx-score-card"><span class="dx-score-label">Domain Risk</span><span class="dx-score-value">${domainRisk}</span></div>
      </div>
    </div>

    ${primaryIssue || verdict
      ? `<div class="dx-section">
           <div class="dx-section-title">Headline</div>
           ${primaryIssue ? `<div class="dx-row"><strong>Primary issue:</strong> ${sanitize(primaryIssue)}</div>` : ""}
           ${verdict ? `<div class="dx-text">${sanitize(verdict)}</div>` : ""}
         </div>`
      : ""}

    <div class="dx-section">
      <div class="dx-section-title">Multi-Agent Review</div>
      ${renderAgentCard("Critic", agents?.critic)}
      ${renderAgentCard("Optimist", agents?.optimist)}
      ${renderAgentCard("Realist", agents?.realist)}
    </div>

    <div class="dx-section">
      <div class="dx-section-title">Hallucination Checks</div>
      ${hallucinations.length > 0
        ? hallucinations
            .map((item) => {
              const status = String(item?.status || "uncertain").toLowerCase();
              const claim = String(item?.claim || "").trim();
              return `
                <div class="dx-hallucination">
                  <div class="dx-status ${getStatusClass(status)}">${sanitize(status.toUpperCase())}</div>
                  <div class="dx-text">${sanitize(claim || "No claim text available.")}</div>
                </div>
              `;
            })
            .join("")
        : '<div class="dx-muted">No hallucination entries returned.</div>'}
    </div>

    <div class="dx-section">
      <div class="dx-section-title">Impact Chain</div>
      ${renderBulletList(impact)}
    </div>

    <div class="dx-section">
      <div class="dx-section-title">Alternatives</div>
      <div class="dx-row"><strong>Evidence-based</strong></div>
      ${renderBulletList(altEvidence)}
      <div class="dx-row"><strong>Ethical</strong></div>
      ${renderBulletList(altEthical)}
      <div class="dx-row"><strong>Neutral</strong></div>
      ${renderBulletList(altNeutral)}
    </div>

    ${flags.length > 0
      ? `<div class="dx-section"><div class="dx-section-title">Warnings</div><ul class="dx-flags">${flags
          .slice(0, 8)
          .map((f) => `<li>${sanitize(f)}</li>`)
          .join("")}</ul></div>`
      : ""}

    <div class="dx-section">
      <div class="dx-section-title">Corrected Output</div>
      ${correctedText
        ? `<div class="dx-corrected">${sanitize(correctedText.slice(0, 2400))}</div>`
        : '<div class="dx-muted">No correction available.</div>'}
    </div>

    <details class="dx-raw">
      <summary>Raw JSON</summary>
      <pre>${sanitize(JSON.stringify(source, null, 2))}</pre>
    </details>
  `;
}

function renderError(message) {
  const panel = ensurePanel();
  panel.className = "dx-risk-high";
  panel.innerHTML = `
    <div class="dx-title">DecisionX Live Analysis</div>
    <div class="dx-row">Analyzer error: ${sanitize(message)}</div>
    <div class="dx-row dx-muted">Check that the backend is running on localhost:3000 and the endpoint is /api/analyze.</div>
  `;
}

function analyzeLatestMessage() {
  const text = getLatestAssistantMessageText();
  if (!text) return;

  const nextHash = hashText(text);
  if (nextHash === lastHash) return;
  lastHash = nextHash;

  renderLoading("Analyzing latest assistant response...");

  chrome.runtime.sendMessage(
    {
      type: "DECISIONX_ANALYZE",
      text,
      apiUrl: "",
    },
    (response) => {
      if (chrome.runtime.lastError) {
        renderError(chrome.runtime.lastError.message || "Extension runtime error");
        return;
      }

      if (!response?.ok) {
        renderError(response?.error || "Unknown analyze error");
        return;
      }

      renderResult(response.data || {});
    }
  );
}

function scheduleAnalyze() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(analyzeLatestMessage, ANALYZE_DEBOUNCE_MS);
}

function initObserver() {
  ensureStyles();
  ensurePanel();

  const observer = new MutationObserver(() => {
    scheduleAnalyze();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  scheduleAnalyze();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initObserver);
} else {
  initObserver();
}
