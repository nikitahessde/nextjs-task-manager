"use client";

import { useEffect, useState } from "react";
import ModeEdit from "@mui/icons-material/ModeEdit";
import Check from "@mui/icons-material/Check";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";
import { useSnackbar } from "@/context/snackbar-context";
import { useTranslations } from "next-intl";
import { DeleteOutline } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setGroups } from "@/redux/slices/groupsSlice";
import { useGroups } from "@/redux/selectors";
import { editGroup as editReduxGroup } from "@/redux/slices/groupsSlice";
import { deleteGroup as deleteReduxGroup } from "@/redux/slices/groupsSlice";
import Close from "@mui/icons-material/Close";

interface Group {
  uuid: string;
  name: string;
  users?: string[];
}

interface GroupDetailsProps {
  initialGroups: Group[];
  editGroup: (uuid: string, updates: Partial<{ name: string; users: string[] }>) => Promise<void>;
  deleteGroup: (uuid: string) => Promise<void>;
}

export const GroupDetails = ({ initialGroups, editGroup, deleteGroup }: GroupDetailsProps) => {
  const t = useTranslations("group-details");
  const dispatch = useDispatch();
  const groups = useGroups();
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();
  const [editingGroupId, setEditingGroupId] = useState<string>();
  const [editedGroup, setEditedGroup] = useState({
    name: "",
  });
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    dispatch(setGroups(initialGroups));
  }, [initialGroups, dispatch]);

  const handleEdit = (group: Group) => {
    if (!session?.user?.roles.includes(UserRole.Admin)) {
      showSnackbar(t("permissions"));
      return;
    }
    setEditingGroupId(group.uuid);
    setEditedGroup({
      name: group.name,
    });
    setNameError("");
  };

  const handleSave = (group: Group) => {
    if (editedGroup.name.trim() === "") {
      setNameError(t("empty-name"));
      return;
    }
    editGroup(group.uuid, {
      name: editedGroup.name,
    });
    dispatch(editReduxGroup({ uuid: group.uuid, updates: { name: editedGroup.name } }));
    setEditingGroupId(undefined);
    setNameError("");
  };

  const handleGroupDelete = (uuid: string) => {
    deleteGroup(uuid);
    dispatch(deleteReduxGroup({ uuid }));
  };

  const handleRemoveUser = async (groupId: string, userEmail: string) => {
    const updatedUsers =
      groups
        .find((group) => group.uuid === groupId)
        ?.users?.filter((email) => email !== userEmail) || [];
    await editGroup(groupId, { users: updatedUsers });
    dispatch(editReduxGroup({ uuid: groupId, updates: { users: updatedUsers } }));
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-primary bg-secondary p-4">
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-sm leading-normal text-gray-600">
              <th className="px-6 py-3 text-left">{t("name")}</th>
              <th className="px-6 py-3 text-left">{t("group-members")}</th>
              <th className="px-6 py-3 text-left">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light text-gray-600">
            {groups.length ? (
              groups.map((group) => (
                <tr key={group.uuid} className="w-full border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-3 text-left">
                    {editingGroupId === group.uuid &&
                    session?.user?.roles.includes(UserRole.Admin) ? (
                      <div>
                        <input
                          type="text"
                          value={editedGroup.name}
                          onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })}
                          className="rounded border p-2"
                        />
                        {nameError && <div className="text-xs text-red-500">{nameError}</div>}
                      </div>
                    ) : (
                      group.name
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {group.users && group.users.length > 0 ? (
                      <div>
                        {group.users.map((userEmail) => (
                          <div key={userEmail} className="flex items-center gap-2 py-1">
                            <span>{userEmail}</span>
                            <Close
                              className="cursor-pointer"
                              onClick={() => handleRemoveUser(group.uuid, userEmail)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>{t("no-members")}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {editingGroupId === group.uuid ? (
                      <Check onClick={() => handleSave(group)} className="cursor-pointer"></Check>
                    ) : (
                      <div className="flex gap-2">
                        <ModeEdit
                          onClick={() => group.uuid && handleEdit(group)}
                          className="cursor-pointer"
                        ></ModeEdit>
                        <DeleteOutline
                          className={"cursor-pointer"}
                          onClick={() => handleGroupDelete(group.uuid)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-3 text-center text-base text-primary">
                  {t("no-groups")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupDetails;
