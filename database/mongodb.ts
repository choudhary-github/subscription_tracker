import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env";
import "dotenv/config";

if (!DB_URI) {
  throw new Error("DB_URI is not defined");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI as string);
    console.log(`Connected to MongoDB in ${NODE_ENV} mode ✅`);
  } catch (error) {
    console.log("Error connecting to MongoDB ❌", error);
    process.exit(1);
  }
};
