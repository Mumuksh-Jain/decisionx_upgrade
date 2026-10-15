# DecisionX AI - Project Structure Refactoring

## Folder Organization

### Frontend (`/frontend`)
User-facing components and services for the diagnostics UI.

```
frontend/
├── components/
│   ├── PromptAnalyzer.js          # User prompt input
│   ├── OutputAnalyzer.js          # AI output input
│   ├── RiskDashboard.js           # Risk scores (promptRisk, biasScore, hallucinationScore, finalRisk)
│   ├── MultiAgentPanel.js         # Critic, Optimist, Realist analyses
│   ├── FailureMap.js              # Impact chain visualization
│   ├── ReportPanel.js             # Hallucinations & corrected output
│   └── *.module.css               # Component styles
│
└── services/
    └── analyzeService.js          # API service for /api/analyze endpoint

└── utils/
    (Reserved for utility functions)
```

### Backend (`/backend`)
AI agents, prompts, and LLM logic.

```
backend/
└── lib/
    ├── groq.js                    # Groq API client & agent calls
    └── prompts.js                 # System prompts for all agents
```

### Source App (`/src/app`)
Next.js pages and API routes (unchanged).

```
src/app/
├── page.js                        # Main dashboard (imports from frontend)
├── page.module.css               # Page styles
├── layout.js                      # Root layout
├── globals.css                    # Global styles
└── api/
    └── analyze/
        └── route.js               # POST /api/analyze (imports from backend)
```

---

## Data Flow

```
1. User Input
   ↓
2. page.js (Frontend)
   ├─ PromptAnalyzer (input collection)
   ├─ OutputAnalyzer (input collection)
   ├─ RiskDashboard (displays scores)
   ├─ MultiAgentPanel (displays agents)
   ├─ FailureMap (displays impact chain)
   └─ ReportPanel (displays hallucinations & corrections)
   
3. analyzeService.js
   ├─ POST /api/analyze
   
4. route.js (Backend)
   ├─ Calls: callAgent() from backend/lib/groq.js
   ├─ With prompts from backend/lib/prompts.js
   ├─ Returns structured JSON response
   
5. Frontend renders results
```

---

## API Response Structure

```javascript
{
  promptRisk: number,                    // 0-100
  biasScore: number,                     // 0-100
  hallucinationScore: number,            // 0-100
  finalRisk: number,                     // 0-100
  
  agents: {
    critic: string,                      // Analysis text
    optimist: string,                    // Analysis text
    realist: string                      // Analysis text
  },
  
  hallucinations: [
    { claim: string, status: "verified" | "false" | "uncertain" }
  ],
  
  impact: [string],                      // Cause-effect chain (3-5 steps)
  correctedOutput: string                // Rewritten, safer output
}
```

---

## Import Paths (jsconfig.json)

```javascript
@/components/*      → ./frontend/components/*
@/services/*        → ./frontend/services/*
@/utils/*           → ./frontend/utils/*
@/backend/*         → ./backend/*
@/*                 → ./src/*              (Next.js default)
```

---

## Files Moved

### From `src/` to `frontend/`:
- `src/components/` → `frontend/components/`
- `src/services/analyzeService.js` → `frontend/services/analyzeService.js`

### From `src/lib/` to `backend/`:
- `src/lib/gemini.js` → `backend/lib/gemini.js`
- `src/lib/prompts.js` → `backend/lib/prompts.js`

### Updated Imports:
- `src/app/api/analyze/route.js`: Now imports from `@/backend/lib/*`
- All components: Already use `@/components/*`, `@/services/*` paths

---

## State Management (page.js)

```javascript
const [prompt, setPrompt]           // User prompt input
const [output, setOutput]           // AI output input
const [loading, setLoading]         // Loading state
const [error, setError]             // Error state
const [results, setResults]         // Results state

// Flow: Input → API → results/error → UI
```

---

## Component Communication

- **page.js** ← top-level state manager
  - ↓ Props passed to components
  - ← async function `analyzeDecision()` from analyzeService.js

---

## Next Steps (Ready for Development)

1. ✅ Frontend structure organized
2. ✅ Backend logic separated
3. ✅ API integration prepared
4. 🔄 Ready to test full flow
5. 🔄 Ready to add additional features

Run the app:
```bash
npm run dev
```

API is ready at: `POST /api/analyze`
