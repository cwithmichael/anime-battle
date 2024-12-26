import styles from "@/app/page.module.css";

import Battle from "../ui/battle";

export default async function Page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Battle />
      </main>
    </div>
  );
}
