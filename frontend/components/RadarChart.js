"use client";

import { useMemo, useState } from "react";

/**
 * High-Precision 6-Axis SVG Risk Radar Chart
 * Standardized to SAS Viya Hackathon visual telemetry specs.
 */
export default function RadarChart({
  scores = {
    accuracy: 85,
    hallucination: 30,
    safety: 15,
    bias: 10,
    impact: 25,
    domain: 30,
  },
  size = 360,
  interactive = true,
}) {
  const [hoveredAxis, setHoveredAxis] = useState(null);

  const axes = [
    { key: "accuracy", label: "Accuracy", color: "#10b981", desc: "NLI Groundedness" },
    { key: "hallucination", label: "Hallucination", color: "#ef4444", desc: "Epistemic Drift" },
    { key: "safety", label: "Safety", color: "#f59e0b", desc: "Contraindication Hazard" },
    { key: "bias", label: "Sociotechnical Bias", color: "#38bdf8", desc: "Protected Class Equality" },
    { key: "impact", label: "Failure Impact", color: "#a855f7", desc: "Cascading Drift" },
    { key: "domain", label: "Domain Floor", color: "#eab308", desc: "Regulatory Baseline" },
  ];

  const center = size / 2;
  const radius = (size / 2) - 45;
  const numAxes = axes.length;
  const angleStep = (2 * Math.PI) / numAxes;

  // Grid reference rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate polygon points
  const polygonPoints = useMemo(() => {
    return axes
      .map((axis, i) => {
        const val = Math.max(0, Math.min(100, Number(scores[axis.key] ?? 50))) / 100;
        const angle = i * angleStep - Math.PI / 2;
        const r = radius * val;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [scores, radius, center, angleStep]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        userSelect: "none",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="radarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.18" />
            <stop offset="60%" stopColor="var(--accent-gold)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
          </linearGradient>

          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Center Aura */}
        <circle cx={center} cy={center} r={radius} fill="url(#radarAura)" />

        {/* Reference Rings */}
        {rings.map((ring, idx) => {
          const r = radius * ring;
          const isOuter = idx === rings.length - 1;
          return (
            <g key={idx}>
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth={isOuter ? 1.5 : 0.8}
                strokeDasharray={isOuter ? "none" : "3,3"}
                opacity={0.7}
              />
              <text
                x={center + 4}
                y={center - r + 11}
                fill="var(--text-dim)"
                fontSize="8"
                fontFamily="var(--font-mono)"
                opacity={0.6}
              >
                {Math.round(ring * 100)}%
              </text>
            </g>
          );
        })}

        {/* Axis Spokes */}
        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          const isHovered = hoveredAxis === axis.key;

          return (
            <line
              key={axis.key}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={isHovered ? axis.color : "var(--border-subtle)"}
              strokeWidth={isHovered ? 1.8 : 1}
              opacity={isHovered ? 1 : 0.6}
              transition="all 0.2s ease"
            />
          );
        })}

        {/* Filled Polygon Mesh */}
        <polygon
          points={polygonPoints}
          fill="url(#polyGrad)"
          stroke="var(--accent-gold)"
          strokeWidth="2.2"
          filter="url(#radarGlow)"
          style={{
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Data Point Satellites */}
        {axes.map((axis, i) => {
          const val = Math.max(0, Math.min(100, Number(scores[axis.key] ?? 50))) / 100;
          const angle = i * angleStep - Math.PI / 2;
          const r = radius * val;
          const cx = center + r * Math.cos(angle);
          const cy = center + r * Math.sin(angle);

          // Outer Label Placement
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const isHovered = hoveredAxis === axis.key;

          return (
            <g
              key={axis.key}
              onMouseEnter={() => setHoveredAxis(axis.key)}
              onMouseLeave={() => setHoveredAxis(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Outer Glow Halo */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 9 : 5}
                fill={axis.color}
                opacity={isHovered ? 0.4 : 0.2}
                transition="all 0.2s ease"
              />
              {/* Center Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 3.5}
                fill="#ffffff"
                stroke={axis.color}
                strokeWidth="2"
              />

              {/* Axis Label */}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isHovered ? axis.color : "var(--text-main)"}
                fontSize={isHovered ? "10.5" : "9.5"}
                fontWeight={isHovered ? 800 : 700}
                style={{
                  transition: "all 0.15s ease",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {axis.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Callout */}
      {hoveredAxis && (
        <div
          className="nm-card fade-in-up"
          style={{
            position: "absolute",
            bottom: -8,
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: "0.78rem",
            background: "var(--bg-surface)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            border: "1px solid var(--accent-gold)",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 800, color: "var(--accent-gold)" }}>
            {axes.find((a) => a.key === hoveredAxis)?.label}:{" "}
            <span className="mono">{scores[hoveredAxis] ?? 0}%</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
            {axes.find((a) => a.key === hoveredAxis)?.desc}
          </div>
        </div>
      )}
    </div>
  );
}
