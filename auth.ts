import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
/*import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/app/lib/db";*/

export const { handlers, auth, signIn, signOut } = NextAuth({
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [GitHub],
});
