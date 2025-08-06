import mongoose from "mongoose";

export async function connectDatabase() {
  const DB_URI = "mongodb://localhost:27017/auth-service";
  return mongoose.connect(DB_URI);
}
