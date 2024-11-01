import UserDetails from "@/components/user-details";
import dbConnect from "@/utils/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/models/User";

const UserDetailsPage = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = await User.findOne({ email: session?.user.email }).select(
    "name email roles createdAt",
  );

  const editUser = async (email: string, updates: Partial<{ name: string }>) => {
    "use server";
    if (
      !session ||
      !(
        session.user.roles.includes(UserRole.Admin) ||
        session.user.roles.includes(UserRole.Manager)
      )
    ) {
      console.error("No session found. Editing not allowed.");
      return;
    }
    await dbConnect();
    await User.updateOne({ email }, updates);
  };

  return <UserDetails user={user} editUser={editUser} />;
};

export default UserDetailsPage;
