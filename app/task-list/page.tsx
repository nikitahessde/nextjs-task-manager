import TaskList from "@/components/task-list";
import Task from "@/models/Task";
import dbConnect from "@/utils/mongodb";

const TaskListPage = async () => {
  await dbConnect();
  const tasks = await Task.find().select("uuid name description status assignedTo");

  return <TaskList initialTasks={tasks} />;
};

export default TaskListPage;
