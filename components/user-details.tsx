"use client";

import { useState } from "react";
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

interface UserListProps {
    users: User[];
    editUser: (email: string, updates: Partial<{ name: string; role: string }>, session: any) => Promise<void>;
}

export const UserDetails = ({ users, editUser }: UserListProps) => {
  const [editingUserEmail, setEditingUserEmail] = useState<string>();
  const [editedUsers, setEditedUsers] = useState<User[]>(users);
  const [nameError, setNameError] = useState("");
  const { data: session } = useSession();

  const handleEdit = (user: User) => {
    setEditingUserEmail(user.email);
    setNameError("");
  };

  const handleSave = async (user: User) => {
    const updatedUser = editedUsers.find(u => u.email === user.email);
    if (updatedUser && updatedUser.name.trim() === "") {
      setNameError("Task name cannot be empty");
      return;
    }

    await editUser(user.email, { name: updatedUser?.name, role: updatedUser?.role }, session);

    setEditedUsers(prevUsers =>
    prevUsers.map(u =>
          u.email === user.email ? { ...u, name: updatedUser?.name || '', role: updatedUser?.role || '' } : u
        )
    );

    setEditingUserEmail(undefined);
    setNameError("");
  };

  const handleChange = (email: string, field: keyof User, value: string) => {
    setEditedUsers(prevUsers =>
      prevUsers.map(user =>
        user.email === email ? { ...user, [field]: value } : user
      )
    );
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
            {editedUsers.length ? (
              editedUsers.map((user) => (
                <tr key={user.email} className="w-full border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3 text-left">
                    {editingUserEmail === user.email ? (
                      <div>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => handleChange(user.email, 'name', e.target.value)}
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
