import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are Genki, a high-energy, firm, motivating, and elite data-driven anime-style personal coach. 
You act as a premium digital concierge for a high-end luxury fitness app called 'Gym Buddy'.
Your personality: You don't take excuses. You are encouraging but strict. You rely on data. You use phrases like "Let's crush this!", "Biological assets optimized", "Executing recovery protocol", "No excuses, just execution."

You will receive the user's Muscle Readiness as a percentage for each of these groups: Chest, Back, Legs, Arms, Core, Shoulders.

STEP 1 - BUILD A STRUCTURED 7-DAY SPLIT: 
Create a professional, varied, and cohesive 7-day training schedule using classic training splits. Use a variety of these splits across the week:
- Chest & Triceps Day
- Back & Biceps Day  
- Leg Day (Quads, Hamstrings, Glutes, Calves)
- Shoulders & Arms Day
- Upper Body Day
- Full Body Power Day
- Core & Abs Day
- Push Day (Chest, Shoulders, Triceps)
- Pull Day (Back, Biceps)
- Active Recovery / Rest

STEP 2 - ADAPT EXERCISES TO READINESS PERCENTAGE:
For each day's focus muscle group(s), check the readiness percentage and apply EXACTLY these rules per muscle:
- 80% to 100%: Schedule 4-5 HEAVY compound movements (e.g., "4x5 Heavy Barbell Squats", "5x5 Deadlifts", "Heavy Bench Press 5x5").
- 60% to 79%: Schedule 3-4 MODERATE hypertrophy exercises (e.g., "3x12 Dumbbell Press", "4x10 Cable Rows", "3x15 Leg Press").
- Below 60%: You MUST REDUCE volume for that muscle to 1-2 light exercises ONLY (e.g., "2x15 Light Leg Extensions (Legs low)", "1x20 Light Band Pull-Aparts"). Do NOT schedule a dedicated heavy day (e.g., 'Leg Day') if the Legs muscle is below 60%. Swap the day's focus to a higher-readiness muscle group instead.

STEP 3 - DAY 3 RULE:
- If ALL muscle groups have readiness ABOVE 60%, Day 3 MUST be "Rest" (not Active Recovery).
- If any muscle group is BELOW 60%, Day 3 should be "Active Recovery".

Each day must have 3-5 exercises with specific sets and reps included in the exercise name strings (e.g., "4x8 Barbell Bench Press").

You must return your response ONLY as a JSON object matching this exact schema:
{
  "roadmap": [
    { "day": "Day 1", "focus": "String (e.g. Chest & Triceps Day)", "exercises": ["String with sets/reps", "String"] },
    ... exactly 7 days
  ]
}
Do not include markdown blocks like \`\`\`json. Just return the raw JSON object.
`;

interface MuscleData {
  name: string;
  recovery: number;
}

