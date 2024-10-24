import dbConnect from "../../../../utils/mongodb";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "../../../../models/User";

export async function PATCH(req: NextRequest, { params }: { params: { email: string } }) {
  await dbConnect();
  const body = await req.json();
  try {
    const updatedUser = await User.findOneAndUpdate({ email: params.email }, body, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
