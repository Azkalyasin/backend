import mongoose from "mongoose";

const connectionString = process.env.NEXT_MONGODB_URI;

if (!connectionString) {
  throw new Error("❌ MONGODB_URI not defined in environment variables");
}

let isConnected = false; // cache connection status

const connectionDb = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(connectionString, {
      dbName: "test", // optional, but recommended
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ Database connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Database connection error:", error.message);
    } else {
      console.error("❌ Unknown database connection error");
    }
    throw error; // Penting: bubble up error agar ditangani catch di route
  }
};

export default connectionDb;
