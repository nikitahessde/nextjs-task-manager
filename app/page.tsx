import AddNewTask from "@/components/create-task";
import TaskList from "@/components/task-list";
import dbConnect from "@/utils/mongodb";
import Group from "@/models/Group";

export default async function Home() {
  await dbConnect();
  const groups = await Group.find().select("uuid name users createdAt");

  return (
    <div className="flex flex-col gap-4">
      <AddNewTask initialGroups={groups} />
      <TaskList />
    </div>
  );
}
