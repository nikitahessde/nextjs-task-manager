"use client";

import { useEffect, useState } from "react";
import ModeEdit from "@mui/icons-material/ModeEdit";
import Check from "@mui/icons-material/Check";
import { useSession } from "next-auth/react";
import { Tooltip } from "@mui/material";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export const UserDetails = () => {
  const [editingUserEmail, setEditingUserEmail] = useState<string>();
  const [editedUser, setEditedUser] = useState({ name: "", role: "" });
  const [nameError, setNameError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const updateUser = async (email: string, updates: Partial<User>) => {
    const response = await fetch(`/api/users/${email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    const updatedUser = await response.json();
    setUsers((prevUsers) => prevUsers.map((user) => (user.email === email ? updatedUser : user))); // Update users state
  };

  const handleEdit = (user: User) => {
    setEditingUserEmail(user.email);
    setEditedUser({ name: user.name, role: user.role });
    setNameError("");
  };

  const handleSave = async (user: User) => {
    if (editedUser.name.trim() === "") {
      setNameError("Task name cannot be empty");
      return;
    }
    await updateUser(user.email, {
      name: editedUser.name,
      role: editedUser.role,
    });

    setEditingUserEmail(undefined);
    setNameError("");
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-sm leading-normal text-gray-600">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-gray-600">
            {users.length ? (
              users.map((user) => (
                <tr key={user.email} className="w-full border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3 text-left">
                    {editingUserEmail === user.email ? (
                      <div>
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="rounded border p-2"
                        />
                        {nameError && <div className="text-xs text-red-500">{nameError}</div>}
                      </div>
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">{user.email}</td>
                  <td className="px-6 py-3 text-left">{user.role}</td>
                  <td className="px-6 py-3 text-left">{new Date(user.createdAt).toDateString()}</td>
                  <td className="px-6 py-3 text-left">
                    {editingUserEmail === user.email ? (
                      <Check onClick={() => handleSave(user)} className="dis cursor-pointer">
                        Save
                      </Check>
                    ) : session?.user.role !== "admin" ? (
                      <Tooltip title="Only admin has access for editing users">
                        <button disabled={true}>
                          <ModeEdit
                            onClick={() => user.email && handleEdit(user)}
                            className="cursor-pointer"
                          >
                            Edit
                          </ModeEdit>
                        </button>
                      </Tooltip>
                    ) : (
                      <button>
                        <ModeEdit
                          onClick={() => user.email && handleEdit(user)}
                          className="cursor-pointer"
                        >
                          Edit
                        </ModeEdit>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-3 text-center text-base text-primary">
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetails;
