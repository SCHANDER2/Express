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
  activeTab: "market" | "technical";
}

export default function ReportZone({ data, activeTab }: ReportZoneProps) {
  const { marketProfile, technicalInsights } = data;

  if (activeTab === "market") {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 tab-fade-in flex flex-col gap-8">
        {/* Market Profile Panel - Full Width */}
        <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-primary to-brand-accent"></div>
          
          <header className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">Deep Market & Customer Profile</h2>
              <p className="text-xs text-text-secondary">Search intent classification & semantic content gaps</p>
            </div>
          </header>

          {/* Grid for Personas and Intent Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            {/* Column 1 & 2: Personas */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
                <Compass className="w-4 h-4" /> Target Audience Personas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketProfile.personas.map((persona, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#121212] rounded-xl p-5 border border-[#1F1F1F] hover:border-brand-primary/25 transition-all duration-300 group/card"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h4 className="font-bold text-text-primary text-sm group-hover/card:text-brand-primary transition-colors">
                        {persona.role}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                        {persona.intent}
                      </span>
                    </div>
                    <div className="space-y-3 text-xs mt-2">
                      <div>
                        <h5 className="font-bold text-state-error mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-state-error" /> 
                          <span>Search Pain Points</span>
                        </h5>
                        <ul className="space-y-1 list-disc pl-4 text-text-secondary leading-relaxed">
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
                        <ul className="space-y-1 list-disc pl-4 text-text-secondary leading-relaxed">
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

            {/* Column 3: Intent Distribution */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Intent Distribution
              </h3>
              <div className="bg-[#121212] rounded-xl p-6 border border-[#1F1F1F] h-full flex flex-col justify-center">
                <div className="space-y-4 mb-6">
                  {marketProfile.intents.map((intent, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-[#1F1F1F] pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ 
                            backgroundColor: 
                              idx === 0 ? "var(--color-brand-primary)" : 
                              idx === 1 ? "var(--color-brand-accent)" : 
                              idx === 2 ? "var(--color-state-success)" : "#334155" 
                          }}
                        ></span>
                        <span className="text-text-secondary font-medium">{intent.type}</span>
                      </div>
                      <span className="text-text-primary font-extrabold">{intent.percentage}%</span>
                    </div>
                  ))}
                </div>
                {/* Visual Bar chart stack */}
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  {marketProfile.intents.map((intent, idx) => (
                    <div 
                      key={idx}
                      style={{ width: `${intent.percentage}%` }}
                      className={`h-full transition-all duration-1000 ${
                        idx === 0 ? "bg-brand-primary" : 
                        idx === 1 ? "bg-brand-accent" : 
                        idx === 2 ? "bg-state-success" : "bg-slate-700"
                      }`}
                      title={`${intent.type}: ${intent.percentage}%`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Gaps Section */}
          <div className="flex flex-col gap-4 mt-6">
            <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" /> AI Content Gap Analysis
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#1F1F1F] bg-[#0A0A0A]">
              <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
                <thead className="bg-[#121212] text-text-primary font-bold border-b border-[#1F1F1F]">
                  <tr>
                    <th className="px-5 py-4 text-white">Topic Path / Content Gap</th>
                    <th className="px-4 py-4 text-white">Priority</th>
                    <th className="px-4 py-4 text-white">Parser Status</th>
                    <th className="px-5 py-4 text-white">Optimization Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#121212] text-text-secondary">
                  {marketProfile.contentGaps.map((gap, idx) => (
                    <tr key={idx} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4 font-bold text-text-primary">{gap.topic}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
                          gap.priority === "High" ? "bg-state-error/10 text-state-error border border-state-error/20" :
                          gap.priority === "Medium" ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20" :
                          "bg-slate-800 text-text-secondary border border-slate-700"
                        }`}>
                          {gap.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-text-primary font-semibold">{gap.status}</td>
                      <td className="px-5 py-4 text-text-secondary leading-relaxed">{gap.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Technical Audit Tab
  return (
    <div className="w-full max-w-7xl mx-auto px-6 tab-fade-in flex flex-col gap-8">
      <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-accent to-brand-primary"></div>

        <header className="flex items-center gap-3">
          <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-primary">Technical Insights & Entity Map</h2>
            <p className="text-xs text-text-secondary">Search parser diagnostics & vector engine accessibility</p>
          </div>
        </header>

        {/* Scores & Entities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          
          {/* Circular dial indicators */}
          <div className="flex flex-col sm:flex-row gap-4 lg:col-span-1">
            {/* AEO Score */}
            <div className="bg-[#121212] rounded-xl p-5 border border-[#1F1F1F] flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <h4 className="text-3xs font-bold text-text-secondary uppercase tracking-wider">AEO Score</h4>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="text-slate-800"
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
                  <span className="text-4xs text-brand-primary font-bold uppercase tracking-widest">Moderate</span>
                </div>
              </div>
              <p className="text-4xs text-text-secondary leading-tight max-w-[120px]">
                AI crawl structure context readiness check.
              </p>
            </div>

            {/* GEO Score */}
            <div className="bg-[#121212] rounded-xl p-5 border border-[#1F1F1F] flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <h4 className="text-3xs font-bold text-text-secondary uppercase tracking-wider">GEO Score</h4>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="text-slate-800"
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
                  <span className="text-4xs text-brand-accent font-bold uppercase tracking-widest">Fair</span>
                </div>
              </div>
              <p className="text-4xs text-text-secondary leading-tight max-w-[120px]">
                Generative RAG matching score compatibility.
              </p>
            </div>
          </div>

          {/* Entities Grid Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-wider text-brand-accent uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Extracted NLP Entities
            </h3>
            <div className="bg-[#121212] rounded-xl p-5 border border-[#1F1F1F] h-full flex flex-col justify-center">
              <p className="text-3xs text-text-secondary mb-4 leading-relaxed">
                Core entities resolved from your website copy. Conversational AI search engines use these nodes to establish business classification.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {technicalInsights.entities.map((entity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D0D] border border-[#1F1F1F] hover:border-brand-primary/30 transition-all duration-205 text-xs"
                  >
                    <span className="font-bold text-text-primary">{entity.name}</span>
                    <span className="text-3xs text-text-secondary font-mono uppercase tracking-widest bg-slate-900 px-1.5 py-0.5 rounded">
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

        </div>

        {/* Technical Diagnostics */}
        <div className="flex flex-col gap-4 mt-4">
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
                  className="bg-[#121212] rounded-xl p-4 border border-[#1F1F1F] flex flex-col gap-2 hover:border-[#333333] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {isSuccess && <CheckCircle2 className="w-4 h-4 text-state-success" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-brand-accent" />}
                      {isError && <XCircle className="w-4 h-4 text-state-error" />}
                      <span className="font-bold text-text-primary text-xs sm:text-sm">{insight.metric}</span>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
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
    </div>
  );
}
