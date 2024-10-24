"use client";

import { useUsers } from "@/context/user-context";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export const UserList = () => {
  const { users } = useUsers();
  return (
    <div className="flex flex-col gap-4 overflow-y-auto rounded-lg border-2 border-primary bg-secondary p-4">
      <p className="text-xl font-semibold">User list</p>
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
              <p>{user.role}</p>
            </div>
          ))
        ) : (
          <p>No users to show</p>
        )}
      </div>
    </div>
  );
};

export default UserList;
