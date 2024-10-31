import dbConnect from "@/utils/mongodb";
import User, { UserRoles } from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email }).select("+password");
        if (!user || !(await bcrypt.compare(credentials!.password, user.password))) {
          throw new Error("Wrong email and/or password");
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
      session.user.roles = token.roles as UserRoles[];
      return session;
    },
  },
};
