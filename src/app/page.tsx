"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Zap,
  RefreshCw
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

const SIMULATED_LOGS = [
  "[system] Initializing EXPRESS pipeline v1.3.0...",
  "[crawler] Connecting to domain target host...",
  "[crawler] Sending request: GET / HTTP/1.1...",
  "[crawler] Success: Host resolved, status code 200.",
  "[crawler] Extracting DOM structure...",
  "[crawler] Detected 143 headings, 8 tables, 4 forms.",
  "[crawler] Performance audit completed: LCP=2.8s, CLS=0.02.",
  "[nlp] Tokenizing body copy, preparing NLP input stream...",
  "[nlp] Running semantic vector classification...",
  "[nlp] Mapping keyword associations to UCSC ontology catalog...",
  "[nlp] Found Entity: Organization (Relevance Weight: 0.98)",
  "[nlp] Found Entity: SaaS Product (Relevance Weight: 0.89)",
  "[nlp] Found Entity: API Integration (Relevance Weight: 0.82)",
  "[nlp] Found Entity: Generative AI (Relevance Weight: 0.74)",
  "[aeo] Evaluating accessibility scores for conversational search...",
  "[aeo] Checking schema configurations (JSON-LD, Microdata)...",
  "[aeo] Warning: Missing Product schema markup.",
  "[geo] Evaluating RAG indexing compatibility...",
  "[geo] Structuring conversational FAQ markdown payload...",
  "[system] Compiling payload generation assets...",
  "[system] Deployment payloads generated successfully."
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "completed">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [mockData, setMockData] = useState<MockAnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState<"market" | "technical" | "payloads">("market");
  const [logs, setLogs] = useState<string[]>([]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-run stepper during analysis phase
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "analyzing") {
      if (currentStep < PIPELINE_STEPS.length) {
        timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 1100);
      } else {
        setMockData(getMockDataForUrl(url));
        setStatus("completed");
        setActiveTab("market"); // Reset tab
      }
    }
    return () => clearTimeout(timer);
  }, [status, currentStep, url]);

  // Live log simulation stream
  useEffect(() => {
    let logInterval: NodeJS.Timeout;
    if (status === "analyzing") {
      setLogs([]);
      let logIndex = 0;
      logInterval = setInterval(() => {
        if (logIndex < SIMULATED_LOGS.length) {
          setLogs((prev) => [...prev, SIMULATED_LOGS[logIndex]]);
          logIndex++;
        } else {
          clearInterval(logInterval);
        }
      }, 190); // Stream log lines quickly
    }
    return () => clearInterval(logInterval);
  }, [status]);

  // Auto scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url) {
      setError("Please provide a website URL to begin analysis.");
      return;
    }

    try {
      const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
      setUrl(parsedUrl.toString());
      
      setCurrentStep(0);
      setMockData(null);
      setStatus("analyzing");
    } catch {
      setError("Please enter a valid website URL (e.g., https://yourwebsite.com).");
    }
  };

  return (
    <div className="dot-grid min-h-screen flex flex-col justify-between relative bg-bg-main font-sans text-text-primary">
      
      {/* Soft dark-mode glowing accent blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* GLOBAL STICKY TOPBAR HEADER */}
      <nav className="sticky top-0 z-50 w-full bg-[#000000]/95 backdrop-blur-md border-b border-[#121212] py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group" 
          onClick={() => { setStatus("idle"); setUrl(""); setMockData(null); }}
          title="Return to home page"
        >
          <span className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-primary/20 hover:bg-[#E03300] transition-colors">
            EX
          </span>
          <span className="font-extrabold tracking-tight text-text-primary text-lg">EXPRESS</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-4xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-wider">
            Pipeline
          </span>
        </div>

        {/* Center: Sticky Search bar (Active when not idle) */}
        {status !== "idle" && (
          <div className="w-full max-w-xl animate-fade-in">
            <form 
              onSubmit={handleAnalyze} 
              className="flex gap-2 bg-[#0D0D0D] border border-[#1F1F1F] p-1.5 rounded-xl focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all shadow-sm"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Globe className="w-4 h-4 text-text-secondary flex-shrink-0" />
                <input
                  type="text"
                  disabled={status === "analyzing"}
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-transparent border-0 outline-none w-full text-sm text-text-primary font-bold focus:ring-0 placeholder-text-secondary/60 py-1"
                />
              </div>
              <button
                type="submit"
                disabled={status === "analyzing"}
                className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-[#E03300] text-white text-xs font-bold transition-all active:scale-98 disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-brand-primary/15 cursor-pointer"
              >
                {status === "analyzing" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>{status === "analyzing" ? "Running" : "Re-Analyze"}</span>
              </button>
            </form>
          </div>
        )}

        {/* Right: Operational Status */}
        <div className="flex items-center gap-2 bg-[#0D0D0D] px-3.5 py-1.5 rounded-lg border border-[#1F1F1F]">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
          <span className="text-4xs font-bold text-text-secondary uppercase tracking-widest select-none">
            Systems Operational
          </span>
        </div>
      </nav>

      {/* WORKSPACE AREA */}
      <main className="flex-1 flex flex-col items-center py-12 relative z-10 w-full">
        
        {/* 1. IDLE STATE */}
        {status === "idle" && (
          <div className="w-full max-w-5xl px-6 tab-fade-in flex flex-col items-center">
            
            {/* Centered Hero Header using block-level layout to prevent vertical text wrap */}
            <div className="w-full text-center mb-12 select-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                <span>Generative, Voice & Vector Optimization Pipeline</span>
              </div>
              
              {/* CRED style bold uppercase high-tracking title */}
              <h1 className="text-6xl md:text-8xl font-black tracking-widest text-white uppercase mb-4 filter drop-shadow-[0_0_30px_rgba(255,62,0,0.15)]">
                EXPRESS
              </h1>
              
              {/* Stable paragraph block ensuring horizontal text flow */}
              <p className="text-sm md:text-base text-text-secondary w-full max-w-xl mx-auto font-medium tracking-wide leading-relaxed">
                Analyze your website alignment against AI crawlers, natural language parsing layers, and vector search engines.
              </p>
            </div>

            {/* URL Input Box */}
            <div className="w-full max-w-2xl mb-8">
              <form 
                onSubmit={handleAnalyze} 
                className="bg-[#0D0D0D] p-2.5 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-lg border border-[#1F1F1F] transition-all duration-200 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10"
              >
                <div className="flex-1 flex items-center gap-3 px-3 py-2 sm:py-0">
                  <Globe className="w-5 h-5 text-brand-primary flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="https://yourwebsite.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-transparent border-0 outline-none w-full text-sm sm:text-base placeholder-text-secondary text-text-primary font-bold focus:ring-0"
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-bold tracking-wide transition-all active:scale-98 shadow-md shadow-brand-primary/20 hover:bg-[#E03300] cursor-pointer flex items-center justify-center gap-1.5 group"
                >
                  <span>Analyze Website</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>

              {error && (
                <div className="mt-3 flex items-center gap-2 text-state-error text-xs px-2 animate-scale-in">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. ANALYZING STATE */}
        {status === "analyzing" && (
          <div className="w-full max-w-6xl px-6 tab-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Progress Stepper */}
            <div className="lg:col-span-5 bg-[#0D0D0D] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1F1F1F] flex flex-col gap-6">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2 select-none">
                <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                Optimization Engine Stepper
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
                          isCompleted ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" :
                          isActive ? "bg-brand-primary/15 border-brand-primary text-brand-accent animate-pulse shadow-sm shadow-brand-primary/10" :
                          "bg-slate-900 border-[#1F1F1F] text-text-secondary"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-state-success" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}
                        </div>
                        
                        {idx < PIPELINE_STEPS.length - 1 && (
                          <div className={`w-0.5 h-10 mt-1 transition-all duration-500 ${
                            isCompleted ? "bg-brand-primary/30" : "bg-[#1F1F1F]"
                          }`}></div>
                        )}
                      </div>

                      <div className="flex-1 pt-0.5">
                        <h4 className={`text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300 ${
                          isCompleted ? "text-text-primary" : isActive ? "text-brand-primary" : "text-text-secondary"
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

              {/* Loader bottom bar */}
              <div className="bg-[#121212] h-1.5 w-full rounded-full overflow-hidden border border-[#1F1F1F] mt-4">
                <div 
                  className="h-full bg-brand-primary transition-all duration-550 ease-out"
                  style={{ width: `${(currentStep / PIPELINE_STEPS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Right: Operational Log Terminal */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl shadow-xl overflow-hidden border border-[#1F1F1F] flex flex-col h-[400px]">
              <header className="bg-slate-900/60 px-5 py-3.5 flex items-center justify-between border-b border-[#1F1F1F]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-state-error/70 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-state-warning/70 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-state-success/70 block"></span>
                  </div>
                  <span className="text-3xs font-mono text-slate-450 ml-2">crawler-parser-logs.sh</span>
                </div>
                <span className="text-4xs font-mono text-brand-primary tracking-widest animate-pulse">STREAMING</span>
              </header>

              <div className="flex-1 p-5 font-mono text-3xs sm:text-2xs text-slate-300 overflow-y-auto space-y-2 log-scrollbar bg-[#050505] border-t border-[#1F1F1F]">
                {logs.map((log, index) => {
                  let isSuccess = log.includes("[SUCCESS]") || log.includes("success");
                  let isWarning = log.includes("[WARNING]");
                  let isSystem = log.includes("[system]");
                  
                  return (
                    <div 
                      key={index}
                      className={`leading-relaxed whitespace-pre-wrap transition-opacity duration-150 animate-fade-in ${
                        isSuccess ? "text-emerald-450" :
                        isWarning ? "text-brand-accent" :
                        isSystem ? "text-brand-primary font-bold" : "text-slate-350"
                      }`}
                    >
                      {log}
                    </div>
                  );
                })}
                <div ref={logEndRef} />
              </div>
            </div>

          </div>
        )}

        {/* 3. COMPLETED STATE */}
        {status === "completed" && mockData && (
          <div className="w-full flex flex-col gap-8 tab-fade-in">
            
            {/* Workspace Dashboard Tabselector Bar */}
            <div className="w-full max-w-7xl mx-auto px-6">
              <div className="bg-[#0D0D0D] border border-[#1F1F1F] p-1.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                
                {/* Left: Domain Indicator */}
                <div className="flex items-center gap-3 px-3">
                  <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-text-primary">{mockData.url}</h3>
                    <p className="text-4xs font-mono text-text-secondary uppercase tracking-widest mt-0.5">Workspace Active</p>
                  </div>
                </div>

                {/* Center: Tab buttons */}
                <div className="flex bg-[#050505] p-1 rounded-xl border border-[#1F1F1F]">
                  <button
                    onClick={() => setActiveTab("market")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                      activeTab === "market"
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 border-0"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>📊 Market & Intent</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("technical")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                      activeTab === "technical"
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 border-0"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>⚙️ Technical Audit</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("payloads")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                      activeTab === "payloads"
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 border-0"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>💾 Deploy Payloads</span>
                  </button>
                </div>

                {/* Right: Score Summary */}
                <div className="hidden sm:flex items-center gap-4 pr-3 text-xs border-l border-[#1F1F1F] pl-6">
                  <div className="text-center">
                    <span className="text-4xs uppercase tracking-widest text-text-secondary block">Overall Score</span>
                    <span className="font-extrabold text-brand-primary text-sm">{mockData.score}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Panels */}
            {activeTab === "market" && (
              <ReportZone data={mockData} activeTab="market" />
            )}
            {activeTab === "technical" && (
              <ReportZone data={mockData} activeTab="technical" />
            )}
            {activeTab === "payloads" && (
              <PayloadZone data={mockData} />
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full text-center py-8 border-t border-[#121212] bg-[#000000] text-3xs text-text-secondary relative z-10 flex flex-col items-center gap-1.5">
        <p>© {new Date().getFullYear()} EXPRESS Pipeline. Zero-friction AEO, GEO, and SEO optimization.</p>
        <p className="text-text-secondary/40 font-mono tracking-widest uppercase">STATUS: SYSTEMS_OPERATIONAL // VER: 1.4.0</p>
      </footer>
    </div>
  );
}
