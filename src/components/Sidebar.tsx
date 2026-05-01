"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGenki } from "@/context/GenkiContext";
import { Send, Zap, Loader2 } from "lucide-react";
import Image from "next/image";

export function Sidebar() {
  const { state, askGenki, analysisMessage } = useGenki();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      askGenki(input);
      setInput("");
    }
  };

  const getGenkiMessage = () => {
    switch (state) {
      case "idle":
        return "Hi I'm Genki your gym buddy. What's the target today?";
      case "thinking":
        return "Calculating optimal path... Recovery Protocol Active.";
      case "analyzing_nutrition":
        return "Scanning food macros... updating health score.";
      case "analyzing_kinetics":
        return "Status: Bio-Scanning Biological Assets...";
      case "success":
        return "Done. No excuses, let's crush it!";
      case "missing_goals":
        return "Invalid input. Give me something to work with!";
    }
  };

  const getGenkiImage = () => {
    if (state === "missing_goals") return "/genki-alert.png";
    if (state === "thinking" || state === "analyzing_kinetics" || state === "success") return "/genki-training.png";
    return "/genki-rest.png"; // idle or analyzing_nutrition
  };

  return (
    <div className="w-80 h-full border-r border-white/5 bg-charcoal/50 backdrop-blur-md flex flex-col pt-6 pb-6 px-4">
      <div className="flex items-center gap-3 mb-8 px-2 shrink-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-volt/30 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
          <Image src="/gym-buddy-logo.png" alt="Gym Buddy Logo" fill className="object-cover" />
        </div>
        <h1 className="text-xl font-orbitron font-bold tracking-wider text-white">GYM BUDDY</h1>
      </div>

      <div className="flex-1 flex flex-col items-center pt-2 overflow-y-auto overflow-x-hidden no-scrollbar">
        <motion.div 
          className="relative w-48 h-48 shrink-0 rounded-full border-2 overflow-hidden mb-6 flex items-center justify-center bg-black/50"
          animate={{
            borderColor: (state === "thinking" || state === "analyzing_nutrition" || state === "analyzing_kinetics") ? "#00E5FF" : state === "success" ? "#00E5FF" : state === "missing_goals" ? "#FF5722" : "rgba(255,255,255,0.1)",
            boxShadow: (state === "thinking" || state === "analyzing_nutrition" || state === "analyzing_kinetics" || state === "success") ? "0 0 20px rgba(0, 229, 255, 0.5)" : "none",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-volt/10 to-transparent z-10 pointer-events-none"></div>
          {(state === "thinking" || state === "analyzing_nutrition" || state === "analyzing_kinetics") && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-[-10px] border-t-2 border-volt rounded-full z-20"
            />
          )}
          
          <div className="relative w-full h-full">
             <Image 
               src={getGenkiImage()} 
               alt="Genki AI Character" 
               fill 
               className="object-cover opacity-90 transition-opacity duration-300"
               sizes="(max-width: 192px) 100vw, 192px"
             />
          </div>
        </motion.div>

        {/* Genki Status Bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass px-4 py-3 rounded-xl text-sm font-medium text-center w-full min-h-[60px] flex items-center justify-center text-white/90 shrink-0"
          >
            {getGenkiMessage()}
          </motion.div>
        </AnimatePresence>

        {/* AI Analysis Result */}
        <AnimatePresence>
          {analysisMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 glass-card border border-volt/30 text-sm text-white/80 w-full"
            >
              <div className="flex items-center gap-2 mb-2 text-volt font-bold uppercase tracking-wider text-xs">
                <Zap className="w-3 h-3" /> Kinetic Analysis
              </div>
              <p className="leading-relaxed">{analysisMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="mt-auto pt-4 shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Report goals or fatigue..."
            disabled={state === "thinking" || state === "analyzing_nutrition" || state === "analyzing_kinetics"}
            className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-volt/50 focus:ring-1 focus:ring-volt/50 transition-all text-white placeholder-white/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || state === "thinking" || state === "analyzing_nutrition" || state === "analyzing_kinetics"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-volt/10 text-volt hover:bg-volt/20 disabled:opacity-50 disabled:hover:bg-volt/10 transition-colors"
          >
            {(state === "thinking" || state === "analyzing_nutrition" || state === "analyzing_kinetics") ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
