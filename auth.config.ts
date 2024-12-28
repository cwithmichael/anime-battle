import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname === "/battle/guest") {
        return true;
      }
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn && nextUrl.pathname === "/") {
        return false;
      }
      const isOnBattle = nextUrl.pathname.startsWith("/battle");
      if (isOnBattle) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/battle", nextUrl));
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
