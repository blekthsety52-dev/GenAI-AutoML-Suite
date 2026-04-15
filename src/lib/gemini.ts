import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiModel = "gemini-3-flash-preview";

export async function generatePrediction(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are a helpful AI assistant.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function analyzeDataset(csvData: string) {
  const prompt = `Analyze the following dataset (CSV format) and provide a summary of its schema, row count, and potential use cases for AI training. Return the result in JSON format with keys: schema (array of strings), rowCount (number), summary (string).
  
  Dataset:
  ${csvData.slice(0, 5000)} // Analyze first 5k chars`;

  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Dataset Analysis Error:", error);
    throw error;
  }
}
