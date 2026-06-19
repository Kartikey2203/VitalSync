import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const extractMedicalData = async (buffer, mimeType) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType,
          },
        },
        {

  text: `You are a medical report analysis assistant for VitalSync, an Indian health dashboard app.

Analyze the uploaded lab report image carefully and extract all test values.

CRITICAL RULES:
- Return ONLY a valid JSON object. No markdown, no backticks, no explanation text.
- nutrients values must be 0-100 (percentage of normal range, NOT raw lab values).
  Example: if Vitamin D is 14 ng/mL and normal is 30-100, that is roughly 22% → vitaminD: 22
- recommendations must be in simple everyday language a non-medical person can understand.
- mealPlan must use realistic Indian meals (dal, roti, sabzi, idli, poha, etc.).
- insights.summary must be written like a friendly doctor explaining to a patient — no jargon.
- deficiencies object must have exactly 6 keys (the 6 most important from the report).
- If a value is not found in the report, use sensible defaults (e.g. status: "Not Tested", value: "N/A").
- healthScore: calculate as integer 0-100 based on how many tests are normal vs abnormal.

Return this exact JSON structure:

{
  "patientInfo": {
    "name": "",
    "age": "",
    "gender": ""
  },
  "healthScore": 0,
{
  "deficiencies": {
    "Hemoglobin": {
      "value": "",
      "unit": "",
      "min": "",
      "max": "",
      "status": "Normal|Low|High|Borderline",
      "severity": "None|Low|Moderate|High"
    }
  }
}
  "nutrients": {
    "": ,
    "": ,
    "": ,
    "": ,
    "": ,
    "": 
  },
  "recommendations": [
    "Simple tip 1 based on actual deficiencies found",
    "Simple tip 2",
    "Simple tip 3",
    "Simple tip 4"
  ],
  "insights": {
    "summary": "2-3 sentence plain English summary of the report for a non-medical person",
    "healthRisks": [
      "Risk 1 explained simply",
      "Risk 2 explained simply",
      "Risk 3 explained simply"
    ],
    "lifestyleAdvice": [
      "Daily habit tip 1",
      "Daily habit tip 2",
      "Daily habit tip 3",
      "Daily habit tip 4"
    ]
  },
  "reportSummary": {
    "totalTests": 0,
    "normal": 0,
    "low": 0,
    "high": 0,
    "borderline": 0
  },
  "mealPlan": {
    "day1": { "breakfast": "", "lunch": "", "dinner": "" },
    "day2": { "breakfast": "", "lunch": "", "dinner": "" },
    "day3": { "breakfast": "", "lunch": "", "dinner": "" },
    "day4": { "breakfast": "", "lunch": "", "dinner": "" },
    "day5": { "breakfast": "", "lunch": "", "dinner": "" },
    "day6": { "breakfast": "", "lunch": "", "dinner": "" },
    "day7": { "breakfast": "", "lunch": "", "dinner": "" }
  }
}`
        }
     ],
    });

  const cleaned = response.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};