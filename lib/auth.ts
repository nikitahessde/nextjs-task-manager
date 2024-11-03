import dbConnect from "@/utils/mongodb";
import User, { UserRole } from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const t = await getTranslations("login");
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email }).select("+password");
        if (!user || !(await bcrypt.compare(credentials!.password, user.password))) {
          throw new Error(t("wrong-credentials"));
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && "roles" in user) {
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles as UserRole[];
      return session;
    },
  },
};
