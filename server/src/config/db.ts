import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// const DB_NAME = "han_noy";


export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.DB_NAME as string,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    throw new Error("Could not connect to MongoDB");
  }
}
