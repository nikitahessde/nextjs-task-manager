"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type Props = {
  children?: React.ReactNode;
};

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (session && (pathname === "/login" || pathname === "/signup")) {
      router.push("/");
    }
    if (!session && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    }
  }, [session, status, router]);

  return <>{children}</>;
};

export const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <AuthRedirect>{children}</AuthRedirect>
    </SessionProvider>
  );
};
