import "./globals.css";

export const metadata = {
  title: "DecisionX Enterprise — Autonomous Multi-Agent AI Diagnostics & Guardrails",
  description:
    "Production-grade multi-agent epistemic diagnostics, atomic claim verification, NIST/OWASP alignment, and executable guardrail prompt patching for high-stakes AI outputs.",
  keywords: [
    "AI Safety",
    "Hallucination Detection",
    "OWASP LLM09",
    "NIST AI RMF",
    "Multi-Agent Debate",
    "DecisionX",
    "Tavily Grounding",
    "Groq Llama-3.3-70B",
    "Guardrails"
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('decisionx_theme');
                  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
