import AddNewTask from "@/components/create-task";
import TaskList from "@/components/task-list";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <AddNewTask />
      <TaskList />
    </div>
  );
}
