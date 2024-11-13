import CreateGroup from "@/components/create-group";
import dbConnect from "@/utils/mongodb";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/models/User";
import { getServerSession } from "next-auth";
import Group from "@/models/Group";
import GroupDetails from "@/components/group-details";

interface Group {
  uuid: string;
  name: string;
  users?: string[];
}

const GroupsPage = async () => {
  await dbConnect();
  const groups = await Group.find().select("uuid name users");

  const editGroup = async (uuid: string, updates: Partial<{ name: string; users: string[] }>) => {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes(UserRole.Admin)) {
      console.error("No session found. Editing not allowed.");
      return;
    }
    await dbConnect();
    await Group.updateOne({ uuid }, updates);
  };

  const addGroup = async (group: Group) => {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes(UserRole.Admin)) {
      console.error("No session found. Editing not allowed.");
      return;
    }
    await dbConnect();
    const newGroup = new Group(group);
    await newGroup.save();
  };

  const deleteGroup = async (uuid: string) => {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes(UserRole.Admin)) {
      console.error("No session found. Deleting not allowed.");
      return;
    }
    await dbConnect();
    await Group.deleteOne({ uuid });
  };

  return (
    <>
      <CreateGroup addGroup={addGroup} />
      <GroupDetails initialGroups={groups} editGroup={editGroup} deleteGroup={deleteGroup} />
    </>
  );
};

export default GroupsPage;
