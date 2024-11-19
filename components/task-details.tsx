"use client";

import { useTasks } from "@/context/task-context";
import { useEffect, useState } from "react";
import ModeEdit from "@mui/icons-material/ModeEdit";
import Check from "@mui/icons-material/Check";
import { useSession } from "next-auth/react";
import { useSnackbar } from "@/context/snackbar-context";
import { useTranslations } from "next-intl";
import { isAdmin, isManager } from "@/utils/auth";

interface Task {
  uuid: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  assignedTo: string;
  assignedGroup: string;
}

interface User {
  email: string;
  name: string;
}

interface Group {
  uuid: string;
  name: string;
  createdAt: Date;
  users?: string[];
}

export const TaskDetails = ({ groups }: { groups: Group[] }) => {
  const t = useTranslations("task-details");
  const { tasks, updateTask } = useTasks();
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();
  const [editingTaskId, setEditingTaskId] = useState<string>();
  const [editedTask, setEditedTask] = useState({
    name: "",
    description: "",
    status: "",
    assignedTo: "",
    assignedGroup: "",
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
    if (!isAdmin(session) && !isManager(session)) {
      showSnackbar(t("permissions"));
      return;
    }
    setEditingTaskId(task.uuid);
    setEditedTask({
      name: task.name,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo,
      assignedGroup: task.assignedGroup,
    });
    setNameError("");
  };

  const handleSave = (task: Task) => {
    if (editedTask.name.trim() === "") {
      setNameError(t("empty-name"));
      return;
    }
    updateTask(task.uuid, {
      name: editedTask.name,
      description: editedTask.description,
      status: editedTask.status,
      assignedTo: editedTask.assignedTo,
      assignedGroup: editedTask.assignedGroup,
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
              <th className="px-6 py-3 text-left">{t("name")}</th>
              <th className="px-6 py-3 text-left">{t("description")}</th>
              <th className="px-6 py-3 text-left">{t("status")}</th>
              <th className="px-6 py-3 text-left">{t("created-at")}</th>
              <th className="px-6 py-3 text-left">{t("assigned-to")}</th>
              <th className="px-6 py-3 text-left">{t("assigned-group")}</th>
              <th className="px-6 py-3 text-left">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-gray-600">
            {tasks.length ? (
              tasks.map((task) => (
                <tr key={task.uuid} className="w-full border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid && isAdmin(session) ? (
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
                    {editingTaskId === task.uuid && isAdmin(session) ? (
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
                    {editingTaskId === task.uuid && isAdmin(session) ? (
                      <select
                        value={editedTask.status}
                        onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                        className="rounded border p-2"
                      >
                        <option value="todo">{t("to-do")}</option>
                        <option value="inProgress">{t("in-progress")}</option>
                        <option value="done">{t("done")}</option>
                      </select>
                    ) : task.status === "todo" ? (
                      t("to-do")
                    ) : task.status === "inProgress" ? (
                      t("in-progress")
                    ) : (
                      t("done")
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">{new Date(task.createdAt).toDateString()}</td>
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid && (isAdmin(session) || isManager(session)) ? (
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
                      <select
                        value={editedTask.assignedGroup}
                        onChange={(e) =>
                          setEditedTask({ ...editedTask, assignedGroup: e.target.value })
                        }
                        className="rounded border p-2"
                      >
                        {groups.map((group) => (
                          <option key={group.uuid} value={group.uuid}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      groups.find((group) => group.uuid === task.assignedGroup)?.name ||
                      "No group assigned"
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {editingTaskId === task.uuid ? (
                      <Check onClick={() => handleSave(task)} className="cursor-pointer">
                        {t("save")}
                      </Check>
                    ) : (
                      <ModeEdit
                        onClick={() => task.uuid && handleEdit(task)}
                        className="cursor-pointer"
                      >
                        {t("edit")}
                      </ModeEdit>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-3 text-center text-base text-primary">
                  {t("no-tasks")}
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
