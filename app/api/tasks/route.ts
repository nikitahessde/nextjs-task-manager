import dbConnect from "../../../utils/mongodb";
import Task from "../../../models/Task";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Group from "@/models/Group";
import { isAdmin, isDeveloper } from "@/utils/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ message: "Permission denied" }, { status: 403 });
  }
  await dbConnect();
  const body = await req.json();
  const task = new Task(body);
  try {
    const savedTask = await task.save();
    return NextResponse.json(savedTask);
  } catch (error) {
    console.error("Error saving task:", error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  await dbConnect();
  try {
    const userGroups = await Group.find({ users: session?.user.email }).select("uuid");
    const userGroupIds = userGroups.map((group) => group.uuid);
    const developerTasks = await Task.find({ assignedGroup: { $in: userGroupIds } }).select(
      "uuid name description status assignedTo assignedGroup -_id",
    );
    const allTasks = await Task.find().select(
      "uuid name description status assignedTo assignedGroup -_id",
    );
    const tasks = isDeveloper(session) ? developerTasks : allTasks;
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
