import UserDetails from "@/components/user-details";
import dbConnect from "@/utils/mongodb";
import User from "@/models/User";

const UserDetailsPage = async () => {
  await dbConnect();
  const users = await User.find().select("name email role createdAt");

  const editUser = async (email: string, updates: Partial<{ name: string; role: string }>, session: any) => {
    'use server'
    if (session?.user?.role !== "admin") {
      console.error("Only admin can edit users");
      return;
    }
    await dbConnect();
    await User.updateOne({ email }, updates);
  };

  return <UserDetails users={users} editUser={editUser} />;
};

export default UserDetailsPage;
