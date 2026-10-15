"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar({ currentPage }) {
  const menuItems = [
    { icon: "📊", label: "Overview", href: "/" },
    { icon: "📝", label: "Agent Log", href: "/agent-log" },
    { icon: "🧠", label: "Neural Diagnostics", href: "/diagnostics", active: true },
    { icon: "🔒", label: "Threat Scan", href: "/threat-scan" },
    { icon: "🌐", label: "Network Map", href: "/network" },
  ];

  const bottomItems = [
    { icon: "✓", label: "Security Protocol", href: "/security" },
    { icon: "⏻", label: "System Logout", href: "/logout" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>COMMAND_CENTER</h2>
        <p className={styles.version}>V.2.0.4-ACTIVE</p>
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              item.active ? styles.active : ""
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        {bottomItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.footerItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
