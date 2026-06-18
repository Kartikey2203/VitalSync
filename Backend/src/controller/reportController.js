import s3 from "../services/s3Services.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { extractMedicalData } from "../services/geminiService.js";
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
    const report = await Report.findOne()
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

