import dbConnect from "../../../../utils/mongodb";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import Task from "../../../../models/Task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user.role[0] === "admin" || session.user.role[0] === "manager")) {
    return NextResponse.json({ message: "Permission denied" }, { status: 403 });
  }
  await dbConnect();
  const body = await req.json();
  try {
    const updatedTask = await Task.findOneAndUpdate({ uuid: params.id }, body, { new: true });
    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user.role[0] === "admin")) {
    return NextResponse.json({ message: "Permission denied" }, { status: 403 });
  }
  await dbConnect();
  try {
    await Task.findOneAndDelete({ uuid: params.id });
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
