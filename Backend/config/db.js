 import mongoose from "mongoose";
import dns from "dns";

// Set DNS servers to public DNS to prevent ECONNREFUSED errors during MongoDB SRV lookup in Node.js
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log(process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
  }
};

export default connectDB;