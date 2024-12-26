"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div>
        <div className={styles.homePageGreeting}>
          <p>
            <strong>Welcome to Anime Battle!</strong>
          </p>
          <p>
            Please login to start voting for your favorite anime characters!
          </p>
          <Link href="/login">
            <span>Log in</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
