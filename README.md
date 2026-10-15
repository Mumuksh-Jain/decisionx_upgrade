# DecisionX

DecisionX is a Next.js multi-agent diagnostics app that reviews an AI output against a user prompt.

It combines three analysis agents, retrieval-backed claim checks, deterministic scoring formulas, and report generation in a single flow.

## Core Capabilities

- Parallel agent perspectives: Critic, Optimist, Realist.
- Structured risk scoring: prompt, bias, safety, accuracy, hallucination, final risk.
- Hallucination review with per-claim labels: verified, false, uncertain.
- Safety flagging for protected-group harmful generalizations.
- Corrected output generation plus three alternate output styles.
- On-screen score explanation panel and downloadable PDF report.

## Tech Stack

- Next.js 16.2.3 (App Router)
- React 19.2.4
- Groq SDK
- Tavily API (optional but recommended for evidence retrieval)
- CSS Modules
- jsPDF + html2canvas for report export

## Routes

- /: home
- /analyzer: run diagnostics
- /history: browser-local analysis history
- /about: system and architecture page
- /api/analyze: POST analysis endpoint

## Environment Variables

Create .env.local in project root:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

Notes:

- GROQ_API_KEY is required for analysis.
- TAVILY_API_KEY enables retrieval-backed claim checking; without it, claim checks degrade to uncertain more often.

## Install and Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

- npm run dev: start local development server
- npm run build: production build
- npm run start: run production server
- npm run lint: run ESLint

## Current Project Structure

```text
decisionx/
├── app/
│   ├── about/page.js
│   ├── analyzer/page.js
│   ├── history/page.js
│   ├── api/analyze/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── backend/
│   ├── api/route.js
│   └── lib/
│       ├── analyze.js
│       ├── groq.js
│       └── prompts.js
├── frontend/
│   ├── components/
│   │   ├── AnalysisModal.js
│   │   ├── FailureMap.js
│   │   ├── MultiAgentPanel.js
│   │   ├── OutputAnalyzer.js
│   │   ├── PromptAnalyzer.js
│   │   ├── ReportPanel.js
│   │   ├── RiskDashboard.js
│   │   └── shared/
│   │       ├── Footer.js
│   │       ├── Sidebar.js
│   │       └── TopNav.js
│   ├── pages/
│   └── services/
│       └── analyzeService.js
├── public/
├── jsconfig.json
├── package.json
└── README.md
```

## Path Aliases

Defined in jsconfig.json:

