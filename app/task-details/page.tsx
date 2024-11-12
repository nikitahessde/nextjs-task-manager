import TaskDetails from "@/components/task-details";
import dbConnect from "@/utils/mongodb";
import Group from "@/models/Group";

const TaskDetailsPage = async () => {
  await dbConnect();
  const groups = await Group.find().select("uuid name users createdAt");
  return <TaskDetails groups={groups} />;
};

export default TaskDetailsPage;
