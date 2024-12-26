import styles from "@/app/page.module.css";

import Battle from "../ui/battle";
import { SessionProvider } from "next-auth/react";

export default async function Page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SessionProvider>
          <Battle />
        </SessionProvider>
      </main>
    </div>
  );
}
