import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalFileName: String,
    fileType: String,
    s3Url: String,
    extractedText: String,
    aiSummary: String,
    aiResult: Object,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportSchema);