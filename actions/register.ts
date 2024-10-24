"use server";

import dbConnect from "@/utils/mongodb";
import User from "@/models/User";

export const register = async (values: { email: string; password: string; name: string }) => {
  const { email, password, name } = values;
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
    });
    await user.save();
  } catch (e) {
    console.log(e);
  }
};