function buildFallbackRoadmap(muscleReadiness: MuscleData[]) {
  const getMusclePct = (name: string) => {
    const m = muscleReadiness.find(m => m.name === name);
    return m ? m.recovery : 75;
  };

  const chest = getMusclePct('Chest');
  const back = getMusclePct('Back');
  const legs = getMusclePct('Legs');
  const arms = getMusclePct('Arms');
  const core = getMusclePct('Core');
  const shoulders = getMusclePct('Shoulders');

  const isAllAbove60 = muscleReadiness.length > 0 && muscleReadiness.every(m => m.recovery > 60);

  // Helper: select exercises based on readiness
  const getChestExercises = () => {
    if (chest >= 80) return ["5x5 Barbell Bench Press", "4x8 Incline Dumbbell Press", "4x10 Cable Flyes", "3x12 Dips"];
    if (chest >= 60) return ["3x12 Dumbbell Bench Press", "3x15 Cable Flyes", "3x12 Push-Ups"];
    return ["2x15 Light Band Push-Ups (Chest low)", "1x20 Light Cable Crossover"];
  };
  const getBackExercises = () => {
    if (back >= 80) return ["5x5 Deadlifts", "4x8 Barbell Rows", "4x10 Pull-Ups", "3x12 Cable Rows"];
    if (back >= 60) return ["3x12 Dumbbell Rows", "3x15 Lat Pulldowns", "3x12 Face Pulls"];
    return ["2x15 Light Band Rows (Back low)", "1x20 Light Lat Pulldowns"];
  };
  const getLegExercises = () => {
    if (legs >= 80) return ["5x5 Barbell Back Squats", "4x8 Romanian Deadlifts", "4x12 Leg Press", "3x15 Walking Lunges"];
    if (legs >= 60) return ["3x12 Goblet Squats", "3x15 Leg Extensions", "3x15 Lying Leg Curls"];
    return ["2x20 Light Leg Extensions (Legs low)", "2x15 Bodyweight Glute Bridges"];
  };
  const getArmExercises = () => {
    if (arms >= 80) return ["4x10 Barbell Curls", "4x10 Skull Crushers", "3x12 Hammer Curls", "3x12 Tricep Pushdowns"];
    if (arms >= 60) return ["3x15 Dumbbell Curls", "3x15 Tricep Dips", "3x15 Rope Pulldowns"];
    return ["2x20 Light Band Curls (Arms low)", "2x20 Light Rope Pushdowns"];
  };
  const getShoulderExercises = () => {
    if (shoulders >= 80) return ["4x8 Heavy Overhead Press", "4x12 Lateral Raises", "3x12 Front Raises", "3x15 Rear Delt Flyes"];
    if (shoulders >= 60) return ["3x12 Dumbbell Shoulder Press", "3x15 Cable Lateral Raises", "3x15 Face Pulls"];
    return ["2x15 Light Lateral Raises (Shoulders low)", "2x20 Band Pull-Aparts"];
  };
  const getCoreExercises = () => {
    if (core >= 80) return ["4x45s Plank", "3x20 Hanging Leg Raises", "3x15 Cable Crunches", "3x20 Russian Twists"];
    if (core >= 60) return ["3x30s Plank", "3x15 Crunches", "3x15 Bicycle Crunches"];
    return ["2x20s Plank (Core low)", "2x15 Light Ab Crunches"];
  };

  return [
    { day: "Day 1", focus: chest < 60 ? "Back & Biceps Day" : "Chest & Triceps Day", exercises: chest < 60 ? [...getBackExercises(), ...getArmExercises().slice(0, 2)] : getChestExercises() },
    { day: "Day 2", focus: legs < 60 ? "Upper Body Hypertrophy" : "Leg Day", exercises: legs < 60 ? [...getBackExercises().slice(0, 2), ...getShoulderExercises().slice(0, 2)] : getLegExercises() },
    { day: "Day 3", focus: isAllAbove60 ? "Rest" : "Active Recovery", exercises: isAllAbove60 ? ["Full Rest & Hydration", "Light Walk 20 min", "Foam Rolling"] : ["20 min Light Cardio", "Full Body Stretching", "Yoga Flow"] },
    { day: "Day 4", focus: "Push Day (Chest, Shoulders & Triceps)", exercises: [...getChestExercises().slice(0, 2), ...getShoulderExercises().slice(0, 2)] },
    { day: "Day 5", focus: "Pull Day (Back & Biceps)", exercises: [...getBackExercises().slice(0, 2), ...getArmExercises().slice(0, 2)] },
    { day: "Day 6", focus: "Full Body Power & Core", exercises: [getLegExercises()[0], getBackExercises()[0], getChestExercises()[0], ...getCoreExercises().slice(0, 2)] },
    { day: "Day 7", focus: "Rest & Recovery", exercises: ["Full Rest", "Hydrate & Meal Prep", "Light Mobility Work"] }
  ];
}

export async function POST(req: Request) {
  let muscleReadiness: MuscleData[] = [];
  
  try {
    const body = await req.json();
    const { input, bmi, bmr } = body;
    muscleReadiness = body.muscleReadiness || [];

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
        temperature: 0.8,
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
      roadmap: buildFallbackRoadmap(muscleReadiness)
    });
  }
}
