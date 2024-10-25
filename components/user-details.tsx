"use client";

import { useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface UserListProps {
    user: User;
    editUser: (email: string, updates: Partial<{ name: string }>) => Promise<void>;
}

export const UserDetails = ({ user, editUser }: UserListProps) => {
  const [editingUserEmail, setEditingUserEmail] = useState<string | undefined>();
  const [nameError, setNameError] = useState("");
  const [editedUser, setEditedUser] = useState<User>({...user});

  const handleSave = async () => {
    if (editedUser && editedUser.name.trim() === "") {
      setNameError("Task name cannot be empty");
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
            <label className="text-sm">Name</label>
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => {
                setEditedUser({ ...editedUser, name: e.target.value });
                user.email && setEditingUserEmail(user.email);
              }}
              className="rounded border p-2"
            />
            {nameError && <div className="text-xs text-red-500">{nameError}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="rounded border p-2 bg-gray-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="rounded border p-2 bg-gray-200"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {editingUserEmail === user.email && (
              <div className="flex gap-2">
                <button onClick={handleSave} className="cursor-pointer bg-primary py-2 px-4 text-white rounded-lg text-sm">
                  Save
                </button>
                <button onClick={handleCancel} className="cursor-pointer py-2 px-4 border border-black rounded-lg text-sm">
                  Cancel
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
