"use client";

import { UserRole } from "@/models/User";
import { setSortOrder, setSearchTerm, setUsers } from "@/redux/slices/usersSlice";
import { useTranslations } from "next-intl";
import { useFilteredAndSortedUsers } from "@/redux/selectors";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Search from "@mui/icons-material/Search";

interface User {
  name: string;
  email: string;
  roles: UserRole[];
}

interface Group {
  uuid: string;
  name: string;
  createdAt: Date;
  users?: string[];
}

interface UserListProps {
  initialUsers: User[];
  groups: Group[];
  assignUserToGroup: (userEmail: string, groupId: string) => Promise<void>;
}

export const UserList = ({ initialUsers, groups, assignUserToGroup }: UserListProps) => {
  const dispatch = useDispatch();
  const t = useTranslations("user-list");
  const users = useFilteredAndSortedUsers();
  const [selectedGroups, setSelectedGroups] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    dispatch(setUsers(initialUsers));
  }, [initialUsers, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSortChange = (order: "asc" | "desc") => {
    dispatch(setSortOrder(order));
  };

  const handleAssignUser = async (userEmail: string) => {
    const groupId = selectedGroups[userEmail];
    if (groupId) {
      await assignUserToGroup(userEmail, groupId);
      setSelectedGroups((prev) => ({ ...prev, [userEmail]: "" }));
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto rounded-lg border-2 border-primary bg-secondary p-4">
      <p className="text-xl font-semibold">{t("user-list")}</p>
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <Search />
          <input
            type="text"
            placeholder={t("search")}
            onChange={handleSearchChange}
            className="rounded-lg border p-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSortChange("asc")} className="rounded-md border p-2 text-sm">
            {t("asc")}
          </button>
          <button
            onClick={() => handleSortChange("desc")}
            className="rounded-md border p-2 text-sm"
          >
            {t("desc")}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {users.length ? (
          users.map((user: User) => (
            <div
              key={user.email}
              className="flex w-full items-center justify-between rounded-lg border px-4 py-2"
            >
              <div className="flex w-1/3 items-center">
                <div className="flex-grow">
                  <p className="text-base font-semibold">{user.name}</p>
                  <p className="break-words text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              {user.roles.includes(UserRole.Developer) && (
                <div className="flex w-1/3 gap-4">
                  <select
                    onChange={(e) =>
                      setSelectedGroups((prev) => ({ ...prev, [user.email]: e.target.value }))
                    }
                    value={selectedGroups[user.email] || ""}
                    className="rounded-lg border py-2 px-3 text-sm"
                  >
                    <option value="" disabled>
                      Select Group
                    </option>
                    {groups.map((group) => (
                      <option
                        key={group.uuid}
                        value={group.uuid}
                        disabled={group.users?.includes(user.email)}
                      >
                        {group.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAssignUser(user.email)}
                    disabled={!selectedGroups[user.email]}
                    className={`rounded-lg border bg-primary p-2 text-xs text-white ${!selectedGroups[user.email] && "opacity-50"}`}
                  >
                    Assign
                  </button>
                </div>
              )}
              <div className="flex w-1/3 justify-end">
                <p>{user.roles.join(", ")}</p>
              </div>
            </div>
          ))
        ) : (
          <p>{t("no-users")}</p>
        )}
      </div>
    </div>
  );
};

export default UserList;
