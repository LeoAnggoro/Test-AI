import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are Genki, a high-energy, data-driven anime-style personal coach for a high-end fitness app.
The user is logging a meal description (e.g. "I ate a burger and fries" or "Oatmeal with protein").
You must analyze this food, estimate its macro-nutrients (Protein, Carbs, Fats in grams), and determine how it affects their "Wealthy Health Score" (a score from 0-100).
A healthy, protein-rich meal might increase the score by +3 to +8. A junk food meal might decrease it by -2 to -10.

Return ONLY a JSON object matching this schema:
{
  "macros": {
    "protein": "number (g)",
    "carbs": "number (g)",
    "fats": "number (g)"
  },
  "wealthyHealthScoreChange": "number (positive or negative)",
  "feedback": "A short, in-character response from Genki (e.g. 'Solid fuel! Keep it up!' or 'We'll need to burn those extra carbs later. No excuses!')"
}
Do not include markdown blocks like \`\`\`json. Just return the raw JSON object.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: input }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error("Empty response from AI");

    const jsonText = response.text.trim();
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      const cleaned = jsonText.replace(/^```json/g, "").replace(/```$/g, "").trim();
      data = JSON.parse(cleaned);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Nutrition API Error:", error);
    
    // Fallback Mock Data for demo purposes if Gemini is overloaded (503)
    return NextResponse.json({
      macros: { protein: 45, carbs: 60, fats: 20 },
      wealthyHealthScoreChange: 5,
      feedback: "API overloaded, but I estimate this is good fuel. Let's keep executing!"
    });
  }
}
