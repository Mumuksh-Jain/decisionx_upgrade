# DecisionX Enterprise: Comprehensive Research & Scientific Foundation
**The Definitive System Specification for Autonomous Multi-Agent AI Output Diagnostics**
*Document Version: 3.0.0 (Production Enterprise Edition)*
*Author: Senior AI Systems Architect & Safety Engineering Lead*
*Classification: Architectural Ground Truth & System Lifeline*

---

## 1. Executive Summary & Problem Taxonomy

Large Language Models (LLMs) deployed across high-stakes domains (healthcare, financial services, legal counsel, cybersecurity, automated reasoning) exhibit a critical vulnerability: **authoritative-sounding epistemic failure**. While models generate grammatically fluent and convincing prose, they routinely produce:
1. **Epistemic Hallucinations (OWASP LLM09: Misinformation)**: Extrapolations devoid of factual grounding, fabricated citations, and confident miscalculations.
2. **Latent Sociotechnical Bias & Stereotyping**: Covert discrimination, demographic disparate impact, or harmful generalizations masked by neutral language.
3. **Safety & Compliance Breaches (NIST AI RMF 1.0 / OWASP LLM01, LLM02, LLM06)**: Unchecked disclosure of sensitive heuristics, unauthorized practice of regulated advice, and failure to surface critical contraindications.
4. **Operational Overreliance (OWASP LLM09)**: Downstream business logic and human decision-makers accepting unverified outputs without provenance.

**DecisionX Enterprise** is engineered to resolve this failure mode. Rather than treating evaluation as an opaque single-pass LLM prompt or an ad-hoc regex check, DecisionX implements a **deterministic, multi-agent dialectic verification pipeline** backed by real-time external knowledge retrieval, atomic claim decomposition, and mathematical score calibration.

