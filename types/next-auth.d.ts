// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { User } from "next-auth";
import { UserRoles } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      roles: UserRoles[];
    };
  }
}
