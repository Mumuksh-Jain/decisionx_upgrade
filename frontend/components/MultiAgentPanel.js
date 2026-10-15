"use client";

import styles from "./MultiAgentPanel.module.css";

function AgentCard({ agent, content }) {

  const getAgentColor = (ag) => {
    if (ag === "critic") return "critic";
    if (ag === "optimist") return "optimist";
    return "realist";
  };

  // Format bullet points if content contains newlines
  const formatContent = (text) => {
    if (!text) return "";
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length > 1) {
      return lines.map((line, idx) => (
        <li key={idx}>{line.replace(/^[-•*]\s*/, "").trim()}</li>
      ));
    }
    return text;
  };

  return (
    <div className={`${styles.card} ${styles[getAgentColor(agent)]} ${styles.visible}`}>
      <h3 className={styles.agentName}>{agent.charAt(0).toUpperCase() + agent.slice(1)}</h3>
      {typeof formatContent(content) === "string" ? (
        <p className={styles.content}>{formatContent(content)}</p>
      ) : (
        <ul className={styles.bulletList}>{formatContent(content)}</ul>
      )}
    </div>
  );
}

export default function MultiAgentPanel({ critic, optimist, realist }) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <AgentCard agent="critic" content={critic} />
        <AgentCard agent="optimist" content={optimist} />
        <AgentCard agent="realist" content={realist} />
      </div>
    </div>
  );
}
