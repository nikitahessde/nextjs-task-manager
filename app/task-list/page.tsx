import TaskList from "@/components/task-list";
import { authOptions } from "@/lib/auth";
import Group from "@/models/Group";
import Task from "@/models/Task";
import { UserRole } from "@/models/User";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";

const TaskListPage = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const userGroups = await Group.find({ users: session?.user.email }).select("uuid");
  const userGroupIds = userGroups.map((group) => group.uuid);
  const developerTasks = await Task.find({ assignedGroup: { $in: userGroupIds } }).select(
    "uuid name description status assignedTo assignedGroup",
  );
  const allTasks = await Task.find().select("uuid name description status assignedTo");

  const tasks = session?.user.roles.includes(UserRole.Developer) ? developerTasks : allTasks;

  return <TaskList initialTasks={tasks} />;
};

export default TaskListPage;
