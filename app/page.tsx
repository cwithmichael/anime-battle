"use client";

import styles from "./page.module.css";

export default function Home() {
  const errorState = false;
  if (errorState) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div>Something Went Wrong</div>
          <div>Try Refreshing the Page</div>
        </main>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <footer className={styles.footer}></footer>
    </div>
  );
}
