import type { NextAuthConfig } from "next-auth";
import { createUser } from "./app/lib/data";
import prisma from "./app/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      if (auth?.user?.email) {
        await createUser(auth.user.email);
      }
      const isLoggedIn = !!auth?.user;
      const isOnBattle = nextUrl.pathname.startsWith("/battle");
      if (isOnBattle) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/battle", nextUrl));
      }
      return true;
    },
  },
  session: {
    strategy: "database",
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
