"use client";
import styles from "@/app/page.module.css";

import Battle from "../ui/battle";
import { SessionProvider } from "next-auth/react";
import { GuestContext } from "../lib/context";
import { useContext } from "react";

export default function Page() {
  const guest = useContext(GuestContext);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SessionProvider>
          <Battle isGuest={guest} />
        </SessionProvider>
      </main>
    </div>
  );
}
