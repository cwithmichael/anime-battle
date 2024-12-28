import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/ui/global.css";
import styles from "@/app/page.module.css";
import { auth, signOut } from "@/auth";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anime Battle",
  description: "Created by cwithmichael@gmail.com",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = await auth();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav className={styles.navBar}>
          {isLoggedIn && (
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className={styles.signOutButton}>Sign Out</button>
            </form>
          )}
        </nav>
        <h1 className={styles.title}>Anime Battle!</h1>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
