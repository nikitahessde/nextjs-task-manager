'use client'

import { UserRole } from "@/models/User";
import { setSortOrder, setSearchTerm, setUsers } from "@/redux/slices/usersSlice";
import { useTranslations } from "next-intl";
import { useFilteredAndSortedUsers } from "@/redux/selectors";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Search from "@mui/icons-material/Search";

interface User {
  name: string;
  email: string;
  roles: UserRole[];
}

interface UserListProps {
  initialUsers: User[];
}

export const UserList = ({ initialUsers }: UserListProps) => {
  const dispatch = useDispatch();
  const t = useTranslations("user-list");
  const users = useFilteredAndSortedUsers();

  useEffect(() => {
    dispatch(setUsers(initialUsers));
  }, [initialUsers, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    dispatch(setSortOrder(order));
  };
  return (
    <div className="flex flex-col gap-4 overflow-y-auto rounded-lg border-2 border-primary bg-secondary p-4">
      <p className="text-xl font-semibold">{t("user-list")}</p>
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <Search />
          <input
            type="text"
            placeholder={t("search")}
            onChange={handleSearchChange}
            className="border p-2 rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSortChange('asc')} className="border p-2 rounded-md text-sm">Asc</button>
          <button onClick={() => handleSortChange('desc')} className="border p-2 rounded-md text-sm">Desc</button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {users.length ? (
          users.map((user: User) => (
            <div
              key={user.email}
              className="flex w-full items-center justify-between rounded-lg border px-4 py-2"
            >
              <div className="flex w-2/3 flex-grow items-center">
                <div className="max-w-full flex-grow">
                  <p className="text-base font-semibold">{user.name}</p>
                  <p className="break-words text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <p>{user.roles.join(", ")}</p>
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
