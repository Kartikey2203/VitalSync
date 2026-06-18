import express from "express";
import {
  uploadReport,
  getLatestReport
} from "../controller/reportController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload report to S3
router.post(
  "/upload",
  upload.single("report"),
  uploadReport
);

router.get("/latest", getLatestReport);

export default router;