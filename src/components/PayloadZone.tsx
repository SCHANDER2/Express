import React, { useState } from "react";
import { MockAnalysisData } from "../data/mockData";
import { Terminal, Copy, Check, FileCode, FileText, Globe } from "lucide-react";

interface PayloadZoneProps {
  data: MockAnalysisData;
}

type TabType = "jsonLd" | "faqMarkdown" | "geoCopy";

export default function PayloadZone({ data }: PayloadZoneProps) {
  const { payloads } = data;
  const [activeTab, setActiveTab] = useState<TabType>("jsonLd");
  const [copied, setCopied] = useState(false);

  const activeContent = 
    activeTab === "jsonLd" ? payloads.jsonLd :
    activeTab === "faqMarkdown" ? payloads.faqMarkdown :
    payloads.geoCopy;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section 
      id="payload-zone" 
      className="w-full max-w-7xl mx-auto px-6 tab-fade-in transition-all duration-700 ease-out transform"
    >
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800/80 relative">
        {/* Terminal Header */}
        <div className="bg-slate-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-slate-850 gap-4">
          <div className="flex items-center gap-3">
            {/* macOS Style Window controls */}
            <div className="flex gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-state-error/70 block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-state-warning/70 block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-state-success/70 block"></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-brand-primary" />
              <span>payload-generation-pipeline</span>
              <span className="text-slate-800">|</span>
              <span className="text-brand-primary font-bold uppercase tracking-wider">{activeTab}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab("jsonLd"); setCopied(false); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                activeTab === "jsonLd"
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON-LD Schema</span>
              <span className="inline sm:hidden">JSON-LD</span>
            </button>
            <button
              onClick={() => { setActiveTab("faqMarkdown"); setCopied(false); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                activeTab === "faqMarkdown"
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>AEO FAQ</span>
            </button>
            <button
              onClick={() => { setActiveTab("geoCopy"); setCopied(false); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                activeTab === "geoCopy"
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>GEO Copy</span>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="relative bg-slate-950 p-6 sm:p-8 font-mono text-xs sm:text-sm text-slate-100 leading-relaxed overflow-x-auto min-h-[300px]">
          {/* Copy Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCopy}
              aria-label="Copy code payload"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border shadow-md active:scale-98 cursor-pointer ${
                copied
                  ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/30"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>
          </div>

          {/* Payload display */}
          <pre className="whitespace-pre overflow-x-auto pr-24 select-all outline-none font-mono">
            <code>
              {activeContent}
            </code>
          </pre>
        </div>

        {/* Payload Usage Instructions */}
        <div className="bg-slate-900/40 border-t border-slate-850 px-6 py-4 text-2xs text-slate-400 flex items-center justify-between">
          <span className="font-semibold text-slate-400">
            {activeTab === "jsonLd" && "ℹ️ Paste this JSON-LD script inside the <head> tag of your target website code."}
            {activeTab === "faqMarkdown" && "ℹ️ Add these FAQs in a clear visible content section of your site, optimized for semantic vector searching."}
            {activeTab === "geoCopy" && "ℹ️ Paste this section in your website footer or about page to trigger credibility matches on LLMs."}
          </span>
          <span className="font-mono text-brand-primary font-bold uppercase tracking-wider">DEPLOYMENT_READY</span>
        </div>
      </div>
    </section>
  );
}
