import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google-generativeai";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "30mb" }));

if (!process.env.GEMINI_API_KEY) {
  console.warn("Warning: GEMINI_API_KEY is not set. Add it to .env before calling the API.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/analyze", async (req, res) => {
  try {
    const { symptoms, imageBase64 } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts = [{ text: `Based on the following symptoms, classify the disease. Symptoms: ${symptoms || 'None'}` }];

    if (imageBase64) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: imageBase64 }
      });
    }

    const payload = {
      contents: [{ role: "user", parts }],
      systemInstruction: { parts: [{ text: "You are a multimodal disease classification model. Return a single JSON object with 'disease_name' and 'confidence_score' (0.0-1.0)." }] },
      generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { disease_name: { type: "STRING" }, confidence_score: { type: "NUMBER" } } } }
    };

    const result = await model.generateContent(payload);

    // Try to extract model returned JSON text
    const candidateText = result?.candidates?.[0]?.content?.parts?.[0]?.text || result?.candidates?.[0]?.content?.[0]?.text || null;
    if (!candidateText) {
      return res.status(500).json({ error: "Unexpected model response structure." });
    }
    return res.json({ result: candidateText });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
