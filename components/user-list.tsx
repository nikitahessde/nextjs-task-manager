'use client'

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
        <div className="border-2 border-primary bg-secondary rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
            <p className="text-xl font-semibold">User list</p>
            <div className="flex flex-col gap-4">
                {users.length ? (
                    users.map((user: User) => (
                        <div key={user.email} className="flex justify-between items-center border py-2 px-4 rounded-lg w-full">
                            <div className="flex items-center flex-grow w-2/3">
                                <div className="flex-grow max-w-full">
                                    <p className="font-semibold text-base">{user.name}</p>
                                    <p className="text-sm break-words text-gray-500">{user.email}</p>
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