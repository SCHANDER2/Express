import React from "react";
import { MockAnalysisData } from "../data/mockData";
import { 
  Users, 
  Compass, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  AlertCircle,
  TrendingDown
} from "lucide-react";

interface ReportZoneProps {
  data: MockAnalysisData;
}

export default function ReportZone({ data }: ReportZoneProps) {
  const { marketProfile, technicalInsights } = data;

  return (
    <section 
      id="report-zone" 
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto px-6 transition-all duration-700 ease-out transform"
    >
      {/* LEFT COLUMN: Deep Market & Customer Profile Report */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
        {/* Glowing indigo border strip */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-indigo-650 to-violet-600"></div>
        
        <header className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-white">Deep Market & Customer Profile</h2>
            <p className="text-xs text-text-secondary">Search intent classification & semantic content gaps</p>
          </div>
        </header>

        {/* Personas */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-2">
            <Compass className="w-4 h-4" /> Target Audience Personas
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {marketProfile.personas.map((persona, idx) => (
              <div 
                key={idx} 
                className="bg-zinc-950/40 rounded-xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 group/card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="font-bold text-white text-sm group-hover/card:text-indigo-400 transition-colors">
                    {persona.role}
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                    {persona.intent}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
                  <div>
                    <h5 className="font-bold text-rose-400 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-state-error" /> 
                      <span>Search Pain Points</span>
                    </h5>
                    <ul className="space-y-1 list-disc pl-4 text-text-secondary">
                      {persona.painPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-450 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent" />
                      <span>Engagement Triggers</span>
                    </h5>
                    <ul className="space-y-1 list-disc pl-4 text-text-secondary">
                      {persona.engagementTriggers.map((tg, tIdx) => (
                        <li key={tIdx}>{tg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intent Distribution */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Intent Distribution
          </h3>
          <div className="bg-zinc-950/20 rounded-xl p-5 border border-white/5">
            <div className="flex flex-wrap gap-4 mb-4">
              {marketProfile.intents.map((intent, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ 
                      backgroundColor: 
                        idx === 0 ? "#6366f1" : 
                        idx === 1 ? "#8b5cf6" : 
                        idx === 2 ? "#10b981" : "#71717a" 
                    }}
                  ></span>
                  <span className="text-text-secondary font-medium">{intent.type}</span>
                  <span className="text-white font-bold">{intent.percentage}%</span>
                </div>
              ))}
            </div>
            {/* Visual Bar chart stack */}
            <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden flex border border-white/5">
              {marketProfile.intents.map((intent, idx) => (
                <div 
                  key={idx}
                  style={{ width: `${intent.percentage}%` }}
                  className={`h-full transition-all duration-1000 ${
                    idx === 0 ? "bg-indigo-500" : 
                    idx === 1 ? "bg-violet-500" : 
                    idx === 2 ? "bg-emerald-500" : "bg-zinc-650"
                  }`}
                  title={`${intent.type}: ${intent.percentage}%`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Gaps */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" /> AI Content Gap Analysis
          </h3>
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-zinc-950/20">
            <table className="min-w-full divide-y divide-white/5 text-left text-xs">
              <thead className="bg-white/5 text-white font-bold">
                <tr>
                  <th className="px-4 py-3">Topic Path / Content Gap</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Parser Status</th>
                  <th className="px-4 py-3">Optimization Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-text-secondary">
                {marketProfile.contentGaps.map((gap, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-white">{gap.topic}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider ${
                        gap.priority === "High" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                        gap.priority === "Medium" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
                        "bg-white/10 text-text-secondary border border-white/10"
                      }`}>
                        {gap.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-white font-semibold">{gap.status}</td>
                    <td className="px-4 py-3.5 text-text-secondary leading-relaxed">{gap.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Technical Core Insights & Service Mapping */}
      <div className="glass-panel glass-panel-hover-emerald rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
        {/* Glowing emerald border strip */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-500"></div>

        <header className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-brand-accent rounded-xl border border-brand-accent/20 group-hover:border-brand-accent/50 transition-colors">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-white">Technical Insights & Entity Map</h2>
            <p className="text-xs text-text-secondary">Search parser diagnostics & vector engine accessibility</p>
          </div>
        </header>

        {/* circular scores */}
        <div className="grid grid-cols-2 gap-4">
          {/* AEO Score */}
          <div className="bg-zinc-950/40 rounded-xl p-5 border border-white/5 flex flex-col items-center justify-center gap-3 text-center">
            <h4 className="text-2xs font-bold text-text-secondary uppercase tracking-wider">AEO Score</h4>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-zinc-900"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${technicalInsights.aeoScore}, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-white">{technicalInsights.aeoScore}%</span>
                <span className="text-3xs text-indigo-400 font-bold uppercase tracking-widest">Moderate</span>
              </div>
            </div>
            <p className="text-3xs text-text-secondary leading-tight">
              AI crawl structure context readiness check.
            </p>
          </div>

          {/* GEO Score */}
          <div className="bg-zinc-950/40 rounded-xl p-5 border border-white/5 flex flex-col items-center justify-center gap-3 text-center">
            <h4 className="text-2xs font-bold text-text-secondary uppercase tracking-wider">GEO Score</h4>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-zinc-900"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${technicalInsights.geoScore}, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-white">{technicalInsights.geoScore}%</span>
                <span className="text-3xs text-emerald-450 font-bold uppercase tracking-widest">Fair</span>
              </div>
            </div>
            <p className="text-3xs text-text-secondary leading-tight">
              Generative RAG matching score compatibility.
            </p>
          </div>
        </div>

        {/* Entity Extraction */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-accent uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Extracted NLP Entities
          </h3>
          <div className="bg-zinc-950/30 rounded-xl p-5 border border-white/5">
            <p className="text-3xs text-text-secondary mb-4 leading-relaxed">
              Core entities resolved from your website copy. Conversational AI search engines use these nodes to establish business classification.
            </p>
            <div className="flex flex-wrap gap-2">
              {technicalInsights.entities.map((entity, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/50 border border-white/5 hover:border-brand-accent/30 transition-all duration-205 text-xs"
                >
                  <span className="font-semibold text-white">{entity.name}</span>
                  <span className="text-3xs text-text-secondary font-mono uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
                    {entity.type}
                  </span>
                  <span className="text-3xs text-brand-accent font-mono font-bold" title="Relevance Weight">
                    {entity.relevance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Diagnostics */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-accent uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Diagnostics & Recommendations
          </h3>
          <div className="space-y-3">
            {technicalInsights.insights.map((insight, idx) => {
              const isSuccess = insight.status === "optimal";
              const isWarning = insight.status === "warning";
              const isError = insight.status === "critical";

              return (
                <div 
                  key={idx}
                  className="bg-zinc-950/40 rounded-xl p-4 border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-label="Optimal" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" aria-label="Warning" />}
                      {isError && <XCircle className="w-4 h-4 text-state-error" aria-label="Critical Alert" />}
                      <span className="font-bold text-white text-xs sm:text-sm">{insight.metric}</span>
                    </div>
                    
                    {/* Accessible semantic status label */}
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
                      isSuccess ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      isWarning ? "bg-state-warning/10 text-amber-405 border border-state-warning/25" :
                      "bg-state-error/10 text-rose-400 border border-state-error/25"
                    }`}>
                      <span>{insight.value}</span>
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed pl-6">
                    {insight.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
