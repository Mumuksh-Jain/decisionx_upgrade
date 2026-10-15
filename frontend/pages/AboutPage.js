"use client";

import Link from "next/link";
import TopNav from "@/components/shared/TopNav";
import Footer from "@/components/shared/Footer";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <TopNav currentPage="About" />
      
      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.title}>
            About <span className={styles.highlight}>DecisionX</span>
          </h1>
          <p className={styles.subtitle}>
            Transparent AI diagnostics. Open-source verification. Enterprise-grade trust.
          </p>
        </section>

        {/* Tech Stack */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>⚙️ Tech Stack</h2>
          
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Frontend</h3>
              <ul>
                <li>Next.js 16.2.3 (React 19)</li>
                <li>App Router Architecture</li>
                <li>Vanilla CSS Modules</li>
                <li>Real-time UI animations</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Backend</h3>
              <ul>
                <li>Node.js + Next.js API Routes</li>
                <li>Multi-agent orchestration</li>
                <li>Parallel processing</li>
                <li>Structured JSON responses</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>AI/LLM</h3>
              <ul>
                <li>Groq API (llama-3.1-8b-instant)</li>
                <li>3-agent parallel analysis</li>
                <li>Temperature=0 (deterministic)</li>
                <li>Structured JSON extraction</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Storage</h3>
              <ul>
                <li>Browser localStorage</li>
                <li>Analysis history persistence</li>
                <li>JSON serialization</li>
                <li>Auto-sync on completion</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Verification Methods */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>✅ Verification Methods</h2>
          <div className={styles.verificationList}>
            <div className={styles.verificationItem}>
              <strong>🤖 Multi-Agent Consensus</strong> – Three independent LLM agents (Critic, Optimist, Realist) analyze the same output, reducing single-model bias.
            </div>
            <div className={styles.verificationItem}>
              <strong>🔍 Hallucination Detection</strong> – Claims are classified as verified, false, or uncertain. No fabricated authority.
            </div>
            <div className={styles.verificationItem}>
              <strong>📊 Risk Quantification</strong> – Transparent scoring: Prompt Risk, Bias Score, Hallucination Rate, Final Risk.
            </div>
            <div className={styles.verificationItem}>
              <strong>⛓️ Impact Chains</strong> – Four-step cause-effect visualization of failure scenarios if output is trusted blindly.
            </div>
            <div className={styles.verificationItem}>
              <strong>✨ Corrected Output</strong> – Safer, improved version of the original output with vulnerabilities addressed.
            </div>
            <div className={styles.verificationItem}>
              <strong>📜 Full Transparency</strong> – All agent analyses, raw scores, and reasoning are displayed to the user. No blackbox.
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏗️ Architecture</h2>
          <div className={styles.architecture}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h4>Input Processing</h4>
              <p>User provides AI prompt + output. Minimal 5 char validation.</p>
            </div>
            <div className={styles.arrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h4>Parallel Analysis</h4>
              <p>3 agents run simultaneously with distinct perspectives.</p>
            </div>
            <div className={styles.arrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h4>Aggregation</h4>
              <p>Results synthesized into scores, claims, and corrections.</p>
            </div>
            <div className={styles.arrow}>→</div>
            <div className={styles.step}>
              <div className={styles.stepNum}>4</div>
              <h4>Visualization</h4>
              <p>Live modal shows agents appearing sequentially, then full report.</p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔐 Security & Privacy</h2>
          <div className={styles.securityGrid}>
            <div className={styles.securityCard}>
              <strong>No Data Storage</strong> – Analysis only stored in your browser&apos;s localStorage. Nothing sent to servers.
            </div>
            <div className={styles.securityCard}>
              <strong>API-Only</strong> – Only the prompt + output are sent to Groq API. No metadata collection.
            </div>
            <div className={styles.securityCard}>
              <strong>Deterministic Processing</strong> – temperature=0 ensures reproducible results for same input.
            </div>
            <div className={styles.securityCard}>
              <strong>Open Source Principles</strong> – All agent prompts and logic visible in the code. No hidden heuristics.
            </div>
            <div className={styles.securityCard}>
              <strong>Rate-Limit Aware</strong> – Respects API quotas. Optimized token usage reduces overhead.
            </div>
            <div className={styles.securityCard}>
              <strong>Graceful Degradation</strong> – Clear error messages if API fails. No silent failures.
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💡 Core Principles</h2>
          <div className={styles.principlesList}>
            <div className={styles.principle}>
              <h4>🎯 Transparency</h4>
              <p>Show users exactly how decisions are made. No blackboxes.</p>
            </div>
            <div className={styles.principle}>
              <h4>⚖️ Balanced Perspective</h4>
              <p>Critic finds flaws, Optimist finds strengths, Realist gives grounded verdict.</p>
            </div>
            <div className={styles.principle}>
              <h4>🚀 Performance</h4>
              <p>Parallel processing + optimized tokens = ~6-8 second analysis.</p>
            </div>
            <div className={styles.principle}>
              <h4>🛡️ Safety</h4>
              <p>Detect and surface hallucinations, biases, and injection attempts.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2>Ready to Analyze?</h2>
          <Link href="/analyzer" className={styles.ctaButton}>
            Start Diagnostics →
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
