import AddNewTask from "@/components/create-task";
import Group from "@/models/Group";
import User from "@/models/User";
import dbConnect from "@/utils/mongodb";

const AddNewTaskPage = async () => {
  await dbConnect();
  const groups = await Group.find().select("uuid name users createdAt");
  return <AddNewTask initialGroups={groups}/>;
};

export default AddNewTaskPage;
