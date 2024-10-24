"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logout from "@mui/icons-material/Logout";

export const Menu = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status !== "authenticated") return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Link href={"/"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">Home</p>
        </Link>
        <Link href={"/create-task"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">Create Task</p>
        </Link>
        <Link href={"/task-list"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">Task List</p>
        </Link>
        <Link href={"/task-details"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">Task Details</p>
        </Link>
        <Link href={"/user-list"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">User List</p>
        </Link>
        <Link href={"/user-details"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">User Details</p>
        </Link>
      </div>
      <Logout
        className="cursor-pointer"
        onClick={() => {
          signOut({ redirect: false }).then(() => {
            router.push("/login");
          });
        }}
      >
        Sign Out
      </Logout>
    </div>
  );
};

export default Menu;
