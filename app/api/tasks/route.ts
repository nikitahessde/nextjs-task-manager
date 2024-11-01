import dbConnect from "../../../utils/mongodb";
import Task from "../../../models/Task";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/models/User";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes(UserRole.Admin)) {
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
  await dbConnect();
  try {
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
