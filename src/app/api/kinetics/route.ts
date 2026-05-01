import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are Genki, a high-energy, elite, data-driven anime-style personal coach for a high-end fitness app.
The user is providing their demographic and physical data (Kinetic data) and you must provide a brief "Neural Sync" analysis.
You are evaluating their "Biological Assets".

You will receive: Weight, Height, Age, Gender, BMI, BMR, TDEE, and Bio-Age.

You must provide a brief, conversational analysis covering:
1. Their BMI classification and metabolic efficiency based on their BMR/TDEE.
2. How their physical data directly dictates their nutritional targets (e.g., Bulking vs Cutting, protein prioritization).
3. A personalized system recovery tip based on their Bio-Age or demographic.

Keep the tone firm, elite, and data-obsessed. Use anime-coach terminology like "Analyzing biological assets", "Metabolic Efficiency", and "System Recovery". Keep it to 3-4 sentences max. No excuses!

Return ONLY a JSON object matching this schema:
{
  "analysis": "String containing your Genki response."
}
Do not include markdown blocks like \`\`\`json. Just return the raw JSON object.
`;

export async function POST(req: Request) {
  let bodyData = { weight: 0, height: 0, age: 0, gender: "unknown", bmi: 0, bmr: 0, tdee: 0, bioAge: 0 };

  try {
    const body = await req.json();
    bodyData = body;
    const { weight, height, age, gender, bmi, bmr, tdee, bioAge } = body;

    if (!weight || !height || !age || !gender) {
      return NextResponse.json({ error: "Missing demographic data" }, { status: 400 });
    }

    const inputData = `Weight: ${weight}kg, Height: ${height}cm, Age: ${age}, Gender: ${gender}, BMI: ${bmi}, BMR: ${bmr}, TDEE: ${tdee}, Bio-Age: ${bioAge}`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nUser Biological Assets: " + inputData }] }
      ]
    });

    const response = await result.response;
    const jsonText = response.text().trim();
    
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      const cleaned = jsonText.replace(/^```json/g, "").replace(/```$/g, "").trim();
      data = JSON.parse(cleaned);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Kinetics API Error:", error);
    
    return NextResponse.json({
      analysis: `GENKI MODE: Analyzing biological assets... Your Bio-Age is ${bodyData.bioAge} and BMI is ${bodyData.bmi}. To support a TDEE of ${bodyData.tdee} kcal, optimize your metabolic efficiency immediately. No excuses, execute the system recovery protocol!`
    });
  }
}