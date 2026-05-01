import Link from "next/link";
import { ArrowRight, Activity, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-charcoal text-white overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-volt/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-sunset/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-volt text-glow" />
          <span className="font-orbitron font-bold text-xl tracking-wider">GYM BUDDY</span>
        </div>
        <Link 
          href="/dashboard"
          className="text-sm font-medium hover:text-volt transition-colors"
        >
          Enter Command Center
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-volt/20 text-volt text-xs font-bold tracking-widest uppercase">
              <Activity className="w-4 h-4" />
              <span>AI-Powered Concierge</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-orbitron font-black leading-tight tracking-tight">
              NO EXCUSES.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt to-white">JUST EXECUTION.</span>
            </h1>
            
            <p className="text-lg text-white/60 max-w-xl font-inter leading-relaxed">
              Meet Genki, your relentless, data-driven AI coach. Stop guessing your workouts. Report your fatigue, get a personalized 7-day roadmap, and achieve Wealthy Health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-volt text-charcoal font-bold px-8 py-4 rounded-full hover:bg-volt/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              >
                Start Training <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                View Features
              </button>
            </div>
            
            <div className="pt-8 flex items-center gap-6 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-volt" /> Premium Access
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-volt" /> Adaptive Intelligence
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
            {/* Abstract visual representing Genki / Data */}
            <div className="relative w-full max-w-md aspect-square glass-card rounded-full overflow-hidden flex items-center justify-center animate-pulse-slow">
              <div className="absolute inset-0 bg-gradient-to-tr from-volt/20 to-transparent"></div>
              <Zap className="w-32 h-32 text-volt text-glow drop-shadow-[0_0_30px_rgba(0,229,255,0.8)]" />
              <div className="absolute w-full h-full border border-volt/20 rounded-full animate-spin-slow"></div>
              <div className="absolute w-3/4 h-3/4 border-2 border-dashed border-volt/30 rounded-full animate-spin-reverse-slow"></div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
