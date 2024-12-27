import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnBattle = nextUrl.pathname.startsWith("/battle");
      console.log({ pathName: nextUrl.pathname });
      const isOnLanding =
        nextUrl.pathname !== "/battle" && nextUrl.pathname !== "/login";
      if (isOnBattle || isOnLanding) {
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
