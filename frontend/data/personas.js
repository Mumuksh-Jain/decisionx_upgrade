export const PERSONAS = [
  {
    id: "lead-auditor",
    name: "Lead AI Systems Auditor",
    role: "Enterprise Safety & Epistemic Alignment",
    badge: "NIST / OWASP Lead",
    emoji: "👨‍💻",
    description: "Holistic evaluation across epistemic accuracy, hallucination rate, and multi-agent dialectic consensus.",
    focusAreas: ["OWASP LLM09 Grounding", "NIST AI RMF 1.0", "Dialectic Consensus", "Clause-Level Diffing"],
    weights: { hallucination: 0.25, accuracy: 0.20, safety: 0.15, bias: 0.10, domain: 0.15, impact: 0.10, prompt: 0.05 },
  },
  {
    id: "clinical-officer",
    name: "Clinical Safety Officer",
    role: "Healthcare & Biomedical Verification",
    badge: "Clinical Risk Floor: 35",
    emoji: "🩺",
    description: "Strict scrutiny of medical claims, pharmacological dosages, contraindications, and patient liability.",
    focusAreas: ["Clinical Trial Validation", "Drug-Drug Interaction Checks", "Off-Label Claim Suppression", "Zero Tolerance for Unverified Dosage"],
    weights: { hallucination: 0.35, accuracy: 0.30, safety: 0.25, bias: 0.05, domain: 0.35, impact: 0.20, prompt: 0.05 },
  },
  {
    id: "compliance-counsel",
    name: "Regulatory & Legal Counsel",
    role: "Financial & Corporate Governance",
    badge: "SEC / FINRA / GDPR",
    emoji: "⚖️",
    description: "Detects unauthorized financial advice, statutory liabilities, forward-looking guarantee misrepresentations, and PII disclosure.",
    focusAreas: ["Material Non-Public Information", "Statutory Disclaimers", "Contractual Ambiguity", "Fiduciary Exposure"],
    weights: { hallucination: 0.25, accuracy: 0.25, safety: 0.20, bias: 0.15, domain: 0.30, impact: 0.20, prompt: 0.10 },
  },
  {
    id: "red-team",
    name: "Adversarial Red-Team Lead",
    role: "Jailbreak, Trap & Exploit Defense",
    badge: "Adversarial Probe",
    emoji: "🛡️",
    description: "Probes for covert prompt injection, sycophantic traps, sociotechnical bias triggers, and harmful generalization exploitation.",
    focusAreas: ["Indirect Prompt Injection", "Stereotyping Heuristics", "Sycophancy Detection", "Boundary Exploitation"],
    weights: { hallucination: 0.20, accuracy: 0.15, safety: 0.35, bias: 0.25, domain: 0.15, impact: 0.20, prompt: 0.25 },
  },
];

export function getPersona(id) {
  return PERSONAS.find((p) => p.id === id) || PERSONAS[0];
}
