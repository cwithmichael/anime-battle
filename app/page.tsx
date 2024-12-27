"use client";

import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div className={styles.homePageGreeting}>
        <p>
          <strong>Welcome to Anime Battle!</strong>
        </p>
        <br />
        <p>Please login to start voting for your favorite anime characters!</p>
        <div className={styles.login}>
          <Link href="/login">
            <button className={styles.loginButton}>Log in</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
