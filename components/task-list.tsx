"use client";

import { DeleteOutline, Search } from "@mui/icons-material";
import { useTasks } from "@/context/task-context";
import { Tooltip } from "@mui/material";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";
import { useSnackbar } from "@/context/snackbar-context";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { useFilteredAndSortedTasks } from "@/redux/selectors";
import {
  changeTaskStatus,
  deleteTask,
  setSearchTerm,
  setSortOrder,
  setTasks,
} from "@/redux/slices/tasksSlice";
import { useEffect } from "react";

interface Task {
  uuid: string;
  name: string;
  description: string;
  status: string;
  assignedTo: string;
}

interface TaskListProps {
  initialTasks: Task[];
}

export const TaskList = ({ initialTasks }: TaskListProps) => {
  const dispatch = useDispatch();
  const t = useTranslations("task-list");
  const tasks = useFilteredAndSortedTasks();
  const { removeTask, changeStatus } = useTasks();
  const { showSnackbar } = useSnackbar();
  const { data: session } = useSession();

  useEffect(() => {
    dispatch(setTasks(initialTasks));
  }, [initialTasks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSortChange = (order: "asc" | "desc") => {
    dispatch(setSortOrder(order));
  };

  const handleStatusChange = (uuid: string, newStatus: string) => {
    if (!session?.user?.roles.includes(UserRole.Admin)) {
      showSnackbar("You do not have permission to interact with tasks");
      return;
    }
    changeStatus(uuid, newStatus);
    dispatch(changeTaskStatus({ uuid, status: newStatus }));
  };

  const handleRemoveTask = (uuid: string) => {
    if (!session?.user?.roles.includes(UserRole.Admin)) {
      showSnackbar("You do not have permission to interact with tasks");
      return;
    }
    removeTask(uuid);
    dispatch(deleteTask({ uuid }));
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto rounded-lg border-2 border-primary bg-secondary p-4">
      <p className="text-xl font-semibold">{t("task-list")}</p>
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <Search />
          <input
            type="text"
            placeholder={t("search")}
            onChange={handleSearchChange}
            className="rounded-lg border p-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSortChange("asc")} className="rounded-md border p-2 text-sm">
            {t("asc")}
          </button>
          <button
            onClick={() => handleSortChange("desc")}
            className="rounded-md border p-2 text-sm"
          >
            {t("desc")}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {tasks?.length ? (
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
                  <option value="todo">{t("to-do")}</option>
                  <option value="inProgress">{t("in-progress")}</option>
                  <option value="done">{t("done")}</option>
                </select>
                <DeleteOutline
                  className="cursor-pointer"
                  onClick={() => task.uuid && handleRemoveTask(task.uuid)}
                />
              </div>
            </div>
          ))
        ) : (
          <p>{t("no-tasks")}</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
