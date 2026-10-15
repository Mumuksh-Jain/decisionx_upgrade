import Groq from "groq-sdk";
import {
  AGGREGATOR_PROMPT,
  ALTERNATE_OUTPUTS_PROMPT,
  CORRECTIVE_EDITOR_PROMPT,
} from "./prompts.js";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY environment variable is not set");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "openai/gpt-oss-120b";
const MODEL_FALLBACKS = [MODEL, "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
const ALT_TYPES = ["evidenceBased", "ethical", "neutral"];

/**
 * Call a single AI agent with a system prompt and the user's prompt+output pair.
 * @param {string} systemPrompt - The agent's role/instructions
 * @param {string} userPrompt - The original user prompt being analyzed
 * @param {string} aiOutput - The AI-generated output being analyzed
 * @returns {string} The agent's analysis text
 */
export async function callAgent(systemPrompt, userPrompt, aiOutput) {
  const analysisInput = `${systemPrompt}\n\nUSER PROMPT:\n"${userPrompt}"\n\nAI OUTPUT:\n"${aiOutput}"`;

  const completion = await createCompletionWithFallback({
    models: MODEL_FALLBACKS,
    max_tokens: 1000,
    temperature: 0,
    seed: 42,
    messages: [
      {
        role: "user",
        content: analysisInput,
      },
    ],
  });

  if (!completion) {
    return fallbackAgentAnalysis(systemPrompt, userPrompt, aiOutput);
  }

  const raw = completion.choices?.[0]?.message?.content || "";
  return normalizeAgentBullets(raw);
}

/**
 * Aggregate all agent outputs into a structured diagnostic report.
 * @returns {Object} Parsed JSON with scores, hallucinations, impact, correctedOutput
 */
export async function analyzeAgentOutputs(critic, optimist, realist, userPrompt, aiOutput) {
  const aggregatorInput = `${AGGREGATOR_PROMPT}

ORIGINAL USER PROMPT:
"${userPrompt}"

AI OUTPUT BEING ANALYZED:
"${aiOutput}"

CRITIC'S ANALYSIS:
${critic}

OPTIMIST'S ANALYSIS:
${optimist}

REALIST'S ANALYSIS:
${realist}`;

  const completion = await createCompletionWithFallback({
    models: MODEL_FALLBACKS,
    max_tokens: 1500,
    temperature: 0,
    seed: 42,
    messages: [
      {
        role: "user",
        content: aggregatorInput,
      },
    ],
  });

  if (!completion) {
    return fallbackAggregator(userPrompt, aiOutput);
  }

  const text = completion.choices?.[0]?.message?.content || "";
  console.log("Raw aggregator response:", text);

  try {
    const parsed = JSON.parse(text);
    console.log("Parsed JSON:", parsed);
    return validateAggregatorResult(parsed, userPrompt, aiOutput, text);
  } catch {
    // Try to extract JSON from the response if it has extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("Parsed JSON:", parsed);
        return validateAggregatorResult(parsed, userPrompt, aiOutput, text);
      } catch (error) {
        console.error("Failed to parse extracted JSON:", error?.message || error);
      }
    }
    console.error("Failed to parse JSON. Raw response:", text);
    return fallbackAggregator(userPrompt, aiOutput);
  }
}

