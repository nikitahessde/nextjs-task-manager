'use client'

import { useTasks } from "@/context/task-context";
import { useState } from 'react';
import ModeEdit from "@mui/icons-material/ModeEdit";
import Check from "@mui/icons-material/Check";

interface Task {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: Date;
}

export const TaskDetails = () => {
  const { tasks, updateTask } = useTasks();
  const [editingTaskId, setEditingTaskId] = useState('');
  const [editedTask, setEditedTask] = useState({ name: '', description: '', status: '' });
  const [nameError, setNameError] = useState('');

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({ name: task.name, description: task.description, status: task.status });
    setNameError('');
  };

  const handleSave = (task: Task) => {
    if (editedTask.name.trim() === '') {
      setNameError('Task name cannot be empty');
      return;
    }
    updateTask(task.id, {
        name: editedTask.name,
        description: editedTask.description,
        status: editedTask.status
    })
    setEditingTaskId('');
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
                        <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {tasks.length ? (
                        tasks.map((task) => (
                            <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-100 w-full">
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.id ? (
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
                                    {editingTaskId === task.id ? (
                                        <textarea 
                                            value={editedTask.description} 
                                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })} 
                                            className="border p-2 rounded w-full"
                                        />
                                    ) : task.description}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.id ? (
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
                                <td className="py-3 px-6 text-left">{task.createdAt.toDateString()}</td>
                                <td className="py-3 px-6 text-left">
                                    {editingTaskId === task.id ? (
                                        <Check onClick={() => handleSave(task)} className="cursor-pointer">
                                            Save
                                        </Check>
                                    ) : (
                                        <ModeEdit onClick={() => handleEdit(task)} className="cursor-pointer">
                                            Edit
                                        </ModeEdit>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-3 px-6 text-center text-base text-primary">No tasks</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default TaskDetails;