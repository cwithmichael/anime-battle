import { signIn } from "../../auth";
import styles from "@/app/page.module.css";
import Image from "next/image";
import { redirect } from "next/navigation";

export function Login({ provider }: { provider?: string }) {
  return (
    <div className={styles.homePageGreeting}>
      <Image
        height={250}
        width={250}
        alt={""}
        className={styles.vsImage}
        src={
          "https://cdn.pixabay.com/photo/2024/08/26/04/20/ai-generated-8998102_1280.png"
        }
      />
      <p>
        <strong>Welcome to Anime Battle!</strong>
      </p>
      <p>Please login to start voting for your favorite anime characters!</p>
      <form
        action={async () => {
          "use server";
          await signIn(provider);
        }}
      >
        <button className={styles.loginButton}>Sign In</button>
      </form>
      <form
        action={async () => {
          "use server";
          console.log("bypass auth");
          redirect("/battle/guest");
        }}
      >
        <button className={styles.loginButton}>Play as Guest</button>
      </form>
    </div>
  );
}
