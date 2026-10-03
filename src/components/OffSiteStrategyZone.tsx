'use client';

import React, { useState } from "react";
import { AnalysisData, OffSiteHub } from "@/types";
import { Share2, Copy, Check, ExternalLink, CheckSquare, Square } from "lucide-react";

interface OffSiteStrategyZoneProps {
  data?: AnalysisData;
  offSiteStrategy?: OffSiteHub[];
}

export default function OffSiteStrategyZone({ data, offSiteStrategy: propOffSiteStrategy }: OffSiteStrategyZoneProps) {
  const offSiteStrategy = propOffSiteStrategy || data?.offSiteStrategy;
  const [completedHubs, setCompletedHubs] = useState<Record<number, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({});

  const toggleComplete = (idx: number) => {
    setCompletedHubs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [idx]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [idx]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!offSiteStrategy) return null;

  return (
    <section 
      id="offsite-strategy-zone" 
      className="w-full max-w-7xl mx-auto px-6 tab-fade-in flex flex-col gap-8"
    >
      <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-primary to-emerald-500"></div>

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">Off-Site Vector Strategy</h2>
              <p className="text-xs text-text-secondary">Execute strategic value posts on target digital hubs to train AI knowledge graphs and build citation authority</p>
            </div>
          </div>
          
          <div className="bg-slate-100 border border-slate-200/50 px-4 py-2 rounded-xl flex items-center gap-3 self-start sm:self-center select-none">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-brand-primary">
                {Object.values(completedHubs).filter(Boolean).length} / {offSiteStrategy.length}
              </span>
              <span className="text-[9px] text-text-secondary uppercase">Hubs Cited</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 mt-2">
          {offSiteStrategy.map((hub, idx) => {
            const isCompleted = !!completedHubs[idx];
            const isCopied = !!copiedStates[idx];

            return (
              <div 
                key={idx}
                className={`transition-all duration-300 rounded-xl border p-5 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden ${
                  isCompleted 
                    ? "bg-slate-50/70 border-emerald-500/20 opacity-75"
                    : "bg-white border-slate-200/85 hover:border-brand-primary/25 hover:shadow-md hover:shadow-slate-100/10"
                }`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${
                  isCompleted ? "bg-emerald-500" : "bg-slate-200 group-hover:bg-brand-primary/40"
                }`}></div>

                <div className="flex-1 flex gap-4 items-start pl-2">
                  <button 
                    onClick={() => toggleComplete(idx)}
                    className={`mt-1 flex-shrink-0 cursor-pointer text-text-secondary hover:text-brand-primary transition-colors focus:outline-none`}
                    title={isCompleted ? "Mark incomplete" : "Mark as posted"}
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 animate-pulse" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 hover:text-brand-primary" />
                    )}
                  </button>

                  <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-wide">
                        {hub.platform}
                      </span>
                      <span className="text-xs font-mono font-bold text-text-primary">
                        {hub.hubName}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
                          Published
                        </span>
                      )}
                    </div>

                    <div className="relative group/copy">
                      <p className={`text-xs sm:text-sm leading-relaxed p-4 rounded-xl font-sans border transition-all ${
                        isCompleted
                          ? "bg-slate-100/50 text-text-secondary/60 line-through border-slate-200"
                          : "bg-slate-50 text-text-primary border-slate-200/50"
                      }`}>
                        {hub.objectiveCopy}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col justify-end items-center md:items-end gap-3 flex-shrink-0 pl-11 md:pl-0 border-t md:border-t-0 md:border-l border-slate-200/50 pt-4 md:pt-0 md:pl-6 md:min-w-[160px]">
                  <button
                    onClick={() => handleCopy(hub.objectiveCopy, idx)}
                    className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer border ${
                      isCopied
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : "bg-white text-text-primary border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Post Text</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(hub.platform + " " + hub.hubName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-white text-text-secondary hover:text-text-primary hover:bg-slate-50 shadow-sm active:scale-98 cursor-pointer"
                  >
                    <span>Visit Platform</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 border border-slate-200/50 rounded-xl px-5 py-4 text-xs text-text-secondary flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-bold text-text-primary">Citation Playbook Tip</p>
            <p className="text-[10px] text-text-secondary leading-relaxed mt-0.5">
              AI engines search Reddit, Quora, and developer forums daily to extract real-world feedback and entity associations. Posting this helpful, objective copy in relevant threads builds organic citation links, training LLMs to associate your product with your targeted semantic niches.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
