"use client";

import { DeleteOutline } from "@mui/icons-material";
import { useTasks } from "@/context/task-context";
import { Snackbar, Tooltip } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserRole } from "@/models/User";

interface Task {
  uuid: string;
  name: string;
  description: string;
  status: string;
  assignedTo: string;
}

export const TaskList = () => {
  const { tasks, removeTask, changeStatus } = useTasks();
  const { data: session } = useSession();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleStatusChange = (uuid: string, newStatus: string) => {
    if (session?.user?.role.includes(UserRole.Admin)) {
      setSnackbarOpen(true);
      return;
    }
    changeStatus(uuid, newStatus);
  };

  const handleRemoveTask = (uuid: string) => {
    if (session?.user?.role.includes(UserRole.Admin)) {
      setSnackbarOpen(true);
      return;
    }
    removeTask(uuid);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto rounded-lg border-2 border-primary bg-secondary p-4">
      <p className="text-xl font-semibold">Task list</p>
      <div className="flex flex-col gap-4">
        {tasks.length ? (
          tasks.map((task: Task) => (
            <div
              key={task.uuid}
              className="flex w-full items-center justify-between rounded-lg border px-4 py-2"
            >
              <div className="flex w-2/3 flex-grow items-center">
                <div className="max-w-full flex-grow">
                  <p className="break-all text-base font-semibold">{task.name}</p>
                  <Tooltip title={task.description} placement="top">
                    <p className="truncate break-words text-sm text-gray-500">{task.description}</p>
                  </Tooltip>
                </div>
              </div>
              <div className="flex w-1/3 items-center justify-end gap-2">
                <select
                  className="rounded-md border px-2 py-1 text-sm"
                  value={task.status}
                  onChange={(e) => task.uuid && handleStatusChange(task.uuid, e.target.value)}
                >
                  <option value="todo">To do</option>
                  <option value="inProgress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <DeleteOutline
                  className="cursor-pointer"
                  onClick={() => task.uuid && handleRemoveTask(task.uuid)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No tasks to show</p>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={"You do not have permission to interact with tasks"}
      />
    </div>
  );
};

export default TaskList;
