"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logout from "@mui/icons-material/Logout";
import { UserRole } from "@/models/User";
import { PersonOutline } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { resetTasks } from "@/redux/slices/tasksSlice";
import { useDispatch } from "react-redux";

export const Menu = () => {
  const t = useTranslations("menu");
  const session = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  if (session.status !== "authenticated") return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Link href={"/"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">{t("home")}</p>
        </Link>
        <Link href={"/create-task"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">{t("create-task")}</p>
        </Link>
        <Link href={"/task-list"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">{t("task-list")}</p>
        </Link>
        <Link href={"/task-details"} className="rounded-lg bg-primary px-3 py-2">
          <p className="text-xs font-semibold text-secondary">{t("task-details")}</p>
        </Link>
        {session.data.user.roles.includes(UserRole.Admin) && (
          <>
            <Link href={"/user-list"} className="rounded-lg bg-primary px-3 py-2">
              <p className="text-xs font-semibold text-secondary">{t("user-list")}</p>
            </Link>
            <Link href={"/user-details"} className="rounded-lg bg-primary px-3 py-2">
              <p className="text-xs font-semibold text-secondary">{t("user-details")}</p>
            </Link>
            <Link href={"/groups"} className="rounded-lg bg-primary px-3 py-2">
              <p className="text-xs font-semibold text-secondary">{t("groups")}</p>
            </Link>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <PersonOutline onClick={() => router.push("/settings")} />
        <Logout
          className="cursor-pointer"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              dispatch(resetTasks());
              router.push("/login");
            });
          }}
        ></Logout>
      </div>
    </div>
  );
};

export default Menu;
