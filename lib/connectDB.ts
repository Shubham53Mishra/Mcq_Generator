import mongoose from 'mongoose';

export async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("⚠️ MONGO_URI is not defined in environment variables.");
    }

    if (mongoose.connection.readyState === 1) return;

    console.log("🔍 Connecting to:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000, // Optional: wait up to 10s
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
  }
}
