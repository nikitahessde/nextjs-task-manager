import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

const dbConnect = async () => {
  if (process.env.NODE_ENV === 'test') {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    }
    return;
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.DATABASE_URL);
};

export default dbConnect;
