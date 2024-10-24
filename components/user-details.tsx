"use client";

import { useState } from "react";
import ModeEdit from "@mui/icons-material/ModeEdit";
import Check from "@mui/icons-material/Check";
import { useUsers } from "@/context/user-context";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export const UserDetails = () => {
  const { users, updateUser } = useUsers();
  const [editingUserEmail, setEditingUserEmail] = useState<string>();
  const [editedUser, setEditedUser] = useState({ name: "", role: "" });
  const [nameError, setNameError] = useState("");

  const handleEdit = (user: User) => {
    setEditingUserEmail(user.email);
    setEditedUser({ name: user.name, role: user.role });
    setNameError("");
  };

  const handleSave = (user: User) => {
    if (editedUser.name.trim() === "") {
      setNameError("Task name cannot be empty");
      return;
    }
    updateUser(user.email, {
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
                  <td className="px-6 py-3 text-left">
                    {editingUserEmail === user.email ? (
                      <select
                        value={editedUser.role}
                        onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                        className="rounded border p-2"
                      >
                        <option value="admin">Admin</option>
                        <option value="developer">Software Developer</option>
                        <option value="manager">Manager</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">{new Date(user.createdAt).toDateString()}</td>
                  <td className="px-6 py-3 text-left">
                    {editingUserEmail === user.email ? (
                      <Check onClick={() => handleSave(user)} className="cursor-pointer">
                        Save
                      </Check>
                    ) : (
                      <ModeEdit
                        onClick={() => user.email && handleEdit(user)}
                        className="cursor-pointer"
                      >
                        Edit
                      </ModeEdit>
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