export async function generateCorrectedOutput({
  originalPrompt,
  badOutput,
  hallucinations,
  criticPoints,
  realistPoints,
  finalRiskScore,
}) {
  const hallucinationList = formatHallucinationList(hallucinations);
  const criticText = normalizeFeedbackText(criticPoints);
  const realistText = normalizeFeedbackText(realistPoints);
  const riskScore = Number.isFinite(Number(finalRiskScore))
    ? Math.round(Number(finalRiskScore))
    : 0;

  const editorInput = `${CORRECTIVE_EDITOR_PROMPT}

ORIGINAL PROMPT: ${String(originalPrompt || "")}

BAD OUTPUT: ${String(badOutput || "")}

HALLUCINATIONS DETECTED: ${hallucinationList}

CRITIC FEEDBACK: ${criticText}

REALIST FEEDBACK: ${realistText}

RISK SCORE: ${riskScore}

Now write the corrected output.`;

  const completion = await createCompletionWithFallback({
    models: MODEL_FALLBACKS,
    max_tokens: 1500,
    temperature: 0,
    seed: 42,
    messages: [
      {
        role: "user",
        content: editorInput,
      },
    ],
  });

  if (!completion) {
    return normalizeCorrectedBullets(
      "Use only verifiable claims, avoid stereotypes, and state uncertainty clearly."
    );
  }

  const raw = String(completion.choices?.[0]?.message?.content || "").trim();
  return normalizeCorrectedBullets(raw);
}