```
+----------------------------------------------------------------------------------------------------+
|                                    DECISIONX ENTERPRISE PIPELINE                                   |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [User Prompt] + [AI Output]                                                                       |
|         │                                                                                          |
|         ▼                                                                                          |
|  [Stage 1: Domain Classification & Baseline Risk Floor]                                            |
|         │ (Healthcare, Financial, Legal, Cybersecurity, Enterprise HR, General)                    |
|         ▼                                                                                          |
|  [Stage 2: Atomic Proposition Decomposition]                                                       |
|         │ (Extracts N atomic, verifiable factual claims)                                            |
|         ▼                                                                                          |
|  [Stage 3: Multi-Source Web Grounding Engine]                                                      |
|         │ (Tavily Grounding API -> Web Citations & Evidence Snippets)                             |
|         ▼                                                                                          |
|  [Stage 4: Multi-Agent Dialectic Deliberation (MAD)]                                               |
|         ├─► [Agent 1: Red-Team Critic] (Pessimistic failure modes, safety exploits)                |
|         ├─► [Agent 2: Value Optimist]  (Constructive utility, valid intent, user objectives)       |
|         ├─► [Agent 3: Empiric Realist] (Feasibility, factual accuracy, practical constraints)      |
|         └─► [Agent 4: Safety Arbiter]  (Protected groups, NIST AI RMF, regulatory compliance)     |
|         ▼                                                                                          |
|  [Stage 5: Calibrated Multidimensional Scoring Engine]                                             |
|         │ FinalRisk = f(DomainRisk, Inaccuracy, Hallucination, Impact, Safety, Bias, PromptRisk)   |
|         ▼                                                                                          |
|  [Stage 6: Guardrail Remediation & Artifact Generation]                                            |
|         ├─► Side-by-Side Clause-Level Diff                                                         |
|         ├─► Executable System Prompt Patch (Meta-Prompt Guardrail)                                 |
|         ├─► NeMo / JSON Schema Guardrail Definition                                                |
|         └─► Audit Certificate & Enterprise PDF Export                                              |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Theoretical Grounding: State-of-the-Art Evaluation Frameworks

DecisionX Enterprise bridges three distinct bodies of cutting-edge AI research:

### 2.1 The RAG Triad & DeepEval Groundedness
Originating from TruLens and DeepEval research, the evaluation of generative intelligence in real-world environments requires three distinct orthoganol axes:
1. **Context Relevance**: Determining whether retrieved evidence strictly aligns with the factual assertions under inspection.
2. **Groundedness / Faithfulness**: Quantifying the mathematical ratio of atomic output claims directly entailed by retrieved empirical evidence vs. ungrounded conjectures.
3. **Answer Relevance & Intent Fulfillment**: Verifying that the output satisfies the caller's explicit and implicit constraints without scope drift.

$$\text{Faithfulness Score} = \frac{|\text{Verified Entailed Claims}|}{|\text{Total Extracted Claims}|} \times 100$$

### 2.2 Multi-Agent Dialectic Deliberation (MAD)
Empirical research (Du et al., MIT CSAIL; Liang et al., Google DeepMind) demonstrates that single-pass LLM self-evaluation suffers from severe *sycophancy* and *confirmation bias*. When a single model judges an output, it tends to rationalize flaws.
DecisionX overcomes this through **Dialectic Multi-Agent Debate (MAD)**:
- **Red-Team Critic**: Employs an adversarial persona tasked with identifying edge-case failures, unstated assumptions, liability vulnerabilities, and potential for harm.
- **Value Optimist**: Identifies the original user intent, productive insights, and salvageable concepts within the candidate output.
- **Empiric Realist**: Grounds the evaluation in statistical probabilities, operational feasibility, and known physical/mathematical realities.
- **Safety Arbiter**: Applies strict regulatory rubrics (NIST, HIPAA, FINRA, GDPR) to resolve disagreements and establish the ground-truth audit.

### 2.3 Natural Language Inference (NLI) Claim Decomposition
Rather than scoring an entire paragraph holistically, DecisionX breaks outputs into discrete atomic propositions:
$$\mathcal{C} = \{c_1, c_2, \dots, c_k\}$$
Each claim $c_i$ is evaluated against retrieved evidence $E_i$ via three-way categorical inference:
- $\text{Entailed}$ ($\text{Verified}$): Claim is directly corroborated by retrieved authoritative sources. Weight = 1.0.
- $\text{Contradicted}$ ($\text{False}$): Claim is directly refuted by empirical evidence. Weight = 0.0.
- $\text{Neutral / Unverified}$ ($\text{Uncertain}$): Insufficient or conflicting empirical evidence. Weight = 0.5.

---

## 3. Mathematical Scoring Formulation & Calibration

All scores in DecisionX Enterprise are computed deterministically, clamped to $[0, 100]$, and categorized into risk tiers (**Low Risk [0-29]**, **Guarded [30-59]**, **Elevated [60-79]**, **Critical [80-100]**).

### 3.1 Domain-Aware Baseline Risk Floor ($\mathcal{R}_{\text{domain}}$)
High-consequence domains carry inherent tail-risk that cannot be zeroed out even if an output appears factual:
- **Clinical & Healthcare**: Floor = 35. High likelihood of diagnostic error or contraindication hazard.
- **Financial & Market Advisory**: Floor = 30. Regulatory liability (FINRA/SEC) and fiscal loss.
- **Legal Advisory**: Floor = 30. Unauthorized practice of law and statutory misrepresentation.
- **Cybersecurity & Infrastructure**: Floor = 25. Vulnerability exploitation and systemic failure.
- **Corporate HR & Talent**: Floor = 20. Disparate impact and protected-class liability.
- **General / Informational**: Floor = 10. Baseline operational uncertainty.

### 3.2 Accuracy & Hallucination Formulations
Let $N_v$ be the count of verified claims, $N_u$ the count of uncertain claims, and $N_f$ the count of false claims, with total claims $N = N_v + N_u + N_f$:

$$\text{AccuracyScore} = \text{round}\left( \frac{100 \cdot N_v + 60 \cdot N_u + 0 \cdot N_f}{\max(1, N)} \right)$$

$$\text{HallucinationScore} = \text{round}\left( \frac{100 \cdot N_f + 45 \cdot N_u + 0 \cdot N_v}{\max(1, N)} \right)$$

### 3.3 Prompt Framing Risk ($\mathcal{R}_{\text{prompt}}$)
Evaluates whether the user's prompt was an adversarial probe, jailbreak attempt, biased prompt, or high-risk trap. Computed independently from the model's output to prevent attribution error.

### 3.4 Safety & Bias Multipliers
- **Bias Score ($\mathcal{S}_{\text{bias}}$)**: Combines rule-based protected-group demographic scan with multi-agent consensus on disparate treatment.
- **Safety Score ($\mathcal{S}_{\text{safety}}$)**: Evaluates harmful generalization severity ($0$ to $4$ scale normalized to $0-100$).

### 3.5 Composite Final Risk Formulation
The definitive composite risk metric $\mathcal{R}_{\text{final}}$ is governed by a convex combination with hard safety gating:

$$\mathcal{R}_{\text{composite}} = w_d \mathcal{R}_{\text{domain}} + w_h \mathcal{H}_{\text{score}} + w_a (100 - \mathcal{A}_{\text{score}}) + w_s \mathcal{S}_{\text{safety}} + w_b \mathcal{S}_{\text{bias}} + w_i \mathcal{I}_{\text{impact}} + w_p \mathcal{R}_{\text{prompt}}$$

Where:
- $w_d = 0.15$ (Domain baseline)
- $w_h = 0.25$ (Hallucination weight)
- $w_a = 0.20$ (Inaccuracy weight)
- $w_s = 0.15$ (Safety violation weight)
- $w_b = 0.10$ (Bias severity weight)
- $w_i = 0.10$ (Downstream failure impact)
- $w_p = 0.05$ (Prompt vulnerability)

**Hard Safety Gating**: If any verified false medical claim or critical protected-class violation is detected, $\mathcal{R}_{\text{final}}$ is clamped with a strict floor:
$$\mathcal{R}_{\text{final}} = \max(\mathcal{R}_{\text{composite}}, 85) \quad \text{if Critical Safety Triggered}$$

---

## 4. Remediation & Actionable Artifact Engineering

A senior-grade production tool must never conclude with a diagnosis; it must provide **turnkey operational resolution**. DecisionX generates four enterprise artifacts:

1. **Clause-Level Token Diff**:
   Visual side-by-side comparison illustrating exact text removals (red debossed strike-through) and verified replacements (emerald green insertions).
2. **Executable System Prompt Patch (Meta-Prompt Guardrail)**:
   A tailored, high-priority prompt snippet (formatted in standard XML/Markdown) that developers can immediately paste into their production LLM system instructions to permanently patch the detected failure mode.
3. **Machine-Readable Guardrail Specification**:
   Exportable JSON schema defining input/output validation rules compatible with NeMo Guardrails, Llama Guard, and API gateways.
4. **Verifiable Audit Certificate & Report**:
   Cryptographically hashed (SHA-256) audit trail with timestamp, domain taxonomy, claim provenance citations, and printable enterprise PDF format.

---

## 5. UI/UX Design System Specification (The SAS Benchmark)

Following the proven **Tactile Neumorphic / Soft-Minimal** design philosophy pioneered in the SAS Viya Hackathon platform:

### 5.1 Typographic Hierarchy
- **Primary Interface Font**: `Plus Jakarta Sans` (weights 400, 500, 600, 700, 800) for clean editorial clarity and legibility.
- **Data & Telemetry Font**: `JetBrains Mono` (weights 400, 500, 600) for scores, claim citations, code diffs, hashes, and system logs.

### 5.2 Color Tokens & Surface Elevation
- **Canvas (`--bg-canvas`)**: `#f8fafc` (Daylight Slate) / `#090a0f` (Tactical Obsidian).
- **Surface (`--bg-surface`)**: `#ffffff` / `#11141d` with subtle 1px hairline border (`#e2e8f0` / `#222738`).
- **Debossed Well (`--bg-inset`)**: `#f1f5f9` / `#0b0e14` with soft inset shadow.
- **Accents**:
  - Primary Text: `#0f172a` / `#f8fafc`
  - Amber / Gold (Auditing / Guarded): `#b45309` / `#f59e0b`
  - Emerald Green (Verified / Safe): `#047857` / `#10b981`
  - Crimson Red (Violation / False): `#b91c1c` / `#ef4444`
  - Cobalt Blue (Telemetry / Retrieval): `#0284c7` / `#38bdf8`

