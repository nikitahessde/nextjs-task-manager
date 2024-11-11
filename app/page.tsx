import AddNewTask from "@/components/create-task";
import TaskList from "@/components/task-list";
import Task from "@/models/Task";
import dbConnect from "@/utils/mongodb";

export default async function Home() {
  await dbConnect();
  const tasks = await Task.find().select("uuid name description status assignedTo");

  return (
    <div className="flex flex-col gap-4">
      <AddNewTask />
      <TaskList initialTasks={tasks} />
    </div>
  );
}