- @/* -> ./frontend/*
- @/components/* -> ./frontend/components/*
- @/services/* -> ./frontend/services/*
- @/utils/* -> ./frontend/utils/*
- @/backend/* -> ./backend/*

Important note:

- Because @/* maps to frontend, app and backend imports should use explicit aliases like @/backend/* where needed.

## Analysis Pipeline

1. User submits prompt and output from /analyzer.
2. frontend/services/analyzeService.js posts to /api/analyze.
3. app/api/analyze/route.js validates request and calls runFullAnalysis.
4. backend/lib/analyze.js orchestrates scoring + fact-checking.
5. backend/lib/groq.js runs agent, aggregator, correction, and alternate-output calls.
6. Results are normalized, cached, and returned to the modal dashboard.

## Scoring System (Current)

All score fields are clamped to 0-100 integers.

- domain:
  Detected domain from prompt/output (healthcare, legal, finance, cybersecurity, general).
- domainRisk:
  Domain-aware baseline risk. High-stakes domains keep a non-trivial floor.
- promptRisk:
  Computed from prompt-only harmful generalization severity. It is intentionally decoupled from output changes.
- biasScore:
  Derived from multi-agent aggregation plus heuristic bias signals.
- safetyScore:
  Derived from structured safety evaluation plus heuristic safety flags.
- accuracyScore:
  Computed from claim labels: verified=100, uncertain=60, false=0.
- hallucinationScore:
  Confidence-weighted risk from claim labels.
- impactScore:
  Severity estimate of failure-chain impact language.
- finalRisk:
  Explainable weighted score combining domain, inaccuracy, hallucination, impact, safety, bias, prompt framing, and uncertainty.

Risk labels in UI:

- finalRisk < 35: 🟢 Safe
- finalRisk 35-74: 🟡 Risky
- finalRisk >= 75: 🔴 Dangerous

Final risk formula:

$$
  ext{finalRisk} = 0.25\cdot\text{domainRisk} + 0.2\cdot\text{inaccuracyRisk} + 0.2\cdot\text{hallucinationScore} + 0.1\cdot\text{impactScore} + 0.15\cdot\text{safetyScore} + 0.05\cdot\text{biasScore} + 0.05\cdot\text{promptRisk} + 0.05\cdot\text{uncertaintyScore} + \text{consistencyPenalty}
$$

## API Contract

### POST /api/analyze

Request:

```json
{
  "prompt": "User prompt text",
  "output": "AI output text"
}
```

Validation:

- prompt must be a string with length >= 5
- output must be a string with length >= 5
- GROQ_API_KEY must be configured

Response shape:

```json
{
  "domain": "healthcare",
  "domainRisk": 72,
  "promptRisk": 0,
  "biasScore": 0,
  "safetyScore": 0,
  "accuracyScore": 0,
  "hallucinationScore": 0,
  "impactScore": 0,
  "finalRisk": 0,
  "riskLabel": "risky",
  "verdict": "This response is misleading and may cause harm.",
  "primaryIssue": "Inaccurate Information",
  "promptIntent": "neutral",
  "severity": "low",
  "agents": {
    "critic": "- ...",
    "optimist": "- ...",
    "realist": "- ..."
  },
  "hallucinations": [
    {
      "claim": "...",
      "status": "verified",
      "confidence": 0.8
    }
  ],
  "contradictionFlag": false,
  "safetyFlags": [],
  "scoreExplanation": {
    "promptRisk": ["..."],
    "biasScore": ["..."],
    "safetyRisk": ["..."],
    "accuracyScore": ["..."],
    "hallucinationScore": ["..."],
    "finalRisk": ["..."]
  },
  "impact": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "correctedOutput": "- ...",
  "alternatives": {
    "evidenceBased": ["..."],
    "ethical": ["..."],
    "neutral": ["..."]
  }
}
```

## Reliability and Fallback Behavior

- Groq model strategy uses primary model plus fallback model.
- Rate limit (429) handling uses temporary backoff and safe fallback payloads instead of hard crashes.
- If Tavily has no evidence, claim status defaults to uncertain.
- If claim verification fails, claim status falls back to uncertain with low confidence.
- If aggregator output is invalid JSON, a fallback aggregate object is used.
- If corrected output or alternates fail, deterministic fallback content is returned.

## Caching Behavior

- Backend analysis cache:
  In-memory Map with 6-hour TTL and versioned cache key hashing.
- Frontend response cache:
  localStorage key decisionx_analysis_cache_v15 with 24-hour TTL.
- History storage:
  localStorage key decisionx_analyses.

## UI Notes

- RiskDashboard uses metric-aware coloring.
- Accuracy is treated as a quality metric (higher is better color).
- Risk metrics are treated as risk metrics (higher is worse color).
- Analysis modal includes a View Explanation toggle for score basis.

## Known Implementation Notes

- backend/api/route.js exists alongside app/api/analyze/route.js; the App Router endpoint is the primary runtime route.
- frontend/pages contains legacy page components while app/* routes are the active pages.

## Judge Q&A Prep

Why trust this system?

- It combines multi-agent review, rule-based safety checks, and source-backed claim validation.
- It does not rely on one model score; it fuses several independent signals.
- Every score is accompanied by explanation text, verdict, and primary-issue tagging.

How does risk score work?

- The pipeline detects domain first, then computes safety, accuracy, hallucination, and impact components.
- Final risk is a weighted formula with explicit factors and a contradiction penalty.
- Output includes a human-readable label: Safe, Risky, or Dangerous.

Why no model training?

- This is an inference-time guardrail system.
- It is cheaper and faster to ship than training a custom model.
- Rules and prompts can be iterated quickly while preserving explainability.

## 30-60 Second Pitch

DecisionX checks whether an AI answer is safe enough to use in real decisions.
You paste the prompt and the model output.
Then three agents review quality, a fact-check pipeline validates claims with web evidence, and a domain-aware risk model scores harm potential.
Instead of only showing numbers, we return a clear verdict, highlight the primary issue, and provide a corrected response.
In one screen, you get bad output, detection, and safer alternative output.

## License

MIT
