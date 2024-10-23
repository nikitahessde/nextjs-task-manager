'use client'

import { useTasks } from "@/context/task-context";
import { useEffect, useState } from 'react';
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
  const { users, updateUser } = useUsers()
  const [editingUserEmail, setEditingUserEmail] = useState<string>();
  const [editedUser, setEditedUser] = useState({ name: '', role: '' });
  const [nameError, setNameError] = useState('');

  const handleEdit = (user: User) => {
    setEditingUserEmail(user.email);
    setEditedUser({ name: user.name, role: user.role });
    setNameError('');
  };

  const handleSave = (user: User) => {
    if (editedUser.name.trim() === '') {
      setNameError('Task name cannot be empty');
      return;
    }
    updateUser(user.email, {
        name: editedUser.name,
        role: editedUser.role,
    })
    setEditingUserEmail(undefined);
    setNameError('');
  };

  return (
    <div className="border-2 border-primary bg-secondary rounded-lg p-4 flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg w-full">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Role</th>
                        <th className="py-3 px-6 text-left">Created At</th>
                        <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {users.length ? (
                        users.map((user) => (
                            <tr key={user.email} className="border-b border-gray-200 hover:bg-gray-100 w-full">
                                <td className="py-3 px-6 text-left">
                                    {editingUserEmail === user.email ? (
                                        <div>
                                            <input 
                                                type="text" 
                                                value={editedUser.name} 
                                                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} 
                                                className="border p-2 rounded"
                                            />
                                            {nameError && <div className="text-red-500 text-xs">{nameError}</div>}
                                        </div>
                                    ) : user.name}
                                </td>
                                <td className="py-3 px-6 text-left">
                                   {user.email}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {editingUserEmail === user.email ? (
                                        <select 
                                            value={editedUser.role} 
                                            onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })} 
                                            className="border p-2 rounded"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="developer">Developer</option>
                                            <option value="guest">Guest</option>
                                        </select>
                                    ) : user.role}
                                </td>
                                <td className="py-3 px-6 text-left">{new Date(user.createdAt).toDateString()}</td>
                                <td className="py-3 px-6 text-left">
                                    {editingUserEmail === user.email ? (
                                        <Check onClick={() => handleSave(user)} className="cursor-pointer">
                                            Save
                                        </Check>
                                    ) : (
                                        <ModeEdit onClick={() => user.email && handleEdit(user)} className="cursor-pointer">
                                            Edit
                                        </ModeEdit>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-3 px-6 text-center text-base text-primary">No tasks</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default UserDetails;