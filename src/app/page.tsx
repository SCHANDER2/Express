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
  LayoutDashboard,
  FileCode,
  LineChart,
  ShieldCheck,
  ChevronRight,
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

const DEMO_TEMPLATES = [
  {
    domain: "acme-saas.com",
    title: "Acme Workflows",
    desc: "Enterprise CRM & task automation workflow suite. High organic search volume.",
    icon: LayoutDashboard,
    badge: "Enterprise SaaS"
  },
  {
    domain: "ledger-finance.io",
    title: "Ledger Finance",
    desc: "DeFi liquidity routing engine & API interface. Highly dense numbers and data.",
    icon: LineChart,
    badge: "FinTech"
  },
  {
    domain: "health-flow.org",
    title: "HealthFlow Portal",
    desc: "Biomedical data sharing portal & clinical trials database. Content-rich.",
    icon: ShieldCheck,
    badge: "Healthcare"
  }
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

  const handleLoadDemo = (domain: string) => {
    const targetUrl = `https://${domain}`;
    setUrl(targetUrl);
    setError("");
    setCurrentStep(0);
    setMockData(null);
    setStatus("analyzing");
  };

  return (
    <div className="dot-grid min-h-screen flex flex-col justify-between relative bg-bg-main font-sans text-text-primary">
      
      {/* GLOBAL STICKY TOPBAR HEADER */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm shadow-slate-100/5">
        {/* Left: Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group" 
          onClick={() => { setStatus("idle"); setUrl(""); setMockData(null); }}
          title="Return to quickstart"
        >
          <span className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-primary/20 group-hover:bg-cyan-600 transition-colors">
            EX
          </span>
          <span className="font-extrabold tracking-tight text-text-primary text-lg">EXPRESS</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-4xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-wider">
            Pipeline
          </span>
        </div>

        {/* Center: Sticky Search bar (Only active when not idle for clean layout, or as a global bar) */}
        {status !== "idle" && (
          <div className="w-full max-w-xl animate-fade-in">
            <form 
              onSubmit={handleAnalyze} 
              className="flex gap-2 bg-white border border-slate-200 p-1.5 rounded-xl focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all shadow-sm"
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
                className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-cyan-600 text-white text-xs font-bold transition-all active:scale-98 disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-brand-primary/15 cursor-pointer"
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
        <div className="flex items-center gap-2 bg-slate-100/60 px-3.5 py-1.5 rounded-lg border border-slate-200/50">
          <span className="w-2 h-2 rounded-full bg-state-success animate-pulse"></span>
          <span className="text-4xs font-bold text-text-secondary uppercase tracking-widest select-none">
            Systems Operational
          </span>
        </div>
      </nav>

      {/* WORKSPACE AREA */}
      <main className="flex-1 flex flex-col items-center py-12 relative z-10 w-full">
        
        {/* 1. IDLE (EMPTY QUICKSTART) STATE */}
        {status === "idle" && (
          <div className="w-full max-w-5xl px-6 tab-fade-in flex flex-col items-center">
            {/* Centered Hero Header */}
            <div className="w-full max-w-2xl text-center mb-12 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold border border-brand-primary/20 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                <span>Generative, Voice & Vector Optimization Pipeline</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-slate-700 to-brand-primary mb-4 select-none">
                EXPRESS
              </h1>
              <p className="text-sm md:text-base text-text-secondary w-full max-w-xl text-center font-medium tracking-wide leading-relaxed">
                Analyze your website alignment against AI crawlers, natural language parsing layers, and vector search engines.
              </p>
            </div>

            {/* URL Main Input Card */}
            <div className="w-full max-w-2xl mb-16">
              <form 
                onSubmit={handleAnalyze} 
                className="bg-white p-2.5 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-lg border border-slate-200 transition-all duration-200 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10"
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
                  className="px-6 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-bold tracking-wide transition-all active:scale-98 shadow-md shadow-brand-primary/20 hover:bg-cyan-600 cursor-pointer flex items-center justify-center gap-1.5 group"
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

            {/* Quickstart Demo templates divider */}
            <div className="w-full flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200/80 flex-1"></div>
              <span className="text-3xs font-mono text-text-secondary uppercase tracking-widest font-extrabold">
                Select a template domain to test preview
              </span>
              <div className="h-px bg-slate-200/80 flex-1"></div>
            </div>

            {/* Click-to-load cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {DEMO_TEMPLATES.map((demo, idx) => {
                const DemoIcon = demo.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleLoadDemo(demo.domain)}
                    className="light-panel rounded-2xl p-6 flex flex-col gap-6 cursor-pointer relative group transition-all duration-300"
                  >
                    {/* Top Row: Icon and Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100/60 pb-4">
                      <div className="p-2.5 bg-slate-150/80 text-slate-700 rounded-xl group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all duration-200">
                        <DemoIcon className="w-5 h-5" />
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-4xs font-bold font-mono tracking-widest uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 select-none">
                        {demo.badge}
                      </span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="flex flex-col gap-2">
                      <h4 className="font-extrabold text-text-primary text-base group-hover:text-brand-primary transition-colors">
                        {demo.title}
                      </h4>
                      <span className="text-3xs font-mono text-brand-primary/80 font-bold block">
                        {demo.domain}
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed mt-1">
                        {demo.desc}
                      </p>
                    </div>

                    {/* Bottom: Action link footer */}
                    <div className="flex items-center justify-between text-xs font-bold text-brand-primary group-hover:text-cyan-600 border-t border-slate-100/60 pt-4 mt-auto">
                      <span>Launch Pipeline</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ANALYZING (TERMINAL PROGRESS) STATE */}
        {status === "analyzing" && (
          <div className="w-full max-w-6xl px-6 tab-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Progress Stepper steps (col-span-5) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 flex flex-col gap-6">
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
                          "bg-slate-100 border-slate-250 text-text-secondary"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-state-success" />
                          ) : (
                            <StepIcon className="w-4 h-4" />
                          )}
                        </div>
                        
                        {idx < PIPELINE_STEPS.length - 1 && (
                          <div className={`w-0.5 h-10 mt-1 transition-all duration-500 ${
                            isCompleted ? "bg-brand-primary/30" : "bg-slate-200"
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
              <div className="bg-slate-100 h-1.5 w-full rounded-full overflow-hidden border border-slate-200/60 mt-4">
                <div 
                  className="h-full bg-brand-primary transition-all duration-550 ease-out"
                  style={{ width: `${(currentStep / PIPELINE_STEPS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Right: Live Diagnostics operations Log Terminal (col-span-7) */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl shadow-xl overflow-hidden border border-slate-900 flex flex-col h-[400px]">
              <header className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-state-error/70 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-state-warning/70 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-state-success/70 block"></span>
                  </div>
                  <span className="text-3xs font-mono text-slate-400 ml-2">crawler-parser-logs.sh</span>
                </div>
                <span className="text-4xs font-mono text-brand-primary tracking-widest animate-pulse">STREAMING</span>
              </header>

              {/* Scrolling log container */}
              <div className="flex-1 p-5 font-mono text-3xs sm:text-2xs text-slate-300 overflow-y-auto space-y-2 log-scrollbar bg-slate-950">
                {logs.map((log, index) => {
                  let isSuccess = log.includes("[SUCCESS]") || log.includes("success");
                  let isWarning = log.includes("[WARNING]");
                  let isSystem = log.includes("[system]");
                  
                  return (
                    <div 
                      key={index}
                      className={`leading-relaxed whitespace-pre-wrap transition-opacity duration-150 animate-fade-in ${
                        isSuccess ? "text-emerald-400" :
                        isWarning ? "text-amber-500" :
                        isSystem ? "text-indigo-400 font-bold" : "text-slate-350"
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

        {/* 3. COMPLETED (TABBED WORKSPACE) STATE */}
        {status === "completed" && mockData && (
          <div className="w-full flex flex-col gap-8 tab-fade-in">
            
            {/* Workspace Dashboard Tabselector Bar */}
            <div className="w-full max-w-7xl mx-auto px-6">
              <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                
                {/* Left: Domain Indicator */}
                <div className="flex items-center gap-3 px-3">
                  <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-text-primary">{mockData.url}</h3>
                    <p className="text-4xs font-mono text-text-secondary uppercase tracking-widest mt-0.5">Workspace Active</p>
                  </div>
                </div>

                {/* Center: Tab buttons */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button
                    onClick={() => setActiveTab("market")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                      activeTab === "market"
                        ? "bg-white text-text-primary shadow-sm border border-slate-200"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>📊 Market & Intent</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("technical")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                      activeTab === "technical"
                        ? "bg-white text-text-primary shadow-sm border border-slate-200"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>⚙️ Technical Audit</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("payloads")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                      activeTab === "payloads"
                        ? "bg-white text-text-primary shadow-sm border border-slate-200"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>💾 Deploy Payloads</span>
                  </button>
                </div>

                {/* Right: Score Summary */}
                <div className="hidden sm:flex items-center gap-4 pr-3 text-xs border-l border-slate-200 pl-6">
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
      <footer className="w-full text-center py-8 border-t border-slate-200 bg-white text-3xs text-text-secondary relative z-10 flex flex-col items-center gap-1.5 shadow-inner">
        <p>© {new Date().getFullYear()} EXPRESS Pipeline. Zero-friction AEO, GEO, and SEO optimization.</p>
        <p className="text-text-secondary/40 font-mono tracking-widest uppercase">STATUS: SYSTEMS_OPERATIONAL // VER: 1.3.0</p>
      </footer>
    </div>
  );
}
