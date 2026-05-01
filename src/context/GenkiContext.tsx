"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

type GenkiState = "idle" | "thinking" | "success" | "missing_goals" | "analyzing_nutrition" | "analyzing_kinetics";

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: string[];
}

export interface MacroData {
  protein: number;
  carbs: number;
  fats: number;
}

export interface MuscleRecovery {
  name: string;
  recovery: number;
}

interface GenkiContextType {
  state: GenkiState;
  setState: (state: GenkiState) => void;
  roadmap: WorkoutDay[] | null;
  setRoadmap: (roadmap: WorkoutDay[] | null) => void;
  wealthyHealthScore: number;
  setWealthyHealthScore: (score: number | ((prev: number) => number)) => void;
  analysisMessage: string | null;
  setAnalysisMessage: (msg: string | null) => void;
  
  // Lifted Demographics
  weight: number; setWeight: (v: number) => void;
  height: number; setHeight: (v: number) => void;
  age: number; setAge: (v: number) => void;
  gender: string; setGender: (v: string) => void;
  
  // Manual System Readiness
  muscleReadiness: MuscleRecovery[];
  setMuscleReadiness: React.Dispatch<React.SetStateAction<MuscleRecovery[]>>;
  
  // Derived Metrics
  bmi: number;
  bmr: number;
  tdee: number;
  bioAge: number;

  askGenki: (goalOrFatigue: string) => Promise<void>;
  analyzeNutrition: (foodInput: string) => Promise<{ macros: MacroData, feedback: string } | null>;
  analyzeKinetics: () => Promise<void>;
}

const GenkiContext = createContext<GenkiContextType | undefined>(undefined);

export function GenkiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GenkiState>("idle");
  const [roadmap, setRoadmap] = useState<WorkoutDay[] | null>(null);
  const [wealthyHealthScore, setWealthyHealthScore] = useState<number>(85);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);

  // Demographics
  const [weight, setWeight] = useState(82);
  const [height, setHeight] = useState(180);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("Male");

  // Manual Muscle Readiness
  const [muscleReadiness, setMuscleReadiness] = useState<MuscleRecovery[]>([
    { name: 'Chest', recovery: 85 },
    { name: 'Back', recovery: 72 },
    { name: 'Legs', recovery: 85 },
    { name: 'Arms', recovery: 90 },
    { name: 'Core', recovery: 80 },
    { name: 'Shoulders', recovery: 80 }
  ]);

  // Derived Metabolic Metrics
  const bmi = useMemo(() => {
    const hMeters = height / 100;
    return parseFloat((weight / (hMeters * hMeters)).toFixed(1));
  }, [weight, height]);

  const bmr = useMemo(() => {
    // Mifflin-St Jeor Equation
    let base = (10 * weight) + (6.25 * height) - (5 * age);
    return Math.round(gender === "Male" ? base + 5 : base - 161);
  }, [weight, height, age, gender]);

  const tdee = useMemo(() => {
    // Assume moderate activity (1.55 multiplier)
    return Math.round(bmr * 1.55);
  }, [bmr]);

  const bioAge = useMemo(() => {
    const avgReadiness = muscleReadiness.reduce((acc, m) => acc + m.recovery, 0) / muscleReadiness.length;
    if (bmi >= 18.5 && bmi <= 24.9 && avgReadiness > 70) {
      return age - 2; // Optimizing
    } else if (bmi > 25 || avgReadiness < 60) {
      return age + 3; // Needs recovery/cutting
    }
    return age; // Baseline
  }, [age, bmi, muscleReadiness]);

  const askGenki = async (goalOrFatigue: string) => {
    setState("thinking");
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          input: goalOrFatigue,
          muscleReadiness,
          bmi,
          bmr
        }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch roadmap");
      
      const data = await response.json();
      setRoadmap(data.roadmap);
      setState("success");
      
      setTimeout(() => setState("idle"), 5000);
    } catch (error) {
      console.error(error);
      setState("missing_goals");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const analyzeNutrition = async (foodInput: string) => {
    setState("analyzing_nutrition");
    try {
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: foodInput, bmi, bmr }),
      });
      
      if (!response.ok) throw new Error("Failed to analyze nutrition");
      
      const data = await response.json();
      
      setWealthyHealthScore(prev => {
        const newScore = prev + data.wealthyHealthScoreChange;
        return Math.min(Math.max(newScore, 0), 100);
      });
      
      setState("success");
      setTimeout(() => setState("idle"), 4000);
      
      return { macros: data.macros, feedback: data.feedback };
    } catch (error) {
      console.error(error);
      setState("missing_goals");
      setTimeout(() => setState("idle"), 3000);
      return null;
    }
  };

  const analyzeKinetics = async () => {
    setState("analyzing_kinetics");
    setAnalysisMessage(null);
    try {
      const response = await fetch("/api/kinetics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight, height, age, gender, bmi, bmr, tdee, bioAge }),
      });
      
      if (!response.ok) throw new Error("Failed to analyze kinetics");
      
      const data = await response.json();
      setAnalysisMessage(data.analysis);
      setState("success");
      setTimeout(() => setState("idle"), 6000);
    } catch (error) {
      console.error(error);
      setState("missing_goals");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <GenkiContext.Provider
      value={{
        state, setState,
        roadmap, setRoadmap,
        wealthyHealthScore, setWealthyHealthScore,
        analysisMessage, setAnalysisMessage,
        weight, setWeight,
        height, setHeight,
        age, setAge,
        gender, setGender,
        muscleReadiness, setMuscleReadiness,
        bmi, bmr, tdee, bioAge,
        askGenki, analyzeNutrition, analyzeKinetics,
      }}
    >
      {children}
    </GenkiContext.Provider>
  );
}

export function useGenki() {
  const context = useContext(GenkiContext);
  if (context === undefined) {
    throw new Error("useGenki must be used within a GenkiProvider");
  }
  return context;
}
