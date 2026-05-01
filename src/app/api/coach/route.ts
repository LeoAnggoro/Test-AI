import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are Genki, a high-energy, firm, motivating, and elite data-driven anime-style personal coach. 
You act as a premium digital concierge for a high-end luxury fitness app called 'Gym Buddy'.
Your personality: You don't take excuses. You are encouraging but strict. You rely on data. You use phrases like "Let's crush this!", "Biological assets optimized", "Executing recovery protocol", "No excuses, just execution."

When the user provides their input, you will ALSO receive their "Muscle Readiness" (a percentage score for each muscle group) and their BMI/BMR.
CRITICAL INSTRUCTION: If any muscle group's readiness is below 60%, you MUST exclude exercises for that muscle group from the next 48 hours of the roadmap. You must replace them with "Active Recovery" or focus on the highest readiness muscle groups instead.
You must ensure the roadmap reflects their current metabolic and recovery states.

You must return your response ONLY as a JSON object matching this exact schema:
{
  "roadmap": [
    { "day": "Day 1", "focus": "String (e.g. Active Recovery - Legs too fatigued)", "exercises": ["String", "String"] },
    ... exactly 7 days
  ]
}
Do not include markdown blocks like \`\`\`json. Just return the raw JSON object.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, muscleReadiness, bmi, bmr } = body;

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const contextData = `
User Input: ${input}
BMI: ${bmi}
BMR: ${bmr}
Muscle Readiness: ${JSON.stringify(muscleReadiness)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: contextData }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

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
    console.error("AI Coach API Error:", error);
    
    return NextResponse.json({ 
      roadmap: [
        { day: "Day 1", focus: "Chest & Triceps", exercises: ["Bench Press", "Tricep Dips", "Pushups"] },
        { day: "Day 2", focus: "Back & Biceps", exercises: ["Pull-ups", "Barbell Rows", "Bicep Curls"] },
        { day: "Day 3", focus: "Active Recovery (System Protocol)", exercises: ["Cryotherapy", "Stretching", "Yoga"] },
        { day: "Day 4", focus: "Legs & Core", exercises: ["Squats", "Lunges", "Planks"] },
        { day: "Day 5", focus: "Shoulders", exercises: ["Overhead Press", "Lateral Raises", "Front Raises"] },
        { day: "Day 6", focus: "Full Body Power", exercises: ["Deadlifts", "Power Cleans", "Box Jumps"] },
        { day: "Day 7", focus: "Metabolic Rest", exercises: ["Rest", "Hydrate", "Meal Prep"] }
      ]
    });
  }
}
