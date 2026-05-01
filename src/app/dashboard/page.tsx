"use client";

import React, { useEffect, useState } from "react";
import { BentoCard } from "@/components/BentoCard";
import { useGenki } from "@/context/GenkiContext";
import { Flame, Activity, TrendingUp, CalendarDays, BrainCircuit, Camera, Utensils, RefreshCw, ScanLine, Info, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { 
    roadmap, wealthyHealthScore, analyzeNutrition, askGenki, state, analyzeKinetics,
    weight, setWeight, height, setHeight, age, setAge, gender, setGender,
    muscleReadiness, setMuscleReadiness, bmi, bmr, tdee, bioAge
  } = useGenki();
  
  const [mounted, setMounted] = useState(false);
  const [foodInput, setFoodInput] = useState("");
  const [nutritionFeedback, setNutritionFeedback] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastReadinessStr, setLastReadinessStr] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-trigger roadmap adjustment when sliders are moved (debounced to prevent API spam)
  useEffect(() => {
    if (!mounted) return;
    const currentStr = JSON.stringify(muscleReadiness);
    // Cek agar tidak memicu ulang jika data tidak berubah
    if (currentStr === lastReadinessStr || lastReadinessStr === "") {
      if (lastReadinessStr === "") setLastReadinessStr(currentStr);
      return; 
    }
    
    const timer = setTimeout(() => {
      setLastReadinessStr(currentStr);
      askGenki(`My muscle readiness has been manually updated. Please generate a new roadmap focusing on my highest readiness muscles and avoiding anything below 60%.`);
    }, 1500);

    return () => clearTimeout(timer);
  }, [muscleReadiness, mounted, askGenki]);

  const handleNutritionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodInput.trim()) return;
    
    setNutritionFeedback(null);
    const result = await analyzeNutrition(foodInput);
    if (result) {
      setNutritionFeedback(result.feedback);
    }
    setFoodInput("");
  };

  const handleStatUpdate = () => {
    setIsScanning(true);
    analyzeKinetics().finally(() => {
      setIsScanning(false);
      // Auto trigger roadmap generation after scanning demographics
      askGenki(`Generate updated roadmap based on physical scan and manual muscle readiness levels.`);
    });
  };

  const updateMuscleReadiness = (index: number, newRecovery: number) => {
    setMuscleReadiness(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], recovery: newRecovery };
      return updated;
    });
  };

  if (!mounted) return null;

  // Macro Target Logic
  let macroProfile = "Balanced Performance";
  let pTarget = 150; let cTarget = 200; let fTarget = 65;
  if (bmi < 18.5) {
    macroProfile = "Bulking Protocol (Surplus)";
    pTarget = Math.round(weight * 2.2); // ~2.2g per kg
    cTarget = 300; fTarget = 80;
  } else if (bmi > 25) {
    macroProfile = "Cutting Protocol (Deficit)";
    pTarget = Math.round(weight * 2.5); // High protein to preserve muscle
    cTarget = 120; fTarget = 50;
  }

  // Recovery Concierge Logic
  const exhaustedMuscles = muscleReadiness.filter(m => m.recovery < 60);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-orbitron font-bold tracking-wide">Performance Overview</h1>
          <p className="text-white/60 mt-1 font-inter">Your biological assets are being analyzed.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bio-Age Badge */}
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-volt/30">
            <Activity className="w-4 h-4 text-volt" />
            <span className="text-sm font-semibold">Bio-Age:</span>
            <span className="text-volt font-orbitron font-bold">{bioAge}</span>
            <span className="text-xs text-white/50 ml-1">
              ({bioAge < age ? "Optimizing" : bioAge > age ? "Needs Recovery" : "Baseline"})
            </span>
          </div>

          <div className="glass px-6 py-3 rounded-full flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-volt" />
            <span className="font-semibold text-sm">Wealthy Health Score:</span>
            <motion.span 
              key={wealthyHealthScore}
              initial={{ scale: 1.5, color: "#fff" }}
              animate={{ scale: 1, color: "#00E5FF" }}
              className="font-orbitron font-bold text-xl text-glow"
            >
              {wealthyHealthScore}
            </motion.span>
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* AI Kinetic Vision Panel */}
        <BentoCard title="AI Kinetic Vision" icon={<ScanLine className="w-5 h-5" />} className="md:col-span-1">
          <div className="flex flex-col gap-3 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
                <span className="text-xs text-white/50 mb-1">Weight (kg)</span>
                <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="bg-transparent font-orbitron text-volt focus:outline-none" />
              </div>
              <div className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
                <span className="text-xs text-white/50 mb-1">Height (cm)</span>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="bg-transparent font-orbitron text-volt focus:outline-none" />
              </div>
              <div className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
                <span className="text-xs text-white/50 mb-1">Age</span>
                <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="bg-transparent font-orbitron text-volt focus:outline-none" />
              </div>
              <div className="flex flex-col bg-black/30 p-2 rounded-lg border border-white/5">
                <span className="text-xs text-white/50 mb-1">Gender</span>
                <select value={gender} onChange={e => setGender(e.target.value)} className="bg-transparent font-orbitron text-sunset focus:outline-none [&>option]:bg-charcoal">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleStatUpdate}
              disabled={isScanning || state === "thinking" || state === "analyzing_kinetics"}
              className="mt-2 w-full py-3 rounded-lg bg-volt/10 text-volt font-bold text-sm hover:bg-volt/20 transition flex justify-center items-center gap-2 border border-volt/20 disabled:opacity-50"
            >
              {(isScanning || state === "analyzing_kinetics") ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
              {(isScanning || state === "analyzing_kinetics") ? "Scanning Assets..." : "Sync & Analyze"}
            </button>
          </div>
        </BentoCard>

        {/* Nutritional Synthesis */}
        <BentoCard title="Nutritional Synthesis" icon={<Utensils className="w-5 h-5" />} className="md:col-span-2">
          <div className="flex flex-col h-full gap-4 pt-2">
            
            {/* Metabolic Dashboard */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="flex-1 bg-black/20 rounded-lg p-3 border border-white/5 flex justify-between items-center">
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">BMR (Baseline)</div>
                  <div className="text-lg font-orbitron font-semibold">{bmr} <span className="text-xs font-inter text-white/40">kcal</span></div>
                </div>
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">TDEE (Est.)</div>
                  <div className="text-lg font-orbitron font-semibold text-volt">{tdee} <span className="text-xs font-inter text-white/40">kcal</span></div>
                </div>
              </div>
              <div className="flex-1 bg-volt/5 border border-volt/20 rounded-lg p-3">
                <div className="text-xs text-volt uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Genki Insight
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Your baseline biological rent is {bmr} kcal. Ensure your intake supports this metabolic floor before increasing intensity. Target: <strong className="text-white">{macroProfile}</strong>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2 text-center">
              <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                <div className="text-xs text-white/40 mb-1">Protein</div>
                <div className="font-orbitron text-sm">{pTarget}g</div>
              </div>
              <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                <div className="text-xs text-white/40 mb-1">Carbs</div>
                <div className="font-orbitron text-sm">{cTarget}g</div>
              </div>
              <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                <div className="text-xs text-white/40 mb-1">Fats</div>
                <div className="font-orbitron text-sm">{fTarget}g</div>
              </div>
            </div>
            
            <form onSubmit={handleNutritionSubmit} className="flex gap-2 mt-auto">
              <button type="button" className="p-3 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={foodInput}
                onChange={e => setFoodInput(e.target.value)}
                placeholder="Log meal: e.g., Grilled chicken..."
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 text-sm focus:outline-none focus:border-volt/50 text-white"
                disabled={state === "analyzing_nutrition"}
              />
              <button 
                type="submit"
                disabled={!foodInput.trim() || state === "analyzing_nutrition"}
                className="px-6 rounded-lg bg-volt text-charcoal font-bold text-sm hover:bg-volt/90 transition disabled:opacity-50"
              >
                Analyze
              </button>
            </form>

            <AnimatePresence>
              {nutritionFeedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-volt/10 border border-volt/30 rounded-lg p-3 text-sm text-volt font-medium flex items-start gap-2"
                >
                  <BrainCircuit className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{nutritionFeedback}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BentoCard>

        {/* Muscle Readiness */}
        <BentoCard title="System Readiness (Manual Override)" icon={<TrendingUp className="w-5 h-5" />} className="md:col-span-3 overflow-hidden">
          <div className="flex flex-col gap-4 pt-4">
            
            {/* Dynamic Recovery Concierge */}
            <AnimatePresence>
              {exhaustedMuscles.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-sunset/10 border border-sunset/30 rounded-lg p-3 flex items-start gap-3"
                >
                  <ShieldAlert className="w-5 h-5 text-sunset shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sunset text-sm font-bold uppercase tracking-wider mb-1">Genki Recovery Concierge</h4>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Critical fatigue detected in: {exhaustedMuscles.map(m => m.name).join(", ")}. 
                      <br/><strong>Protocol:</strong> Skip heavy loads for these groups. Focus on 15m active stretching, cryotherapy, or mobility work today.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex justify-between items-end h-40 pt-4">
              {/* Scanning Laser Animation */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "1000%" }}
                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    className="absolute top-0 bottom-0 w-1 bg-volt shadow-[0_0_20px_rgba(0,229,255,1)] z-20"
                  />
                )}
              </AnimatePresence>

              {muscleReadiness.map((muscle, i) => {
                const recovery = muscle.recovery;
                const isLow = recovery < 60;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 w-full group z-10">
                    <motion.div 
                      key={recovery}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-xs text-white/50 font-medium group-hover:text-white transition-colors"
                    >
                      {recovery}%
                    </motion.div>
                    <div className="w-full max-w-[40px] h-24 bg-white/5 rounded-t-lg relative overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${recovery}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`absolute bottom-0 w-full rounded-t-lg ${isLow ? 'bg-sunset shadow-[0_0_10px_rgba(255,87,34,0.3)]' : 'bg-volt/80 shadow-[0_0_10px_rgba(0,229,255,0.3)]'}`}
                      />
                    </div>
                    <div className="text-xs font-medium text-white/80">{muscle.name}</div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={recovery} 
                      onChange={(e) => updateMuscleReadiness(i, parseInt(e.target.value))}
                      className="w-16 h-1 mt-1 appearance-none bg-white/10 rounded outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-volt cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </BentoCard>

        {/* AI Generated Roadmap */}
        <div className="md:col-span-3 space-y-6 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-6 h-6 text-volt" />
            <h2 className="text-2xl font-orbitron font-semibold">Dynamic Routine Engine</h2>
          </div>
          
          {!roadmap ? (
            <div className="glass-card p-12 text-center border-dashed border-white/20">
              <p className="text-white/50 font-inter max-w-md mx-auto">
                No active roadmap. Sync your biological assets or report to Genki to generate a dynamic, muscle-aware 7-day plan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roadmap.map((day: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="glass p-5 rounded-xl border border-volt/20 hover:border-volt/50 transition-colors group"
                >
                  <div className="text-xs font-bold text-volt mb-1 uppercase tracking-wider">{day.day}</div>
                  <div className="font-orbitron font-semibold text-lg mb-4 text-white group-hover:text-glow transition-all leading-tight">{day.focus}</div>
                  <ul className="space-y-2">
                    {day.exercises.map((ex: string, j: number) => (
                      <li key={j} className="text-sm text-white/70 flex items-start gap-2 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-volt/50 mt-1.5 shrink-0"></span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}