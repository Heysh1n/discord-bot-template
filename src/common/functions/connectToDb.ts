import mongoose from "mongoose";

export async function connectToDb() {
  await mongoose.connect(
    process.env.MIGRATE_MONGO_URI || "mongodb://127.0.0.1:27017/",
    {
      autoCreate: false, 
      bufferCommands: true
    }
  );
}