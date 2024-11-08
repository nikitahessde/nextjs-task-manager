import { UserList } from "@/components/user-list";
import dbConnect from "@/utils/mongodb";
import User, { UserRole } from "@/models/User";

interface User {
  name: string;
  email: string;
  roles: UserRole[];
}

const UserListPage = async () => {
  await dbConnect();
  const users = await User.find().select("name email roles");

  return <UserList initialUsers={users}/>;
};

export default UserListPage;
