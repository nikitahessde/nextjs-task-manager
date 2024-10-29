"use server";

import dbConnect from "@/utils/mongodb";
import User from "@/models/User";
import { UserRole } from "@/models/User";

export const register = async (values: {
  email: string;
  password: string;
  name: string;
  role: UserRole[];
}) => {
  const { email, password, name, role } = values;
  try {
    await dbConnect();
    const userFound = await User.findOne({ email });
    if (userFound) {
      return {
        error: "Email already exists!",
      };
    }
    const user = new User({
      name,
      email,
      password,
      role: [role],
    });
    await user.save();
  } catch (e) {
    console.log(e);
  }
};
