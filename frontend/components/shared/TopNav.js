"use client";
import Link from "next/link";
import styles from "./TopNav.module.css";
export default function TopNav({ currentPage = "Home" }) {
  return (
    <header className={styles.topNav}>
      <div className={styles.navContainer}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            DecisionX
          </Link>
          <nav className={styles.navMenu}>
            <Link href="/" className={`${styles.navLink} ${currentPage === "Home" ? styles.active : ""}`}>
              Home
            </Link>
            <Link href="/analyzer" className={`${styles.navLink} ${currentPage === "Analyzer" ? styles.active : ""}`}>
              Analyzer
            </Link>
            <Link href="/history" className={`${styles.navLink} ${currentPage === "History" ? styles.active : ""}`}>
              History
            </Link>
            <Link href="/about" className={`${styles.navLink} ${currentPage === "About" ? styles.active : ""}`}>
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
