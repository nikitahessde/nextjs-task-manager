"use client";

import { useState } from "react";
import { UserRole } from "@/models/User";
import { useTranslations } from "next-intl";

interface User {
  name: string;
  email: string;
  roles: UserRole[];
  createdAt: Date;
}

interface UserListProps {
  user: User;
  editUser: (email: string, updates: Partial<{ name: string }>) => Promise<void>;
}

export const UserDetails = ({ user, editUser }: UserListProps) => {
  const t = useTranslations("user-details");
  const [editingUserEmail, setEditingUserEmail] = useState<string | undefined>();
  const [nameError, setNameError] = useState("");
  const [editedUser, setEditedUser] = useState<User>({ ...user });

  const handleSave = async () => {
    if (editedUser && editedUser.name.trim() === "") {
      setNameError(t("empty-name"));
      return;
    }

    await editUser(editedUser.email, { name: editedUser.name });

    setEditingUserEmail(undefined);
    setNameError("");
  };

  const handleCancel = () => {
    setEditingUserEmail(undefined);
    setNameError("");
    setEditedUser({ ...user });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <div className="w-full overflow-x-auto rounded-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm">{t("name")}</label>
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => {
                setEditedUser({ ...editedUser, name: e.target.value });
                if (user.email) setEditingUserEmail(user.email);
              }}
              className="rounded border p-2"
            />
            {nameError && <div className="text-xs text-red-500">{nameError}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">{t("email")}</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="rounded border bg-gray-200 p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">{t("roles")}</label>
            <input
              type="text"
              value={user.roles.join(", ")}
              disabled
              className="rounded border bg-gray-200 p-2"
            />
          </div>
          <div className="mt-4 flex gap-2">
            {editingUserEmail === user.email && (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                  {t("save")}
                </button>
                <button
                  onClick={handleCancel}
                  className="cursor-pointer rounded-lg border border-black px-4 py-2 text-sm"
                >
                  {t("cancel")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
