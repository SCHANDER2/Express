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
  AlertCircle 
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
      <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative overflow-hidden group">
        {/* Cyan border strip */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-primary to-cyan-500"></div>
        
        <header className="flex items-center gap-3">
          <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20 group-hover:border-brand-primary/45 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-text-primary">Deep Market & Customer Profile</h2>
            <p className="text-xs text-text-secondary">Search intent classification & semantic content gaps</p>
          </div>
        </header>

        {/* Personas */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
            <Compass className="w-4 h-4" /> Target Audience Personas
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {marketProfile.personas.map((persona, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 hover:border-brand-primary/25 transition-all duration-300 group/card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="font-bold text-text-primary text-sm group-hover/card:text-brand-primary transition-colors">
                    {persona.role}
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                    {persona.intent}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
                  <div>
                    <h5 className="font-bold text-state-error mb-1 flex items-center gap-1">
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
                    <h5 className="font-bold text-state-success mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-state-success" />
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
          <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Intent Distribution
          </h3>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60">
            <div className="flex flex-wrap gap-4 mb-4">
              {marketProfile.intents.map((intent, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ 
                      backgroundColor: 
                        idx === 0 ? "var(--color-brand-primary)" : 
                        idx === 1 ? "var(--color-brand-accent)" : 
                        idx === 2 ? "var(--color-state-success)" : "#94a3b8" 
                    }}
                  ></span>
                  <span className="text-text-secondary font-medium">{intent.type}</span>
                  <span className="text-text-primary font-bold">{intent.percentage}%</span>
                </div>
              ))}
            </div>
            {/* Visual Bar chart stack */}
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
              {marketProfile.intents.map((intent, idx) => (
                <div 
                  key={idx}
                  style={{ width: `${intent.percentage}%` }}
                  className={`h-full transition-all duration-1000 ${
                    idx === 0 ? "bg-brand-primary" : 
                    idx === 1 ? "bg-brand-accent" : 
                    idx === 2 ? "bg-state-success" : "bg-slate-400"
                  }`}
                  title={`${intent.type}: ${intent.percentage}%`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Gaps */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" /> AI Content Gap Analysis
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200/65 bg-white shadow-inner">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-text-primary font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Topic Path / Content Gap</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Parser Status</th>
                  <th className="px-4 py-3">Optimization Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-text-secondary">
                {marketProfile.contentGaps.map((gap, idx) => (
                  <tr key={idx} className="hover:bg-slate-55/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-text-primary">{gap.topic}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-2xs font-bold uppercase tracking-wider ${
                        gap.priority === "High" ? "bg-state-error/10 text-state-error border border-state-error/20" :
                        gap.priority === "Medium" ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20" :
                        "bg-slate-100 text-text-secondary border border-slate-200"
                      }`}>
                        {gap.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-text-primary font-semibold">{gap.status}</td>
                    <td className="px-4 py-3.5 text-text-secondary leading-relaxed">{gap.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Technical Core Insights & Service Mapping */}
      <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative overflow-hidden group">
        {/* Orange border strip */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-accent to-amber-500"></div>

        <header className="flex items-center gap-3">
          <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20 group-hover:border-brand-accent/45 transition-colors">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-text-primary">Technical Insights & Entity Map</h2>
            <p className="text-xs text-text-secondary">Search parser diagnostics & vector engine accessibility</p>
          </div>
        </header>

        {/* circular scores */}
        <div className="grid grid-cols-2 gap-4">
          {/* AEO Score */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 flex flex-col items-center justify-center gap-3 text-center">
            <h4 className="text-2xs font-bold text-text-secondary uppercase tracking-wider">AEO Score</h4>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-slate-200"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="text-brand-primary transition-all duration-1000 ease-out"
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
                <span className="text-xl font-extrabold text-text-primary">{technicalInsights.aeoScore}%</span>
                <span className="text-3xs text-brand-primary font-bold uppercase tracking-widest">Moderate</span>
              </div>
            </div>
            <p className="text-3xs text-text-secondary leading-tight">
              AI crawl structure context readiness check.
            </p>
          </div>

          {/* GEO Score */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 flex flex-col items-center justify-center gap-3 text-center">
            <h4 className="text-2xs font-bold text-text-secondary uppercase tracking-wider">GEO Score</h4>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-slate-200"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="text-brand-accent transition-all duration-1000 ease-out"
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
                <span className="text-xl font-extrabold text-text-primary">{technicalInsights.geoScore}%</span>
                <span className="text-3xs text-brand-accent font-bold uppercase tracking-widest">Fair</span>
              </div>
            </div>
            <p className="text-3xs text-text-secondary leading-tight">
              Generative RAG matching score compatibility.
            </p>
          </div>
        </div>

        {/* Entity Extraction */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Extracted NLP Entities
          </h3>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60">
            <p className="text-3xs text-text-secondary mb-4 leading-relaxed">
              Core entities resolved from your website copy. Conversational AI search engines use these nodes to establish business classification.
            </p>
            <div className="flex flex-wrap gap-2">
              {technicalInsights.entities.map((entity, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 hover:border-brand-primary/30 transition-all duration-200 text-xs"
                >
                  <span className="font-bold text-text-primary">{entity.name}</span>
                  <span className="text-3xs text-text-secondary font-mono uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded">
                    {entity.type}
                  </span>
                  <span className="text-3xs text-brand-primary font-mono font-bold" title="Relevance Weight">
                    {entity.relevance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Diagnostics */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
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
                  className="bg-slate-55/30 rounded-xl p-4 border border-slate-200/60 flex flex-col gap-2 hover:border-slate-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {isSuccess && <CheckCircle2 className="w-4 h-4 text-state-success" aria-label="Optimal" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-brand-accent" aria-label="Warning" />}
                      {isError && <XCircle className="w-4 h-4 text-state-error" aria-label="Critical Alert" />}
                      <span className="font-bold text-text-primary text-xs sm:text-sm">{insight.metric}</span>
                    </div>
                    
                    {/* Accessible semantic status label */}
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
                      isSuccess ? "bg-state-success/10 text-state-success border border-state-success/20" :
                      isWarning ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20" :
                      "bg-state-error/10 text-state-error border border-state-error/20"
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
