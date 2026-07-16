import s3 from "../services/s3Services.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { extractMedicalData, chatWithGemini } from "../services/geminiService.js";
import Report from "../models/Report.js";

export const uploadReport = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileKey = `reports/${Date.now()}-${file.originalname}`;

await s3.send(
  new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  })
);
const aiResult = await extractMedicalData(
  file.buffer,
  file.mimetype 
);

const report = await Report.create({
  userId: req.user?._id,
  originalFileName: file.originalname,
  fileType: file.mimetype,
  s3Url:fileKey,
  aiSummary: aiResult?.insights?.summary || "",
  aiResult,
});




return res.status(200).json({
  success: true,
  message: "File uploaded and analyzed",
  report,
});
}
catch (error) {
  console.error(error);
  
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

// Analyze report using Gemini
// export const analyzeReport = async (req, res) => {
//   try {
//     const { fileKey } = req.body;
    
//     if (!fileKey) {
//       return res.status(400).json({
//         success: false,
//         message: "fileKey is required",
//       });
//     }
    

    
//     const aiResult = await extractMedicalData(
//       file.buffer,
//       file.mimetype
//     );
//     const report = await Report.create({
//       userId: req.user?._id,
//       originalFileName: file.originalname,
//       fileType: file.mimetype,
//       s3Url: fileKey,
//   aiSummary: aiResult?.insights?.summary || "",
//   aiResult,
// });
    
//     res.status(200).json({
//       success: true,
//       report,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }}
export const getLatestReport = async (req, res) => {
  try {
    const report = await Report.findOne({ userId: req.user?._id })
      .sort({ createdAt: -1 });

  return  res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// One-time migration: assign all orphaned reports (userId: null) to the current user
export const claimOrphanedReports = async (req, res) => {
  try {
    const userId = req.user?._id;
    const result = await Report.updateMany(
      { $or: [{ userId: null }, { userId: { $exists: false } }] },
      { $set: { userId } }
    );
    return res.status(200).json({
      success: true,
      message: `Claimed ${result.modifiedCount} orphaned report(s) for your account.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("[getAllReports] Querying for userId:", userId);

    const reports = await Report.find({ userId }).sort({ createdAt: -1 });

    // Debug: also count total reports regardless of user
    const totalInDb = await Report.countDocuments();
    console.log(`[getAllReports] Found ${reports.length} reports for this user. Total in DB: ${totalInDb}`);

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findOneAndDelete({ _id: id, userId: req.user?._id });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found or not authorized to delete",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


