import AddNewTask from "@/components/create-task";
import TaskList from "@/components/task-list";
import Task from "@/models/Task";
import dbConnect from "@/utils/mongodb";
import Group from "@/models/Group";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/models/User";

export default async function Home() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const userGroups = await Group.find({ users: session?.user.email }).select("uuid");
  const userGroupIds = userGroups.map((group) => group.uuid);
  const developerTasks = await Task.find({ assignedGroup: { $in: userGroupIds } }).select(
    "uuid name description status assignedTo assignedGroup",
  );
  const allTasks = await Task.find().select("uuid name description status assignedTo");
  const groups = await Group.find().select("uuid name users createdAt");
  const tasks = session?.user.roles.includes(UserRole.Developer) ? developerTasks : allTasks;

  return (
    <div className="flex flex-col gap-4">
      <AddNewTask initialGroups={groups} />
      <TaskList initialTasks={tasks} />
    </div>
  );
}
