import { Session } from "next-auth";
import { UserRole } from "@/models/User";

export const isAdmin = (session: Session | null) => {
  return session?.user?.roles.includes(UserRole.Admin);
};

export const isManager = (session: Session | null) => {
  return session?.user?.roles.includes(UserRole.Manager);
};

export const isDeveloper = (session: Session | null) => {
  return session?.user?.roles.includes(UserRole.Developer);
};
