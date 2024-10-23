import dbConnect from "../../../utils/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
