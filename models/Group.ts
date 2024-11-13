import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true },
    name: { type: String, required: true },
    users: { type: [String], default: [] },
  },
  { collection: "group" },
);

const Group = mongoose.models.group || mongoose.model("group", groupSchema);

export default Group;
