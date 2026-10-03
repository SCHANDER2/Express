'use client';

import React, { useState, useEffect, useRef } from "react";
import { AnalysisResult } from "@/types";
import SeoAuditReport from "../components/SeoAuditReport";
import AeoReport from "../components/AeoReport";
import GeoReport from "../components/GeoReport";
import ScoreGauge from "../components/ScoreGauge";
import { Search, Globe, MessageSquare, Layers, Loader2, RefreshCw, ArrowRight, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

const PIPELINE_STEPS = {
  seo: [
    { title: "Crawling DOM", desc: "Fetching HTML and resolving links...", icon: Globe },
    { title: "Running 50+ Checks", desc: "Validating meta, structure, and perf...", icon: Search },
    { title: "Compiling SEO Score", desc: "Generating final audit report...", icon: CheckCircle2 }
  ],
  aeo: [
    { title: "Analyzing Queries", desc: "Extracting voice search intent...", icon: MessageSquare },
    { title: "Checking FAQs", desc: "Evaluating clarity and markup...", icon: Search },
    { title: "Generating AEO Score", desc: "Formatting answerability matrix...", icon: CheckCircle2 }
  ],
  geo: [
    { title: "Retrieving Vectors", desc: "Analyzing semantic density...", icon: Layers },
    { title: "Checking Citations", desc: "Evaluating factual claims...", icon: Globe },
    { title: "Calculating GEO Score", desc: "Generating RAG metrics...", icon: CheckCircle2 }
  ],
  full: [
    { title: "Initializing Engine", desc: "Starting full diagnostic suite...", icon: Loader2 },
    { title: "SEO Audit", desc: "Running technical crawls...", icon: Globe },
    { title: "AEO Analysis", desc: "Evaluating voice readiness...", icon: MessageSquare },
    { title: "GEO Diagnostics", desc: "Checking RAG compatibility...", icon: Layers },
    { title: "Finalizing", desc: "Compiling complete dashboard...", icon: CheckCircle2 }
  ]
};

const SIMULATED_LOGS = [
  "[system] Initializing EXPRESS pipeline v2.0...",
  "[crawler] Connecting to domain target host...",
  "[system] Analyzing payload structure...",
  "[nlp] Extracting entities and intent patterns...",
  "[eval] Running scoring heuristics...",
  "[system] Dashboard preparation complete."
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [module, setModule] = useState<'seo' | 'aeo' | 'geo' | 'full'>('full');
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "completed">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'seo' | 'aeo' | 'geo' | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const logEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const steps = PIPELINE_STEPS[module];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "analyzing" && currentStep < steps.length) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 900);
    }
    return () => clearTimeout(timer);
  }, [status, currentStep, steps.length]);

  useEffect(() => {
    let logInterval: NodeJS.Timeout;
    if (status === "analyzing") {
      let logIndex = 0;
      logInterval = setInterval(() => {
        if (logIndex < SIMULATED_LOGS.length) {
          setLogs(prev => [...prev, SIMULATED_LOGS[logIndex]]);
          logIndex++;
        }
      }, 250);
    }
    return () => clearInterval(logInterval);
  }, [status]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setApiError("");

    if (!url) {
      setError("Please provide a website URL.");
      return;
    }
    
    let normalizedUrl = url;
    try {
      normalizedUrl = new URL(url.startsWith("http") ? url : `https://${url}`).toString();
      setUrl(normalizedUrl);
    } catch {
      setError("Invalid URL.");
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setCurrentStep(0);
    setResult(null);
    setLogs([]);
    setStatus("analyzing");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl, module }),
        signal: controller.signal,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");

      setCurrentStep(steps.length);
      await new Promise(resolve => setTimeout(resolve, 500));

      setResult(data as AnalysisResult);
      if (data.seo) setActiveTab('seo');
      else if (data.aeo) setActiveTab('aeo');
      else if (data.geo) setActiveTab('geo');
      
      setStatus("completed");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setApiError(err instanceof Error ? err.message : "Unexpected error");
      setStatus("idle");
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const getOverallScore = () => {
    if (!result) return 0;
    const scores = [];
    if (result.seo) scores.push(result.seo.score);
    if (result.aeo) scores.push(result.aeo.score);
    if (result.geo) scores.push(result.geo.score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className="dot-grid min-h-screen flex flex-col bg-bg-main font-sans text-text-primary">
      
      {/* Top Nav for Completed State */}
      {status === "completed" && (
        <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setStatus("idle"); setUrl(""); setResult(null); }}>
            <span className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center text-white font-black text-sm">EX</span>
            <span className="font-extrabold tracking-tight text-lg hidden sm:block">EXPRESS</span>
          </div>
          
          <form onSubmit={handleAnalyze} className="flex-1 max-w-xl mx-4 flex bg-slate-50 border border-slate-200 rounded-lg p-1">
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="bg-transparent border-none outline-none w-full px-3 text-sm font-medium" />
            <button type="submit" className="bg-brand-primary text-white px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </form>

          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Overall</span>
            <span className="text-sm font-black text-brand-primary">{getOverallScore()}</span>
          </div>
        </nav>
      )}

      <main className="flex-1 flex flex-col items-center py-12 px-4 relative z-10 w-full">
        
        {/* IDLE STATE */}
        {status === "idle" && (
          <div className="w-full max-w-4xl flex flex-col items-center text-center animate-fade-in mt-12">
            <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-2xl shadow-lg mb-6">EX</div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-4">Complete Website Diagnostic Platform</h1>
            <p className="text-lg text-slate-600 mb-12 max-w-2xl">SEO · AEO · GEO Analysis for AI-Ready Websites.</p>

            <form onSubmit={handleAnalyze} className="w-full max-w-2xl flex flex-col gap-8">
              <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10 transition-all">
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none px-4 py-3 text-lg font-medium placeholder-slate-400"
                />
                <button type="submit" className="bg-brand-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
                  Analyze <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {error && <div className="text-red-500 text-sm font-bold flex items-center justify-center gap-1"><ShieldAlert className="w-4 h-4" /> {error}</div>}
              {apiError && <div className="text-red-500 text-sm font-bold flex items-center justify-center gap-1"><AlertTriangle className="w-4 h-4" /> {apiError}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div onClick={() => setModule('seo')} className={`p-5 rounded-xl border cursor-pointer transition-all ${module === 'seo' ? 'border-brand-primary bg-blue-50 ring-1 ring-brand-primary' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <Search className={`w-6 h-6 mb-3 ${module === 'seo' ? 'text-brand-primary' : 'text-slate-400'}`} />
                  <h3 className="font-bold text-slate-900 mb-1">SEO Audit</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">50+ technical checks, meta analysis, content structure, security & performance diagnostics</p>
                </div>
                <div onClick={() => setModule('aeo')} className={`p-5 rounded-xl border cursor-pointer transition-all ${module === 'aeo' ? 'border-brand-accent bg-purple-50 ring-1 ring-brand-accent' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <MessageSquare className={`w-6 h-6 mb-3 ${module === 'aeo' ? 'text-brand-accent' : 'text-slate-400'}`} />
                  <h3 className="font-bold text-slate-900 mb-1">AEO Analysis</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Answer engine optimization, voice search readiness, featured snippet eligibility, FAQ quality</p>
                </div>
                <div onClick={() => setModule('geo')} className={`p-5 rounded-xl border cursor-pointer transition-all ${module === 'geo' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <Globe className={`w-6 h-6 mb-3 ${module === 'geo' ? 'text-green-600' : 'text-slate-400'}`} />
                  <h3 className="font-bold text-slate-900 mb-1">GEO Analysis</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Generative engine optimization, citation worthiness, RAG compatibility, semantic density</p>
                </div>
                <div onClick={() => setModule('full')} className={`p-5 rounded-xl border cursor-pointer transition-all ${module === 'full' ? 'border-brand-primary bg-blue-50 ring-1 ring-brand-primary' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <Layers className={`w-6 h-6 mb-3 ${module === 'full' ? 'text-brand-primary' : 'text-slate-400'}`} />
                  <h3 className="font-bold text-slate-900 mb-1">Full Analysis</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Complete end-to-end diagnostic — SEO + AEO + GEO combined</p>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ANALYZING STATE */}
        {status === "analyzing" && (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-brand-primary" /> Running Analysis
              </h3>
              <div className="flex flex-col gap-4">
                {steps.map((step, idx) => {
                  const isActive = idx === currentStep;
                  const isDone = idx < currentStep;
                  const Icon = step.icon;
                  return (
                    <div key={idx} className={`flex items-start gap-4 transition-opacity ${isActive || isDone ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-100 text-green-600' : isActive ? 'bg-blue-100 text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${isActive ? 'text-brand-primary' : 'text-slate-700'}`}>{step.title}</div>
                        <div className="text-xs text-slate-500">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[400px]">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-500 font-mono ml-2">terminal</span>
              </div>
              <div className="flex-1 p-4 font-mono text-xs text-green-400 overflow-y-auto whitespace-pre-wrap">
                {logs.map((l, i) => <div key={i}>{l}</div>)}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED STATE */}
        {status === "completed" && result && (
          <div className="w-full max-w-7xl animate-fade-in flex flex-col gap-8">
            
            {/* Score Overview */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-center gap-12">
              {result.module === 'full' ? (
                <>
                  {result.seo && <ScoreGauge score={result.seo.score} label="SEO Score" />}
                  {result.aeo && <ScoreGauge score={result.aeo.score} label="AEO Score" />}
                  {result.geo && <ScoreGauge score={result.geo.score} label="GEO Score" />}
                </>
              ) : (
                <>
                  {result.module === 'seo' && result.seo && <ScoreGauge score={result.seo.score} label="SEO Score" size="lg" />}
                  {result.module === 'aeo' && result.aeo && <ScoreGauge score={result.aeo.score} label="AEO Score" size="lg" />}
                  {result.module === 'geo' && result.geo && <ScoreGauge score={result.geo.score} label="GEO Score" size="lg" />}
                </>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-xl self-center border border-slate-200">
              {result.seo && (
                <button onClick={() => setActiveTab('seo')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'seo' ? 'bg-white shadow text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                  SEO Audit
                </button>
              )}
              {result.aeo && (
                <button onClick={() => setActiveTab('aeo')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'aeo' ? 'bg-white shadow text-brand-accent' : 'text-slate-500 hover:text-slate-700'}`}>
                  AEO Analysis
                </button>
              )}
              {result.geo && (
                <button onClick={() => setActiveTab('geo')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'geo' ? 'bg-white shadow text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  GEO Analysis
                </button>
              )}
            </div>

            {/* Report Content */}
            <div className="w-full">
              {activeTab === 'seo' && result.seo && <SeoAuditReport data={result.seo} />}
              {activeTab === 'aeo' && result.aeo && <AeoReport data={result.aeo} />}
              {activeTab === 'geo' && result.geo && <GeoReport data={result.geo} />}
            </div>

          </div>
        )}
      </main>
      
      {status === 'idle' && (
        <footer className="w-full text-center py-6 text-slate-400 text-xs border-t border-slate-200 bg-white z-10">
          © {new Date().getFullYear()} EXPRESS Pipeline. Zero-friction analysis.
        </footer>
      )}
    </div>
  );
}
