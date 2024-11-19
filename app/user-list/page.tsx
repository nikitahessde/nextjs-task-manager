import { UserList } from "@/components/user-list";
import dbConnect from "@/utils/mongodb";
import User from "@/models/User";
import Group from "@/models/Group";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/utils/auth";

const UserListPage = async () => {
  await dbConnect();
  const users = await User.find().select("name email roles");
  const groups = await Group.find().select("uuid name users");

  const assignUserToGroup = async (userEmail: string, groupId: string) => {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      console.error("No session found. Assigning not allowed.");
      return;
    }
    await dbConnect();
    const group = await Group.findOne({ uuid: groupId });
    if (group) {
      if (!group.users.includes(userEmail)) {
        group.users.push(userEmail);
        await group.save();
      }
    }
  };

  return <UserList initialUsers={users} groups={groups} assignUserToGroup={assignUserToGroup} />;
};

export default UserListPage;