### 5.3 User Flow & Loading Experience
1. **Input Workspace**: Clean dual-panel input with preset benchmark prompts (Clinical dosage, Financial prospectus, Corporate policy, Prompt injection).
2. **Live Diagnostic Mission Control**:
   - Immediate transition to a high-precision live execution telemetry console.
   - 6 sequential stages with live pulsing indicators, millisecond latency metrics, and real-time agent output streaming.
3. **Deep Audit Workspace**:
   - Tabbed or modular navigation: **Executive Summary**, **Atomic Fact Matrix**, **Multi-Agent Deliberation**, **Clause Diff & Remediation**, **Prompt Patch Generator**, and **Failure Cascade DAG**.
4. **Scroll & Motion Physics**:
   - Smooth staggered entrance animations (`fade-in-up`), GPU-accelerated micro-interactions, subtle tactile depression on click (`active: transform: translateY(1px)`), sticky telemetry HUD when scrolling.

---

## 6. System Architecture & Technical Implementation

```
decisionx_upgrade/
├── app/
│   ├── layout.js                     # Root layout with Plus Jakarta Sans & JetBrains Mono
│   ├── globals.css                   # SAS Tactile Neumorphic CSS variables and utility classes
│   ├── page.js                       # Landing & Product Overview with live demo launcher
│   ├── analyzer/page.js              # Full-featured Mission Control Diagnostics Workspace
│   ├── history/page.js               # Audit log & persistent historical inspection
│   ├── benchmarks/page.js            # Standardized adversarial evaluation benchmark suites
│   ├── about/page.js                 # Academic methodology, research citations & formulas
│   └── api/
│       └── analyze/route.js          # Next.js API endpoint with multi-stage streaming/telemetry
├── backend/
│   └── lib/
│       ├── analyze.js                # Core orchestration, claim extraction & scoring formulas
│       ├── groq.js                   # Groq SDK client (Llama-3.3-70b-versatile) & agent calls
│       ├── tavily.js                 # Live web search retrieval & evidence extraction
│       └── prompts.js                # Strict system prompts for Critic, Optimist, Realist, Arbiter
├── frontend/
│   ├── components/
│   │   ├── Header.tsx                # Breadcrumb, Auditor Persona Switcher, Live Telemetry Pill, Theme Toggle
│   │   ├── Sidebar.tsx               # Collapsible tactical navigation dock
│   │   ├── LiveTelemetryConsole.js   # 6-stage real-time execution telemetry console
│   │   ├── RiskDashboard.js          # High-precision risk gauges & domain floor telemetry
│   │   ├── ClaimVerificationMatrix.js# Atomic proposition audit with live citation links
│   │   ├── MultiAgentDeliberation.js # Dialectic debate matrix (Critic, Optimist, Realist, Arbiter)
│   │   ├── DiffRemediationStudio.js  # Side-by-side visual clause diff & instant draft export
│   │   ├── SystemPromptPatcher.js    # Executable meta-prompt guardrail generator
│   │   ├── FailureCascadeDag.js      # Impact cause-and-effect timeline visualization
│   │   └── ExportReportModal.js      # SHA-256 certificate & enterprise PDF generator
│   └── data/
│       ├── benchmarkSuites.js        # Realistic edge-case test suites (Medical, Finance, Legal, etc.)
│       └── personas.js               # Auditor profiles (Lead AI Auditor, Compliance Officer, Red Team)
```

---

## 7. Quality Assurance, Reliability & Graceful Degradation

1. **API Resiliency**: Groq API calls are configured with exponential backoff and rate-limit guardrails. In case of API latency or quota exhaustion, deterministic heuristic fallbacks and cached benchmark responses maintain 100% UI stability.
2. **Fact-Checking Degradation**: If Tavily search encounters rate limits, claim verification gracefully marks claims with `uncertain` and explains the retrieval boundary rather than failing silently.
3. **Zero AI-Slop Design Principle**: No non-functional decorative gradients, fake animations, or unreadable neon glowing backgrounds. Every element has an informational purpose and tactile feedback.
