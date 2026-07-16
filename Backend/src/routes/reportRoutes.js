import express from "express";
import {
  uploadReport,
  getLatestReport,
  getAllReports,
  deleteReport,
  claimOrphanedReports
} from "../controller/reportController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Upload report to S3
router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadReport
);

router.get("/latest", protect, getLatestReport);
router.get("/all", protect, getAllReports);
router.delete("/:id", protect, deleteReport);
router.post("/claim-orphaned", protect, claimOrphanedReports);

export default router;