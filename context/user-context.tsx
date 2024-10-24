"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

const UserContext = createContext<{
  users: User[];
  updateUser: (email: string, updates: Partial<User>) => void;
}>({
  users: [],
  updateUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching tasks:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setUsers(data);
  };

  const updateUser = async (email: string, updates: Partial<User>) => {
    const response = await fetch(`/api/users/${email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    const updatedUser = await response.json();
    setUsers(users.map((user) => (user.email === email ? updatedUser : user)));
  };

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  return <UserContext.Provider value={{ users, updateUser }}>{children}</UserContext.Provider>;
};

export const useUsers = () => {
  return useContext(UserContext);
};
