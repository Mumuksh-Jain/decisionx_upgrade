"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, Activity, Search, Users, Terminal, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

export default function InteractiveOrbitalHero() {
  const [rotation, setRotation] = useState(0);
  const [hoveredSatellite, setHoveredSatellite] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const requestRef = useRef();

  const satellites = [
    {
      id: "epistemic",
      name: "Epistemic Truth Core",
      code: "NLI-ENT-01",
      badge: "Grounded 94%",
      color: "#10b981",
      angleOffset: 0,
      radius: 175,
      icon: CheckCircle2,
      desc: "Propositional factuality verified against primary web grounding citations.",
    },
    {
      id: "dialectic",
      name: "Dialectic Consensus",
      code: "MAD-3AG-02",
      badge: "3/3 Agree",
      color: "#f59e0b",
      angleOffset: (2 * Math.PI) / 5,
      radius: 140,
      icon: Users,
      desc: "Cross-examination of Red-Team Critic, Optimist, and Realist perspectives.",
    },
    {
      id: "hallucination",
      name: "Hallucination Radar",
      code: "UQLM-PER-03",
      badge: "Floor 30%",
      color: "#ef4444",
      angleOffset: (4 * Math.PI) / 5,
      radius: 195,
      icon: AlertTriangle,
      desc: "Detects ungrounded statistical fabrication and false attribution claims.",
    },
    {
      id: "guardrails",
      name: "Guardrail Patcher",
      code: "XML-META-04",
      badge: "Active",
      color: "#38bdf8",
      angleOffset: (6 * Math.PI) / 5,
      radius: 125,
      icon: Terminal,
      desc: "Instant drop-in meta-prompt patch preventing LLM prompt regression.",
    },
    {
      id: "nist",
      name: "NIST Risk Floor",
      code: "RMF-GOV-05",
      badge: "Hard Gate",
      color: "#a855f7",
      angleOffset: (8 * Math.PI) / 5,
      radius: 160,
      icon: Shield,
      desc: "Domain baseline floor constraint preventing zero-risk misclassification.",
    },
  ];

  // Continuous orbital rotation animation
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      if (!isPaused) {
        setRotation((prev) => (prev + dt * 0.22) % (2 * Math.PI));
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused]);

  const width = 520;
  const height = 480;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: "visible", maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <radialGradient id="gravitationalCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#b45309" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#0284c7" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <filter id="coreGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="orbitalRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.4)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.2)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0.4)" />
          </linearGradient>
        </defs>

        {/* Outer Background Atmosphere Halo */}
        <circle
          cx={centerX}
          cy={centerY}
          r={210}
          fill="none"
          stroke="url(#orbitalRingGrad)"
          strokeWidth="1"
          strokeDasharray="4,6"
          opacity="0.35"
        />

        {/* 4 Concentric Planetary Reference Orbit Rings */}
        {[100, 135, 165, 195].map((r, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1"
            strokeDasharray={i % 2 === 0 ? "2,4" : "none"}
            opacity={0.45}
          />
        ))}

        {/* Central Gravitational Predictive Engine Core */}
        <g style={{ cursor: "pointer" }} onClick={() => setIsPaused(!isPaused)}>
          <circle
            cx={centerX}
            cy={centerY}
            r={56}
            fill="url(#gravitationalCore)"
            filter="url(#coreGlowFilter)"
            className="telemetry-pulse"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={34}
            fill="var(--bg-surface)"
            stroke="var(--accent-gold)"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={centerY - 6}
            textAnchor="middle"
            fill="var(--accent-gold)"
            fontSize="18"
            fontWeight="800"
          >
            ⚡
          </text>
          <text
            x={centerX}
            y={centerY + 12}
            textAnchor="middle"
            fill="var(--text-main)"
            fontSize="9.5"
            fontWeight="800"
            fontFamily="var(--font-mono)"
            letterSpacing="0.06em"
          >
            DECISIONX
          </text>
          <text
            x={centerX}
            y={centerY + 22}
            textAnchor="middle"
            fill="var(--text-dim)"
            fontSize="7"
            fontFamily="var(--font-mono)"
          >
            {isPaused ? "PAUSED" : "ACTIVE CORE"}
          </text>
        </g>

        {/* Orbiting Satellites with Trigonometric Positioning */}
        {satellites.map((sat) => {
          const currentAngle = rotation + sat.angleOffset;
          const x = centerX + sat.radius * Math.cos(currentAngle);
          const y = centerY + sat.radius * Math.sin(currentAngle);
          const isHovered = hoveredSatellite === sat.id;
          const Icon = sat.icon;

          return (
            <g
              key={sat.id}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => {
                setHoveredSatellite(sat.id);
                setIsPaused(true);
              }}
              onMouseLeave={() => {
                setHoveredSatellite(null);
                setIsPaused(false);
              }}
              style={{ cursor: "pointer" }}
            >
              {/* Connecting Ray Vector to Center Core */}
              <line
                x1={0}
                y1={0}
                x2={centerX - x}
                y2={centerY - y}
                stroke={isHovered ? sat.color : "var(--border-subtle)"}
                strokeWidth={isHovered ? 1.5 : 0.6}
                strokeDasharray="2,3"
                opacity={isHovered ? 0.9 : 0.25}
              />

              {/* Pulsing Aura Halo */}
              <circle
                cx={0}
                cy={0}
                r={isHovered ? 26 : 18}
                fill={sat.color}
                opacity={isHovered ? 0.35 : 0.15}
                style={{ transition: "r 0.2s ease" }}
              />

              {/* Satellite Node Body */}
              <circle
                cx={0}
                cy={0}
                r={isHovered ? 17 : 13}
                fill="var(--bg-surface)"
                stroke={sat.color}
                strokeWidth={isHovered ? 2.5 : 1.8}
                style={{
                  transition: "all 0.2s ease",
                  filter: isHovered ? `drop-shadow(0 0 8px ${sat.color})` : "none",
                }}
              />

              {/* Node Label Pill */}
              <rect
                x={-34}
                y={isHovered ? 22 : 16}
                width={68}
                height={16}
                rx={4}
                fill="var(--bg-surface)"
                stroke="var(--border-subtle)"
                strokeWidth={0.8}
                opacity={0.92}
              />
              <text
                x={0}
                y={isHovered ? 33 : 27}
                textAnchor="middle"
                fill="var(--text-main)"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {sat.badge}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredSatellite && (
        <div
          className="nm-card fade-in-up"
          style={{
            position: "absolute",
            bottom: 10,
            padding: "12px 18px",
            borderRadius: 12,
            background: "var(--bg-surface)",
            border: "1px solid var(--accent-gold)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
            maxWidth: 320,
            textAlign: "center",
            zIndex: 30,
          }}
        >
          {(() => {
            const sat = satellites.find((s) => s.id === hoveredSatellite);
            if (!sat) return null;
            return (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: sat.color }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-main)" }}>
                    {sat.name}
                  </span>
                  <span className="mono" style={{ fontSize: "0.68rem", color: "var(--text-dim)" }}>
                    [{sat.code}]
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  {sat.desc}
                </p>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
