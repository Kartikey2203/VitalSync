import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const extractMedicalData = async (buffer, mimeType) => {
  const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-2.0-flash"];

  const prompt = `You are a medical report analysis assistant for VitalSync, an Indian health dashboard app.

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
  "patientInfo": { "name": "", "age": "", "gender": "" },
  "healthScore": 0,
  "deficiencies": {
    "Hemoglobin": {
      "value": "", "unit": "", "min": "", "max": "",
      "status": "Normal|Low|High|Borderline",
      "severity": "None|Low|Moderate|High"
    }
  },
  "nutrients": { "nutrientName": 0 },
  "recommendations": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
  "insights": {
    "summary": "2-3 sentence plain English summary",
    "healthRisks": ["Risk 1", "Risk 2", "Risk 3"],
    "lifestyleAdvice": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
  },
  "reportSummary": { "totalTests": 0, "normal": 0, "low": 0, "high": 0, "borderline": 0 },
  "mealPlan": {
    "day1": { "breakfast": "", "lunch": "", "dinner": "" },
    "day2": { "breakfast": "", "lunch": "", "dinner": "" },
    "day3": { "breakfast": "", "lunch": "", "dinner": "" },
    "day4": { "breakfast": "", "lunch": "", "dinner": "" },
    "day5": { "breakfast": "", "lunch": "", "dinner": "" },
    "day6": { "breakfast": "", "lunch": "", "dinner": "" },
    "day7": { "breakfast": "", "lunch": "", "dinner": "" }
  }
}`;

  let lastError;
  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`[Gemini] extractMedicalData trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: [
          { inlineData: { data: buffer.toString("base64"), mimeType } },
          { text: prompt }
        ],
      });

      const cleaned = response.text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const result = JSON.parse(cleaned);
      console.log(`[Gemini] extractMedicalData success with model: ${model}`);
      return result;
    } catch (error) {
      const status = error?.status ?? error?.response?.status;
      console.warn(`[Gemini] extractMedicalData model ${model} failed (status ${status}):`, error?.message ?? error);
      lastError = error;
      if (status !== 429 && status !== 503) throw error;
    }
  }

  console.error("[Gemini] extractMedicalData all models exhausted");
  throw lastError;
};

export const chatWithGemini = async (message, history = []) => {
  const MODELS_TO_TRY = ["gemini-2.0-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

  const systemPrompt = `You are VitalSync's AI Health Assistant, a professional and helpful medical chatbot.
Your main role is to answer health, medical, wellness, fitness, diet, and nutrition questions.

CRITICAL RULES:
1. ONLY answer questions related to health, fitness, diet, nutrition, wellness, medicine, symptoms, diseases, or medical tests.
2. If the user asks about ANY other topic (for example: coding, math, general trivia, history, movies, writing code, or general chatting not related to wellness), you must politely but firmly decline to answer.
   - Example refusal response: "I'm sorry, but as the VitalSync Health Assistant, I can only help you with health, fitness, medical, and wellness related questions."
3. Keep your advice informative, friendly, and structured. Always advise the user to consult a human medical doctor or healthcare provider for professional medical diagnosis.`;

  const formattedContents = [];

  // Format history for Gemini
  history.forEach(item => {
    formattedContents.push({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.text }]
    });
  });

  // Add the new user message
  formattedContents.push({
    role: "user",
    parts: [{ text: message }]
  });

  let lastError;
  for (const model of MODELS_TO_TRY) {
    try {
      console.log(`[Gemini] Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction: systemPrompt
        }
      });
      console.log(`[Gemini] Success with model: ${model}`);
      return response.text;
    } catch (error) {
      const status = error?.status ?? error?.response?.status;
      console.warn(`[Gemini] Model ${model} failed (status ${status}):`, error?.message ?? error);
      lastError = error;
      // Only fall through to next model on quota/rate-limit errors
      if (status !== 429 && status !== 503) throw error;
    }
  }

  console.error("[Gemini] All models exhausted:", lastError);
  throw lastError;
};