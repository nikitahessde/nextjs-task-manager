import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: "todo" },
    createdAt: { type: Date, default: Date.now },
    assignedTo: { type: String, required: false },
  },
  { collection: "task" },
);

const Task = mongoose.models.task || mongoose.model("task", taskSchema);

export default Task;
