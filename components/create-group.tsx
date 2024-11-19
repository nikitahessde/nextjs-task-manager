"use client";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useSnackbar } from "@/context/snackbar-context";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { addGroup as addReduxGroup } from "@/redux/slices/groupsSlice";
import { isAdmin } from "@/utils/auth";

interface Group {
  uuid: string;
  name: string;
  users?: string[];
}

interface CreateGroupProps {
  addGroup: (group: Group) => Promise<void>;
}

export const CreateGroup = ({ addGroup }: CreateGroupProps) => {
  const t = useTranslations("create-group");
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      groupName: "",
    },
  });

  const onSubmit = (data: { groupName: string }) => {
    try {
      if (!isAdmin(session)) {
        showSnackbar(t("permissions"));
        return;
      }
      const newGroup = {
        uuid: crypto.randomUUID(),
        name: data.groupName,
      };
      addGroup(newGroup);
      dispatch(addReduxGroup(newGroup));
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <div className="flex justify-between">
        <p className="text-xl font-semibold">{t("new-group")}</p>
      </div>
      <form className={"space-y-4"} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <label htmlFor="groupName" className="block text-sm font-medium text-primary">
              {t("group-name")}
            </label>
            <input
              type="text"
              id="groupName"
              {...register("groupName", {
                required: t("group-name-required"),
                maxLength: { value: 50, message: t("max-length") + "50" },
              })}
              className="w-full rounded-lg border border-gray-400 p-2 text-sm"
              placeholder={t("enter-group-name")}
            />
          </div>
          {errors.groupName && (
            <div className="text-xs text-red-500">{errors.groupName.message}</div>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-black"
        >
          {t("create-group")}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
