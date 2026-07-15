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
      className="w-full max-w-7xl mx-auto px-6 mt-12 transition-all duration-700 ease-out transform"
    >
      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative">
        {/* Terminal Header */}
        <div className="bg-zinc-950/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-white/5 gap-4">
          <div className="flex items-center gap-3">
            {/* macOS Style Window controls */}
            <div className="flex gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-state-error/70 block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-state-warning/70 block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-state-success/70 block"></span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>payload-generation-pipeline</span>
              <span className="text-white/10">|</span>
              <span className="text-brand-accent font-bold uppercase tracking-wider">{activeTab}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => { setActiveTab("jsonLd"); setCopied(false); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                activeTab === "jsonLd"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-text-secondary hover:text-white"
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
                  ? "bg-indigo-650 text-white shadow-lg shadow-indigo-500/20"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>AEO FAQ</span>
            </button>
            <button
              onClick={() => { setActiveTab("geoCopy"); setCopied(false); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer ${
                activeTab === "geoCopy"
                  ? "bg-indigo-650 text-white shadow-lg shadow-indigo-500/20"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>GEO Copy</span>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="relative bg-zinc-950/70 p-6 sm:p-8 font-mono text-xs sm:text-sm text-white leading-relaxed overflow-x-auto min-h-[300px]">
          {/* Copy Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleCopy}
              aria-label="Copy code payload"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border shadow-md active:scale-98 cursor-pointer ${
                copied
                  ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/30"
                  : "bg-zinc-900 text-text-secondary border-white/5 hover:bg-zinc-800 hover:text-white hover:border-indigo-500/30"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-brand-accent" />
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
        <div className="bg-zinc-950/40 border-t border-white/5 px-6 py-4 text-2xs text-text-secondary flex items-center justify-between">
          <span className="font-semibold text-text-secondary">
            {activeTab === "jsonLd" && "ℹ️ Paste this JSON-LD script inside the <head> tag of your target website code."}
            {activeTab === "faqMarkdown" && "ℹ️ Add these FAQs in a clear visible content section of your site, optimized for semantic vector searching."}
            {activeTab === "geoCopy" && "ℹ️ Paste this section in your website footer or about page to trigger credibility matches on LLMs."}
          </span>
          <span className="font-mono text-brand-accent font-bold uppercase tracking-wider">DEPLOYMENT_READY</span>
        </div>
      </div>
    </section>
  );
}
