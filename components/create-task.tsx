"use client";

import { useEffect, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTasks } from "@/context/task-context";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";
import { useSnackbar } from "@/context/snackbar-context";
import { useTranslations } from "next-intl";
import { useGroups } from "@/redux/selectors";
import { setGroups } from "@/redux/slices/groupsSlice";
import { useDispatch } from "react-redux";

interface User {
  email: string;
  name: string;
  roles: UserRole[];
}

interface Group {
  uuid: string;
  name: string;
  createdAt: Date;
  users?: string[];
}

export const AddNewTask = ({ initialGroups }: { initialGroups: Group[] }) => {
  const t = useTranslations("create-task");
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const groups = useGroups();
  const { addTask } = useTasks();
  const { showSnackbar } = useSnackbar();
  const { data: session } = useSession();

  useEffect(() => {
    dispatch(setGroups(initialGroups));
  }, [initialGroups]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, [session]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      taskName: "",
      taskDescription: "",
      assignedTo: "",
      assignedGroup: "",
    },
  });

  const onSubmit = (data: {
    taskName: string;
    taskDescription: string;
    assignedTo: string;
    assignedGroup: string;
  }) => {
    if (!session?.user?.roles.includes(UserRole.Admin)) {
      showSnackbar(t("permissions"));
      return;
    }
    const newTask = {
      uuid: crypto.randomUUID(),
      name: data.taskName,
      description: data.taskDescription,
      status: "todo",
      createdAt: new Date(),
      assignedTo: data.assignedTo,
      assignedGroup: data.assignedGroup,
    };
    addTask(newTask);
    reset();
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <div className="flex justify-between">
        <p className="text-xl font-semibold">{t("new-task")}</p>
        {isCollapsed ? (
          <ExpandMore onClick={() => setIsCollapsed(false)} className="cursor-pointer" />
        ) : (
          <ExpandLess onClick={() => setIsCollapsed(true)} className="cursor-pointer" />
        )}
      </div>
      <form
        className={`space-y-4 ${isCollapsed ? "hidden" : ""}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="taskName" className="block text-sm font-medium text-primary">
              {t("new-task")}
            </label>
            <input
              type="text"
              id="taskName"
              {...register("taskName", {
                required: t("task-name-required"),
                maxLength: { value: 50, message: t("max-length") + "50" },
              })}
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              placeholder={t("enter-task-name")}
            />
          </div>
          {errors.taskName && <div className="text-xs text-red-500">{errors.taskName.message}</div>}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-primary">
              {t("task-description")}
            </label>
            <textarea
              id="taskDescription"
              {...register("taskDescription", {
                required: t("task-description-required"),
                maxLength: { value: 150, message: t("max-length") + "150" },
              })}
              rows={3}
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              placeholder={t("enter-task-description")}
            ></textarea>
          </div>
          {errors.taskDescription && (
            <div className="text-xs text-red-500">{errors.taskDescription.message}</div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="assignTo" className="block text-sm font-medium text-primary">
              {t("assignee")}
            </label>
            <select
              id="assignTo"
              {...register("assignedTo")}
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
            >
              <option value="">{t("assign-to")}</option>
              {users.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          {errors.assignedTo && (
            <div className="text-xs text-red-500">{errors.assignedTo.message}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="assignTo" className="block text-sm font-medium text-primary">
            {t("assign-to-group")}
          </label>
          <select
            id="assignTo"
            {...register("assignedGroup")}
            className="w-full rounded-lg border border-gray-400 p-2 text-sm"
          >
            <option value="">{t("select-group")}</option>
            {groups.map((group) => (
              <option key={group.uuid} value={group.uuid}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-black"
        >
          {t("add-task")}
        </button>
      </form>
    </div>
  );
};

export default AddNewTask;
