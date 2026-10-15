"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  ChevronDown,
  Activity,
  CheckCircle2,
  Shield,
  FileCheck,
  Terminal,
  Database
} from "lucide-react";
import { PERSONAS } from "@/data/personas";

export default function Header({
  activePersonaId = "lead-auditor",
  onSelectPersona = null,
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(
    PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0]
  );

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("decisionx_theme");
      if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        setTheme("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        setTheme("light");
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch {
      // Fallback
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("decisionx_theme", nextTheme);
    } catch {}
  };

  const handlePersonaChange = (persona) => {
    setSelectedPersona(persona);
    setShowPersonaMenu(false);
    if (typeof onSelectPersona === "function") {
      onSelectPersona(persona);
    }
  };

  const navItems = [
    { label: "Diagnostics", href: "/analyzer", icon: Activity },
    { label: "Benchmarks", href: "/benchmarks", icon: Terminal },
    { label: "Audit History", href: "/history", icon: FileCheck },
    { label: "System Research", href: "/about", icon: Database },
  ];

  return (
    <header
      className="nm-card"
      style={{
        margin: "16px auto 24px auto",
        maxWidth: "1360px",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        position: "sticky",
        top: 12,
        zIndex: 90,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 14,
      }}
    >
      {/* Brand & Edition */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <div
            className="nm-inset"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.15rem",
              color: "var(--accent-gold)",
            }}
          >
            ⚡
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "var(--text-main)",
                }}
              >
                DecisionX
              </span>
              <span className="nm-pill nm-pill-gold" style={{ fontSize: "0.68rem", padding: "2px 8px" }}>
                Enterprise AI
              </span>
            </div>
            <span
              style={{
                fontSize: "0.68rem",
                color: "var(--text-dim)",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Autonomous Diagnostics & Guardrails
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Pills */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "var(--bg-inset)",
          padding: "4px 6px",
          borderRadius: 12,
          boxShadow: "var(--nm-inset)",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nm-button ${isActive ? "active" : ""}`}
              style={{
                padding: "6px 14px",
                fontSize: "0.82rem",
                borderRadius: 8,
                background: isActive ? "var(--bg-surface)" : "transparent",
                boxShadow: isActive ? "var(--nm-flat-sm)" : "none",
                borderColor: isActive ? "var(--border-subtle)" : "transparent",
                color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
              }}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Controls: Auditor Switcher + Telemetry Pill + Theme */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Auditor Persona Selector */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="nm-button"
            style={{
              padding: "6px 12px",
              fontSize: "0.78rem",
              gap: 8,
            }}
            title="Switch Auditor Evaluation Persona"
          >
            <span>{selectedPersona.emoji}</span>
            <span style={{ fontWeight: 700 }}>{selectedPersona.name.split(" ")[0]} Auditor</span>
            <ChevronDown size={13} style={{ opacity: 0.7 }} />
          </button>

          {showPersonaMenu && (
            <div
              className="nm-card fade-in-up"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 290,
                padding: 8,
                zIndex: 100,
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  padding: "6px 10px 8px 10px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                  letterSpacing: "0.05em",
                  borderBottom: "1px solid var(--border-subtle)",
                  marginBottom: 6,
                }}
              >
                Select Inspection Persona
              </div>
              {PERSONAS.map((persona) => (
                <div
                  key={persona.id}
                  onClick={() => handlePersonaChange(persona)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    background:
                      selectedPersona.id === persona.id ? "var(--bg-inset)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPersona.id !== persona.id) {
                      e.currentTarget.style.background = "var(--bg-inset)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPersona.id !== persona.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{persona.emoji}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{persona.name}</span>
                      {selectedPersona.id === persona.id && (
                        <CheckCircle2 size={13} color="var(--accent-green)" />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {persona.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live System Telemetry Status Pill */}
        <div
          className="nm-pill nm-pill-green"
          style={{
            fontSize: "0.72rem",
            padding: "5px 10px",
            userSelect: "none",
          }}
          title="Telemetry: Groq Llama-3.3-70B & Tavily Grounding are healthy"
        >
          <span
            className="telemetry-pulse"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent-green)",
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 700 }}>Groq 70B • Tavily Live</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="nm-button"
          style={{
            padding: "7px 10px",
            width: 36,
            height: 36,
          }}
          title={theme === "dark" ? "Switch to Daylight Soft-Slate" : "Switch to Tactical Obsidian Dark"}
        >
          {theme === "dark" ? (
            <Sun size={15} color="var(--accent-gold)" />
          ) : (
            <Moon size={15} color="var(--text-muted)" />
          )}
        </button>
      </div>
    </header>
  );
}
