"use client";

import { useTasks } from "@/context/task-context";
import { useEffect, useState } from "react";
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
  const [editedTask, setEditedTask] = useState({
    name: "",
    description: "",
    status: "",
    assignedTo: "",
  });
  const [nameError, setNameError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.uuid);
    setEditedTask({
      name: task.name,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo,
    });
    setNameError("");
  };

  const handleSave = (task: Task) => {
    if (editedTask.name.trim() === "") {
      setNameError("Task name cannot be empty");
      return;
    }
    updateTask(task.uuid, {
      name: editedTask.name,
      description: editedTask.description,
      status: editedTask.status,
      assignedTo: editedTask.assignedTo,
    });
    setEditingTaskId(undefined);
    setNameError("");
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-sm leading-normal text-gray-600">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Assigned To</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-gray-600">
            {tasks.length ? (
              tasks.map((task) => (
                <tr key={task.uuid} className="w-full border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid ? (
                      <div>
                        <input
                          type="text"
                          value={editedTask.name}
                          onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                          className="rounded border p-2"
                        />
                        {nameError && <div className="text-xs text-red-500">{nameError}</div>}
                      </div>
                    ) : (
                      task.name
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid ? (
                      <textarea
                        value={editedTask.description}
                        onChange={(e) =>
                          setEditedTask({ ...editedTask, description: e.target.value })
                        }
                        className="w-full rounded border p-2"
                      />
                    ) : (
                      task.description
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid ? (
                      <select
                        value={editedTask.status}
                        onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                        className="rounded border p-2"
                      >
                        <option value="todo">To do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    ) : task.status === "todo" ? (
                      "To do"
                    ) : task.status === "inProgress" ? (
                      "In Progress"
                    ) : (
                      "Done"
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">{new Date(task.createdAt).toDateString()}</td>
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid ? (
                      <select
                        value={editedTask.assignedTo}
                        onChange={(e) =>
                          setEditedTask({ ...editedTask, assignedTo: e.target.value })
                        }
                        className="rounded border p-2"
                      >
                        {users.map((user) => (
                          <option key={user.email} value={user.email}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      task.assignedTo
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid ? (
                      <Check onClick={() => handleSave(task)} className="cursor-pointer">
                        Save
                      </Check>
                    ) : (
                      <ModeEdit
                        onClick={() => task.uuid && handleEdit(task)}
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
                  No tasks
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskDetails;
