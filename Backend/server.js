import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("VitalSync Backend Running");
});

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
  console.log(process.env.MONGO_URI);
});