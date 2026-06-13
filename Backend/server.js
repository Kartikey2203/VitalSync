import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

connectDB();
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("VitalSync Backend Running");
});

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
  console.log(process.env.MONGO_URI);
});