export async function generateAlternateOutputs({
  prompt,
  originalOutput,
  hallucinations,
  criticAnalysis,
  realistAnalysis,
}) {
  const input = `${ALTERNATE_OUTPUTS_PROMPT}

INPUT:
${JSON.stringify(
    {
      prompt: String(prompt || ""),
      originalOutput: String(originalOutput || ""),
      hallucinations: Array.isArray(hallucinations) ? hallucinations : [],
      criticAnalysis: String(criticAnalysis || ""),
      realistAnalysis: String(realistAnalysis || ""),
    },
    null,
    2
  )}`;

  try {
    const completion = await createCompletionWithFallback({
      models: MODEL_FALLBACKS,
      max_tokens: 1500,
      temperature: 0,
      seed: 42,
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    if (!completion) {
      return fallbackAlternatives({
        prompt,
        originalOutput,
        hallucinations,
        criticAnalysis,
        realistAnalysis,
      });
    }

    const raw = String(completion.choices?.[0]?.message?.content || "");
    const parsed = parseJsonObject(raw);
    return normalizeAlternatives(parsed?.alternatives, {
      prompt,
      originalOutput,
      hallucinations,
      criticAnalysis,
      realistAnalysis,
    });
  } catch (error) {
    console.error("Alternate outputs generation failed:", error?.message || error);
    return fallbackAlternatives({
      prompt,
      originalOutput,
      hallucinations,
      criticAnalysis,
      realistAnalysis,
    });
  }
}

function formatHallucinationList(hallucinations) {
  if (!Array.isArray(hallucinations) || hallucinations.length === 0) {
    return "none";
  }

  const flagged = hallucinations.filter(
    (item) => item?.status === "false" || item?.status === "uncertain"
  );

  if (flagged.length === 0) {
    return "none";
  }

  return flagged
    .map((item, index) => {
      const claim = String(item?.claim || "").trim();
      const status = String(item?.status || "uncertain").trim().toLowerCase();
      return `${index + 1}. [${status}] ${claim}`;
    })
    .join("\n");
}

function normalizeFeedbackText(feedback) {
  const text = String(feedback || "").trim();
  return text || "none";
}

function fallbackAgentAnalysis(systemPrompt, userPrompt, aiOutput) {
  const roleText = String(systemPrompt || "").toLowerCase();
  const promptText = String(userPrompt || "").toLowerCase();
  const outputText = String(aiOutput || "").toLowerCase();
  const combined = `${promptText}\n${outputText}`;

  const protectedTerms = [
    "women", "woman", "men", "man", "muslim", "muslims", "christian", "christians",
    "jewish", "jews", "hindu", "hindus", "black", "white", "asian", "latino",
  ];
  const negativeTerms = [
    "bad", "scary", "dangerous", "cruel", "mean", "hateful", "inferior", "not good",
  ];

  const hasProtected = protectedTerms.some((term) =>
    new RegExp(`\\b${escapeRegExp(term)}\\b`, "i").test(combined)
  );
  const hasNegative = negativeTerms.some((term) => combined.includes(term));
  const hasLikelyBias = hasProtected && hasNegative;
  const hasSafetyRefusal =
    /harmful|should\s+not\s+be\s+generalized|avoid\s+stereotypes?/i.test(outputText);

  if (roleText.includes("critic")) {
    const bullets = [
      hasLikelyBias
        ? "Detected harmful group generalization language that raises clear safety concerns."
        : "No direct harmful stereotype pattern is obvious from this fallback review.",
      "Provider was rate-limited, so this is a heuristic fallback perspective.",
    ];
    return bullets.map((line) => `- ${line}`).join("\n");
  }

  if (roleText.includes("optimist")) {
    const bullets = [
      hasSafetyRefusal
        ? "Output includes refusal framing that avoids endorsing harmful generalizations."
        : "Output remains concise and easy to inspect despite incomplete model review.",
      "Provider was rate-limited, so this is a heuristic fallback perspective.",
    ];
    return bullets.map((line) => `- ${line}`).join("\n");
  }

  const bullets = [
    hasLikelyBias
      ? "Given the wording, practical risk is high and action is unsafe."
      : "Risk appears moderate from fallback checks, but full model review is recommended.",
    "Provider was rate-limited, so this is a heuristic fallback perspective.",
  ];
  return bullets.map((line) => `- ${line}`).join("\n");
}

function normalizeAgentBullets(text) {
  const rawLines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^#{1,6}\s/.test(line));

  let bullets = rawLines
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (bullets.length === 0) {
    bullets = String(text || "")
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const concise = bullets
    .slice(0, 3)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .map((line) => cleanBulletArtifacts(line))
    .map((line) => toCompleteConciseSentence(line, 8, 14))
    .filter(Boolean);

  return concise.map((line) => `- ${line}`).join("\n");
}

function toCompleteConciseSentence(line, minWords, maxWords) {
  const words = String(line || "")
    .replace(/[-*•]/g, " ")
    .replace(/[^\w\s"',.:;\-?!()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "";
  if (words.length < minWords) {
    const filler = [
      "This",
      "needs",
      "evidence",
      "for",
      "a",
      "reliable",
      "user",
      "decision",
    ];
    const filled = [...words];
    for (let i = 0; i < filler.length && filled.length < minWords; i += 1) {
      filled.push(filler[i]);
    }
    return ensureSentenceEnding(filled.join(" "));
  }

  if (words.length <= maxWords) return ensureSentenceEnding(words.join(" "));
  return ensureSentenceEnding(words.slice(0, maxWords).join(" "));
}

function ensureSentenceEnding(text) {
  const clean = String(text || "").trim();
  if (!clean) return "";
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function cleanBulletArtifacts(text) {
  let line = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  // Remove dangling adverbs commonly produced as low-quality sentence endings.
  line = line.replace(/\s(always|sometimes|often)\.?$/i, "");
  return line.trim();
}

function normalizeCorrectedBullets(text) {
  const rawLines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let bullets = rawLines
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (bullets.length === 0) {
    bullets = String(text || "")
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return uniqueNormalized(bullets)
    .slice(0, 6)
    .map((line) => toCompleteConciseSentence(line, 8, 16))
    .filter(Boolean)
    .map((line) => `- ${line}`)
    .join("\n");
}

function parseJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return {};
    try {
      return JSON.parse(match[0]);
    } catch {
      return {};
    }
  }
}

function normalizeAlternatives(alternatives, context) {
  const source = alternatives && typeof alternatives === "object" ? alternatives : {};

  const normalized = ALT_TYPES.reduce((acc, type) => {
    const candidate = Array.isArray(source[type]) ? source[type] : [];
    const cleaned = uniqueNormalized(
      candidate
      .map((item) => sanitizeAlternativeBullet(item, context?.originalOutput))
      .filter(Boolean)
    );

    let bounded = cleaned.slice(0, 5);
    if (bounded.length < 3) {
      const fallback = fallbackAlternatives(context).alternatives[type];
      bounded = [...bounded, ...fallback].slice(0, 5);
    }

    if (bounded.length > 5) {
      bounded = bounded.slice(0, 5);
    }

    if (bounded.length < 3) {
      bounded = fallbackAlternatives(context).alternatives[type].slice(0, 3);
    }

    acc[type] = bounded;
    return acc;
  }, {});

  return { alternatives: normalized };
}

function sanitizeAlternativeBullet(text, originalOutput) {
  const line = String(text || "")
    .replace(/^[-*•]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!line) return "";

  let candidate = line;
  if (isLikelyCopiedFromOriginal(candidate, originalOutput)) {
    candidate = `Revise content with validated details and explicit limits on uncertainty.`;
  }

  candidate = removeUnsafePhrases(candidate);
  return enforceWordCount(candidate, 8, 16);
}

function enforceWordCount(text, minWords, maxWords) {
  const words = String(text || "")
    .replace(/[^\w\s"',.:;\-?!()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "";

  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ");
  }

  if (words.length < minWords) {
    const filler = ["with", "clear", "scope", "and", "verifiable", "context"];
    const out = [...words];
    for (let i = 0; i < filler.length && out.length < minWords; i += 1) {
      out.push(filler[i]);
    }
    return out.join(" ");
  }

  return words.join(" ");
}

function isLikelyCopiedFromOriginal(line, originalOutput) {
  const source = String(originalOutput || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  const target = String(line || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (!source || !target) return false;
  return source.includes(target) || target.includes(source.slice(0, Math.min(48, source.length)));
}

function removeUnsafePhrases(text) {
  const banned = [
    /\ball\s+people\b/gi,
    /\bevery\s+group\b/gi,
    /\bthose\s+people\b/gi,
    /\binherently\b/gi,
    /\binferior\b/gi,
    /\bsuperior\b/gi,
  ];

  return banned.reduce((acc, pattern) => acc.replace(pattern, "specific stakeholders"), String(text || ""));
}

function fallbackAlternatives({ hallucinations, criticAnalysis, realistAnalysis }) {
  const flaggedClaims = Array.isArray(hallucinations)
    ? hallucinations
        .filter((item) => item?.status === "false" || item?.status === "uncertain")
        .map((item) => String(item?.claim || "").trim())
        .filter(Boolean)
        .slice(0, 2)
    : [];

  const keyRisk = [criticAnalysis, realistAnalysis]
    .map((item) => String(item || "").replace(/^[-*•]\s*/gm, "").trim())
    .filter(Boolean)
    .join(" ")
    .slice(0, 180);

  const claimPhrase = flaggedClaims.length > 0 ? `Address disputed claims: ${flaggedClaims.join("; ")}` : "Address disputed claims with verifiable, source-backed statements only";
  const riskPhrase = keyRisk
    ? `Incorporate risk signals from critiques without overstating certainty`
    : "Incorporate practical constraints and confidence limits for each recommendation";

  return {
    alternatives: {
      evidenceBased: uniqueNormalized([
        enforceWordCount("State only verifiable facts and remove unsupported numerical or historical assertions", 8, 16),
        enforceWordCount(claimPhrase, 8, 16),
        enforceWordCount("Mark uncertain points explicitly and avoid speculation presented as confirmed evidence", 8, 16),
      ]),
      ethical: uniqueNormalized([
        enforceWordCount("Use neutral wording that avoids stereotypes, blame, and harmful group generalizations", 8, 16),
        enforceWordCount("Present impacts across stakeholders fairly with inclusive and respectful framing", 8, 16),
        enforceWordCount("Replace charged phrasing with responsible language focused on concrete actions", 8, 16),
      ]),
      neutral: uniqueNormalized([
        enforceWordCount("Summarize key points with objective language and clearly bounded confidence", 8, 16),
        enforceWordCount(riskPhrase, 8, 16),
        enforceWordCount("Provide concise next steps supported by available evidence and practical constraints", 8, 16),
      ]),
    },
  };
}

function uniqueNormalized(items) {
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    const text = String(item || "").trim();
    if (!text) return;

    const key = text
      .toLowerCase()
      .replace(/[^\w\s']/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(text);
  });

  return result;
}

function fallbackAggregator(userPrompt, aiOutput) {
  const promptText = String(userPrompt || "").toLowerCase();
  const outputText = String(aiOutput || "").toLowerCase();
  const combined = `${promptText}\n${outputText}`;

  const protectedTerms = [
    "women", "woman", "men", "man", "girls", "boys", "muslim", "muslims",
    "christian", "christians", "jewish", "jews", "hindu", "hindus", "black",
    "white", "asian", "latino", "immigrant", "refugee", "disabled", "elderly",
  ];
  const negativeTerms = [
    "bad", "cruel", "mean", "toxic", "hateful", "heartless", "inferior",
    "dangerous", "stupid", "lazy", "violent", "criminal", "not good", "worse",
  ];
  const absolutists = ["all", "always", "never", "none", "every", "only"];

  const hasProtected = protectedTerms.some((term) =>
    new RegExp(`\\b${escapeRegExp(term)}\\b`, "i").test(combined)
  );
  const hasNegative = negativeTerms.some((term) => combined.includes(term));
  const hasAbsolute = absolutists.some((term) =>
    new RegExp(`\\b${escapeRegExp(term)}\\b`, "i").test(combined)
  );

  let promptRisk = 15;
  let biasScore = 12;

  if (hasProtected) {
    promptRisk = Math.max(promptRisk, 35);
    biasScore = Math.max(biasScore, 30);
  }

  if (hasProtected && hasNegative) {
    promptRisk = Math.max(promptRisk, 70);
    biasScore = Math.max(biasScore, 75);
  }

  if (hasProtected && hasAbsolute) {
    promptRisk = Math.max(promptRisk, 60);
    biasScore = Math.max(biasScore, 65);
  }

  return {
    promptRisk,
    biasScore,
    hallucinationScore: hasNegative ? 65 : 40,
    finalRisk: Math.max(promptRisk, biasScore, hasNegative ? 75 : 45),
    hallucinations: [],
    impact: "Provider quota temporarily limited full aggregation.",
    correctedOutput: "",
  };
}

function validateAggregatorResult(parsed, userPrompt, aiOutput, rawText) {
  const fallback = fallbackAggregator(userPrompt, aiOutput);
  const source = parsed && typeof parsed === "object" ? parsed : {};

  const promptRisk = coerceScore(source.promptRisk, fallback.promptRisk);
  const biasScore = coerceScore(source.biasScore, fallback.biasScore);
  const hallucinationScore = coerceScore(
    source.hallucinationScore,
    fallback.hallucinationScore
  );
  const finalRisk = coerceScore(source.finalRisk, fallback.finalRisk);

  const hallucinations = normalizeHallucinations(source.hallucinations);
  const impact = normalizeImpact(source.impact, fallback.impact);
  const correctedOutput =
    typeof source.correctedOutput === "string" && source.correctedOutput.trim()
      ? source.correctedOutput.trim()
      : fallback.correctedOutput;

  const requiredKeysPresent =
    Object.prototype.hasOwnProperty.call(source, "promptRisk") &&
    Object.prototype.hasOwnProperty.call(source, "biasScore") &&
    Object.prototype.hasOwnProperty.call(source, "hallucinationScore") &&
    Object.prototype.hasOwnProperty.call(source, "finalRisk");

  if (!requiredKeysPresent) {
    console.warn("Aggregator JSON missing required score keys, using safe defaults.");
    console.warn("Raw aggregator response:", rawText);
  }

  return {
    promptRisk,
    biasScore,
    hallucinationScore,
    finalRisk,
    hallucinations,
    impact,
    correctedOutput,
  };
}

function coerceScore(value, fallback) {
  if (value === null || typeof value === "undefined") return clampScore(fallback);

  if (typeof value === "number") {
    return clampScore(value);
  }

  const asText = String(value).trim();
  const numeric = Number.parseFloat(asText.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric)) return clampScore(fallback);
  return clampScore(numeric);
}

function clampScore(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function normalizeHallucinations(value) {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 8)
    .map((item) => ({
      claim: String(item?.claim || "").trim(),
      status: normalizeHallucinationStatus(item?.status),
    }))
    .filter((item) => item.claim.length > 0);
}

function normalizeHallucinationStatus(value) {
  const status = String(value || "").toLowerCase();
  if (status === "verified" || status === "false" || status === "uncertain") {
    return status;
  }
  return "uncertain";
}

function normalizeImpact(value, fallbackImpactText) {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => sanitizeImpactStep(item))
      .filter(Boolean)
      .slice(0, 4);

    if (cleaned.length > 0) return cleaned;
  }

  if (typeof fallbackImpactText === "string" && fallbackImpactText.trim()) {
    return [fallbackImpactText.trim()];
  }

  return [];
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

function escapeRegExp(text) {
  return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function createCompletionWithFallback({ models, max_tokens, temperature, seed, messages }) {
  const modelList = Array.isArray(models) && models.length > 0 ? models : [MODEL];
  let lastError = null;

  for (const model of modelList) {
    try {
      return await groq.chat.completions.create({
        model,
        max_tokens,
        temperature,
        seed,
        messages,
      });
    } catch (error) {
      if (isRateLimitError(error) || isModelUnavailableError(error)) {
        console.warn(`Groq error for model ${model}. Attempting fallback.`);
        lastError = error;
        continue;
      }

      lastError = error;
      break;
    }
  }

  if (lastError) {
    console.warn("All Groq models failed. Returning null.");
  }

  return null;
}

function isRateLimitError(error) {
  const status = Number(error?.status || error?.response?.status || 0);
  const code = String(error?.error?.code || error?.code || "").toLowerCase();
  const message = String(error?.error?.message || error?.message || "").toLowerCase();
  return status === 429 || code === "rate_limit_exceeded" || message.includes("rate limit");
}

function isModelUnavailableError(error) {
  const status = Number(error?.status || error?.response?.status || 0);
  const code = String(error?.error?.code || error?.code || "").toLowerCase();
  const message = String(error?.error?.message || error?.message || "").toLowerCase();

  if (status === 404) return true;
  if (code.includes("model")) return true;
  return message.includes("model") && message.includes("not found");
}

function parseRetryAfterMs(error) {
  const retryHeader =
    error?.headers?.["retry-after"] ||
    error?.response?.headers?.["retry-after"] ||
    error?.error?.headers?.["retry-after"];
  const retryAsNumber = Number(retryHeader);
  if (Number.isFinite(retryAsNumber) && retryAsNumber > 0) {
    return Math.round(retryAsNumber * 1000);
  }

  const message = String(error?.error?.message || error?.message || "");
  const match = message.match(/try again in\s+((?:\d+m)?(?:\d+(?:\.\d+)?s)?)/i);

  if (!match?.[1]) {
    return 30 * 1000;
  }

  const duration = String(match[1]);
  const minutesMatch = duration.match(/(\d+)m/i);
  const secondsMatch = duration.match(/(\d+(?:\.\d+)?)s/i);
  const minutesMs = minutesMatch ? Number(minutesMatch[1]) * 60 * 1000 : 0;
  const secondsMs = secondsMatch ? Number(secondsMatch[1]) * 1000 : 0;
  const total = Math.round(minutesMs + secondsMs);

  return total > 0 ? total : 30 * 1000;
}
