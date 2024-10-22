'use client'

import { useTasks } from "@/context/task-context";
import { useEffect, useState } from 'react';
import ModeEdit from "@mui/icons-material/ModeEdit";
import Check from "@mui/icons-material/Check";

interface Task {
    uuid: string;
    name: string;
    description: string;
    status: string;
    createdAt: Date;
    assignedTo: string;
}

interface User {
    email: string;
    name: string;
}

export const TaskDetails = () => {
  const { tasks, updateTask } = useTasks();
  const [editingTaskId, setEditingTaskId] = useState<string>();
  const [editedTask, setEditedTask] = useState({ name: '', description: '', status: '', assignedTo: '' }); // Added assignedTo to editedTask state
  const [nameError, setNameError] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    };
    fetchUsers();
}, []);

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.uuid);
    setEditedTask({ name: task.name, description: task.description, status: task.status, assignedTo: task.assignedTo }); // Added assignedTo to setEditedTask
    setNameError('');
  };

  const handleSave = (task: Task) => {
    if (editedTask.name.trim() === '') {
      setNameError('Task name cannot be empty');
      return;
    }
    updateTask(task.uuid, {
        name: editedTask.name,
        description: editedTask.description,
        status: editedTask.status,
        assignedTo: editedTask.assignedTo // Added assignedTo to updateTask
    })
    setEditingTaskId(undefined);
    setNameError('');
  };

  return (
    <div className="border-2 border-primary bg-secondary rounded-lg p-4 flex flex-col gap-4">
      <div className="overflow-x-auto rounded-lg w-full">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Description</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Created At</th>
                        <th className="py-3 px-6 text-left">Assigned To</th>
                        <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {tasks.length ? (
                        tasks.map((task) => (
                            <tr key={task.uuid} className="border-b border-gray-200 hover:bg-gray-100 w-full">
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.uuid ? (
                                        <div>
                                            <input 
                                                type="text" 
                                                value={editedTask.name} 
                                                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })} 
                                                className="border p-2 rounded"
                                            />
                                            {nameError && <div className="text-red-500 text-xs">{nameError}</div>}
                                        </div>
                                    ) : task.name}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.uuid ? (
                                        <textarea 
                                            value={editedTask.description} 
                                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} 
                                            className="border p-2 rounded w-full"
                                        />
                                    ) : task.description}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.uuid ? (
                                        <select 
                                            value={editedTask.status} 
                                            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })} 
                                            className="border p-2 rounded"
                                        >
                                            <option value="todo">To do</option>
                                            <option value="inProgress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    ) : task.status === 'todo' ? 'To do' : 
                                    task.status === 'inProgress' ? 'In Progress' : 
                                    'Done'}
                                </td>
                                <td className="py-3 px-6 text-left">{new Date(task.createdAt).toDateString()}</td>
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.uuid ? (
                                        <select 
                                            value={editedTask.assignedTo} 
                                            onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })} 
                                            className="border p-2 rounded"
                                        >
                                            {users.map((user) => (
                                                <option key={user.email} value={user.email}>{user.name}</option>
                                            ))}
                                        </select>
                                    ) : task.assignedTo}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.uuid ? (
                                        <Check onClick={() => handleSave(task)} className="cursor-pointer">
                                            Save
                                        </Check>
                                    ) : (
                                        <ModeEdit onClick={() => task.uuid && handleEdit(task)} className="cursor-pointer">
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

export default TaskDetails;
