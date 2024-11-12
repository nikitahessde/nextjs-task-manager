import AddNewTask from "@/components/create-task";
import TaskList from "@/components/task-list";
import Task from "@/models/Task";
import dbConnect from "@/utils/mongodb";
import Group from "@/models/Group";

export default async function Home() {
  await dbConnect();
  const tasks = await Task.find().select("uuid name description status assignedTo");
  const groups = await Group.find().select("uuid name users createdAt");

  return (
    <div className="flex flex-col gap-4">
      <AddNewTask initialGroups={groups}/>
      <TaskList initialTasks={tasks} />
    </div>
  );
}
