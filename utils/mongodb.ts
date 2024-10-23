import mongoose from "mongoose";

const dbConnect = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.DATABASE_URL);
};

export default dbConnect;
