"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div>
        <div className={styles.homePageGreeting}>
          <p>
            <strong>Welcome to Acme.</strong> This is the example for the{" "}
            <a href="https://nextjs.org/learn/">Next.js Learn Course</a>,
            brought to you by Vercel.
          </p>
          <Link href="/login">
            <span>Log in</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
