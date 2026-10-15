/**
 * Frontend service for calling the /api/analyze endpoint
 */

const CACHE_STORAGE_KEY = "decisionx_analysis_cache_v16";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const DEFAULT_IMPACT_CHAIN = [
  "Core assumption stays unverified.",
  "Key dependency fails during execution.",
  "Timeline slips and risk increases.",
  "Outcome quality drops below target.",
];

export async function analyzeDecision(prompt, output) {
  const normalizedPrompt = String(prompt || "").trim();
  const normalizedOutput = String(output || "").trim();
  const cacheKey = buildCacheKey(normalizedPrompt, normalizedOutput);

  const cached = readCachedResult(cacheKey);
  if (cached) {
    return normalizeAnalysisResponse(cached);
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: normalizedPrompt, output: normalizedOutput }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to analyze decision");
  }

  const data = normalizeAnalysisResponse(await response.json());
  writeCachedResult(cacheKey, data);
  return data;
}

function buildCacheKey(prompt, output) {
  const source = `${prompt}\n\n${output}`;
  let hash = 5381;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 33) ^ source.charCodeAt(i);
  }
  return `k_${(hash >>> 0).toString(16)}`;
}

function readCachedResult(cacheKey) {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return null;

    const cache = JSON.parse(raw);
    const entry = cache?.[cacheKey];
    if (!entry) return null;

    const isExpired = Date.now() - Number(entry.timestamp || 0) > CACHE_TTL_MS;
    if (isExpired) {
      delete cache[cacheKey];
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
      return null;
    }

    return entry.data || null;
  } catch {
    return null;
  }
}

function writeCachedResult(cacheKey, data) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    const cache = raw ? JSON.parse(raw) : {};

    cache[cacheKey] = {
      timestamp: Date.now(),
      data: normalizeAnalysisResponse(data),
    };

    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache write failures and continue.
  }
}

function normalizeAnalysisResponse(data) {
  const source = data && typeof data === "object" ? data : {};
  const impact = normalizeImpactChain(source.impact);
  const alternatives = normalizeAlternatives(source.alternatives);
  const hallucinations = normalizeHallucinations(source.hallucinations);
  const explanation = normalizeBulletArray(source.explanation);
  const forecast = normalizeBulletArray(source.forecast);
  const severity = normalizeSeverity(source.severity);
  const promptIntent = normalizePromptIntent(source.promptIntent);
  const agents = normalizeAgents(source.agents);

  return {
    ...source,
    promptRisk: normalizeScore(source.promptRisk),
    biasScore: normalizeScore(source.biasScore),
    safetyScore: normalizeScore(source.safetyScore),
    accuracyScore: normalizeScore(source.accuracyScore),
    hallucinationScore: normalizeScore(source.hallucinationScore),
    finalRisk: normalizeScore(source.finalRisk),
    promptIntent,
    severity,
    agents,
    explanation,
    forecast,
    hallucinations,
    impact,
    alternatives,
  };
}

function normalizeScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function normalizeAgents(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    critic: normalizeAgentText(source.critic, "No critic output available yet."),
    optimist: normalizeAgentText(source.optimist, "No optimist output available yet."),
    realist: normalizeAgentText(source.realist, "No realist output available yet."),
  };
}

function normalizeAgentText(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeHallucinations(value) {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 8).map((item) => ({
    claim: String(item?.claim || "").trim(),
    status: normalizeHallucinationStatus(item?.status),
    confidence: normalizeConfidence(item?.confidence),
    evidence: Array.isArray(item?.evidence)
      ? item.evidence.slice(0, 3).map((e) => ({
          title: String(e?.title || "").trim(),
          snippet: String(e?.snippet || "").trim(),
          link: String(e?.link || "").trim(),
          score: normalizeConfidence(e?.score),
        }))
      : [],
  }));
}

function normalizeHallucinationStatus(value) {
  const status = String(value || "").toLowerCase();
  if (status === "verified" || status === "false" || status === "uncertain") return status;
  return "uncertain";
}

function normalizeConfidence(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(1, Number(num.toFixed(2))));
}

function normalizeSeverity(value) {
  const severity = String(value || "").toLowerCase();
  if (severity === "low" || severity === "medium" || severity === "high" || severity === "critical") {
    return severity;
  }
  return "medium";
}

function normalizePromptIntent(value) {
  const intent = String(value || "").toLowerCase();
  if (intent === "neutral" || intent === "biased" || intent === "misleading" || intent === "adversarial") {
    return intent;
  }
  return "neutral";
}

function normalizeAlternatives(alternatives) {
  const source = alternatives && typeof alternatives === "object" ? alternatives : {};
  const fallback = getFallbackAlternatives();

  const evidenceBased = normalizeConstrainedBullets(source.evidenceBased);
  const ethical = normalizeConstrainedBullets(source.ethical);
  const neutral = normalizeConstrainedBullets(source.neutral);

  return {
    evidenceBased: evidenceBased.length >= 3 ? evidenceBased : fallback.evidenceBased,
    ethical: ethical.length >= 3 ? ethical : fallback.ethical,
    neutral: neutral.length >= 3 ? neutral : fallback.neutral,
  };
}

function normalizeConstrainedBullets(value) {
  const cleaned = normalizeBulletArray(value)
    .filter((item) => isWordCountInRange(item, 8, 16))
    .slice(0, 5);

  return cleaned;
}

function isWordCountInRange(text, min, max) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.length >= min && words.length <= max;
}

function getFallbackAlternatives() {
  return {
    evidenceBased: [
      "Available evidence does not support broad claims about entire demographic groups.",
      "Replace categorical judgments with verifiable data, source citations, and contextual qualifiers.",
      "Present uncertainty explicitly when reliable evidence is missing or conflicting.",
    ],
    ethical: [
      "Use respectful, person-centered language that avoids stereotyping any protected or social group.",
      "Address behaviors or contexts, not identities, when discussing risks or limitations.",
      "Prioritize fairness, dignity, and harm prevention in all user-facing recommendations.",
    ],
    neutral: [
      "Describe observed facts, relevant context, and confidence level without emotional framing.",
      "Separate verified information from assumptions, and label unresolved points as uncertain.",
      "Offer balanced guidance that is specific, actionable, and proportionate to evidence.",
    ],
  };
}

function normalizeBulletArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || "").replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

function normalizeImpactChain(impact) {
  if (Array.isArray(impact)) {
    const cleaned = impact
      .map((step) => sanitizeImpactStep(step))
      .filter(Boolean)
      .slice(0, 6);

    if (cleaned.length > 0) {
      return cleaned;
    }
  }

  if (typeof impact === "string") {
    const fromText = impact
      .split(/\n+|(?:\s*[->→]\s*)/)
      .map((step) => sanitizeImpactStep(step))
      .filter(Boolean)
      .slice(0, 6);

    if (fromText.length > 0) {
      return fromText;
    }
  }

  return DEFAULT_IMPACT_CHAIN;
}

function sanitizeImpactStep(step) {
  const text = String(step || "").trim();
  if (!text) return "";

  const withoutBullet = text.replace(/^[-*•\s]+/, "").trim();
  const withoutLabel = withoutBullet
    .replace(/^step\s*\d+\s*[:.)-]?\s*/i, "")
    .replace(/^\d+\s*[:.)-]\s*/, "")
    .trim();

  if (!withoutLabel) return "";

  const isGenericPlaceholder = /^(step\s*)?\d+$/i.test(withoutBullet) || /^step$/i.test(withoutLabel);
  if (isGenericPlaceholder) return "";

  return withoutLabel;
}
