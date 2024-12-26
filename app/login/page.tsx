import styles from "@/app/page.module.css";

import { Login } from "@/app/ui/login-form";

export default async function Page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Login />
      </main>
    </div>
  );
}
