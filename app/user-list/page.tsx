import { UserList } from "@/components/user-list";
import dbConnect from "@/utils/mongodb";
import User from "@/models/User";

const UserListPage = async () => {
  await dbConnect();
  const users = await User.find().select("name email role createdAt")

  return <UserList users={users} />;
};

export default UserListPage;
