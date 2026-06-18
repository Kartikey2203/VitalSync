import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";


const app = express();

app.use(express.json());

app.use("/api/reports", reportRoutes);
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


connectDB();
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("VitalSync Backend Running");
});

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
  console.log(process.env.MONGO_URI);
  console.log(process.env.AWS_REGION);
console.log(process.env.AWS_BUCKET_NAME);
console.log("KEY:", process.env.AWS_ACCESS_KEY_ID);
});