"use client";

import { DeleteOutline } from "@mui/icons-material";
import { useTasks } from "@/context/task-context";
import { Tooltip } from "@mui/material";

interface Task {
  uuid: string;
  name: string;
  description: string;
  status: string;
  assignedTo: string;
}

export const TaskList = () => {
  const { tasks, removeTask, changeStatus } = useTasks();
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
                  onChange={(e) => task.uuid && changeStatus(task.uuid, e.target.value)}
                >
                  <option value="todo">To do</option>
                  <option value="inProgress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <DeleteOutline
                  className="cursor-pointer"
                  onClick={() => task.uuid && removeTask(task.uuid)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No tasks to show</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
