"use client";

import React, { useState, useEffect } from "react";
import { getMockDataForUrl, MockAnalysisData } from "../data/mockData";
import ReportZone from "../components/ReportZone";
import PayloadZone from "../components/PayloadZone";
import { 
  Search, 
  Globe, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Layers, 
  ArrowRight, 
  ShieldAlert,
  Zap
} from "lucide-react";

const PIPELINE_STEPS = [
  {
    title: "Crawling HTML & DOM Structure",
    desc: "Fetching page markup, resolving canonical URLs, and measuring Core Web Vitals...",
    icon: Globe,
  },
  {
    title: "Extracting Semantic Entity Map",
    desc: "Running Natural Language Processing (NLP) to classify organizational schemas & key keywords...",
    icon: Cpu,
  },
  {
    title: "Evaluating Voice & AEO Context",
    desc: "Testing query patterns against conversational schema standards and LLM vector embeddings...",
    icon: Layers,
  },
  {
    title: "Compiling Optimization Payloads",
    desc: "Generating bespoke JSON-LD schemas, AEO FAQ markdown, and GEO authority sections...",
    icon: Sparkles,
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "completed">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [mockData, setMockData] = useState<MockAnalysisData | null>(null);

  // Auto-run stepper during analysis phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "analyzing") {
      if (currentStep < PIPELINE_STEPS.length) {
        timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 1100);
      } else {
        // Complete the pipeline
        setMockData(getMockDataForUrl(url));
        setStatus("completed");
      }
    }
    return () => clearTimeout(timer);
  }, [status, currentStep, url]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url) {
      setError("Please provide a website URL to begin analysis.");
      return;
    }

    // Basic URL parsing validation
    try {
      const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
      setUrl(parsedUrl.toString());
      
      // Reset and trigger analysis
      setCurrentStep(0);
      setMockData(null);
      setStatus("analyzing");
    } catch {
      setError("Please enter a valid website URL (e.g., https://yourwebsite.com).");
    }
  };

  return (
    <div className="cyber-grid min-h-screen flex flex-col justify-between relative bg-bg-main font-sans text-text-primary overflow-hidden">
      
      {/* Vibrant decorative ambient mesh highlights */}
      <div className="absolute top-[-8%] left-[-8%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none animate-pulse-slow"></div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center py-16 px-6 relative z-10 w-full">
        
        {/* HERO HEADER */}
        <header className="text-center mb-16 flex flex-col items-center select-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-extrabold border border-indigo-500/25 mb-6 shadow-lg shadow-indigo-500/5 animate-float">
            <Zap className="w-3.5 h-3.5 text-brand-accent" />
            <span className="tracking-wide">AI-Powered Optimization Engine</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-indigo-300 mb-4 filter drop-shadow-[0_4px_12px_rgba(99,102,241,0.15)]">
            EXPRESS
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-xl font-medium tracking-wide">
            Generative & Answer Engine Optimization Pipeline
          </p>
        </header>

        {/* INPUT ZONE */}
        <div className="w-full max-w-2xl mb-12">
          <form 
            onSubmit={handleAnalyze} 
            className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/5 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.08)]"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-2 sm:py-0">
              <Globe className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <input
                type="text"
                disabled={status === "analyzing"}
                placeholder="https://yourwebsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-sm sm:text-base placeholder-text-secondary text-white font-medium focus:ring-0"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "analyzing"}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-bold tracking-wide transition-all active:scale-98 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-650 cursor-pointer"
            >
              {status === "analyzing" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Website</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Validation error */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-state-error text-xs px-2 animate-scale-in">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}
        </div>

        {/* LOADING & STEPPER ZONE */}
        {status === "analyzing" && (
          <div className="w-full max-w-xl glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl mb-12 animate-fade-in border-indigo-500/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              Optimization Engine Status
            </h3>

            <div className="flex flex-col gap-6">
              {PIPELINE_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                return (
                  <div 
                    key={idx} 
                    className={`flex gap-4 transition-opacity duration-300 ${
                      isCompleted ? "opacity-100" : isActive ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isCompleted ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400" :
                        isActive ? "bg-indigo-500/10 border-indigo-500 text-indigo-300 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.25)]" :
                        "bg-bg-main border-white/5 text-text-secondary"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                      
                      {idx < PIPELINE_STEPS.length - 1 && (
                        <div className={`w-0.5 h-10 mt-1 transition-all duration-500 ${
                          isCompleted ? "bg-indigo-500/35" : "bg-white/5"
                        }`}></div>
                      )}
                    </div>

                    <div className="flex-1 pt-0.5">
                      <h4 className={`text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300 ${
                        isCompleted ? "text-white" : isActive ? "text-indigo-400" : "text-text-secondary"
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-3xs sm:text-2xs text-text-secondary mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Visual bottom progress bar */}
            <div className="mt-8 bg-bg-main h-1.5 w-full rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-650 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / PIPELINE_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* REPORT & PAYLOAD ZONE (Conditional Render) */}
        {status === "completed" && mockData && (
          <div className="w-full flex flex-col gap-12 animate-fade-in">
            {/* Divider header */}
            <div className="w-full max-w-7xl mx-auto px-6 flex items-center gap-4">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-2xs font-mono text-indigo-400 uppercase tracking-widest bg-bg-main px-3 font-bold">
                Analysis Pipeline Output for {mockData.url}
              </span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>

            {/* Zone 2: Report Zone */}
            <ReportZone data={mockData} />

            {/* Divider header */}
            <div className="w-full max-w-7xl mx-auto px-6 flex items-center gap-4 mt-8">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-2xs font-mono text-indigo-400 uppercase tracking-widest bg-bg-main px-3 font-bold">
                Payload Deployment Workspace
              </span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>

            {/* Zone 3: Payload Deployment Zone */}
            <PayloadZone data={mockData} />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="w-full text-center py-8 border-t border-white/5 bg-zinc-950/20 text-3xs text-text-secondary relative z-10 flex flex-col items-center gap-1.5">
        <p>© {new Date().getFullYear()} EXPRESS Pipeline. Zero-friction AEO, GEO, and SEO optimization.</p>
        <p className="text-text-secondary/40 font-mono tracking-widest">STATUS: SYSTEMS_OPERATIONAL // VER: 1.2.0</p>
      </footer>
    </div>
  );
}
