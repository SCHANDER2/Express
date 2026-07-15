import React from "react";
import { AnalysisData } from "@/types";
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
  BarChart3,
  Sparkles
} from "lucide-react";

interface ReportZoneProps {
  data: AnalysisData;
  activeTab: "market" | "technical";
}

export default function ReportZone({ data, activeTab }: ReportZoneProps) {
  const { marketProfile, technicalInsights } = data;

  if (activeTab === "market") {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 tab-fade-in flex flex-col gap-8">
        {/* Market Profile Panel - Full Width */}
        <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-primary to-cyan-500"></div>
          
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
                    className="bg-slate-55/60 rounded-xl p-5 border border-slate-200/60 hover:border-brand-primary/25 transition-all duration-300 group/card"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h4 className="font-bold text-text-primary text-sm group-hover/card:text-brand-primary transition-colors">
                        {persona.role}
                      </h4>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
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
              <div className="bg-slate-55/60 rounded-xl p-6 border border-slate-200/60 h-full flex flex-col justify-center">
                <div className="space-y-4 mb-6">
                  {marketProfile.intents.map((intent, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-200/40 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
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
                      </div>
                      <span className="text-text-primary font-extrabold">{intent.percentage}%</span>
                    </div>
                  ))}
                </div>
                {/* Visual Bar chart stack */}
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
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
          </div>

          {/* Content Gaps Section */}
          <div className="flex flex-col gap-4 mt-6">
            <h3 className="text-xs font-bold tracking-wider text-brand-primary uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" /> AI Content Gap Analysis
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/65 bg-white">
              <table className="min-w-full divide-y divide-slate-250 text-left text-xs">
                <thead className="bg-slate-55 text-text-primary font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4">Topic Path / Content Gap</th>
                    <th className="px-4 py-4">Priority</th>
                    <th className="px-4 py-4">Parser Status</th>
                    <th className="px-5 py-4">Optimization Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-text-secondary">
                  {marketProfile.contentGaps.map((gap, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-bold text-text-primary">{gap.topic}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
                          gap.priority === "High" ? "bg-state-error/10 text-state-error border border-state-error/20" :
                          gap.priority === "Medium" ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20" :
                          "bg-slate-100 text-text-secondary border border-slate-200"
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

        {/* Competitor Compare & AI Share of Voice Matrix */}
        <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-accent to-orange-500"></div>
          
          <header className="flex items-center gap-3">
            <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">Competitor Share of Voice & Semantic Gaps</h2>
              <p className="text-xs text-text-secondary">AI citation visibility and critical semantic deficits compared with key market players</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* User Domain Card */}
            <div className="bg-gradient-to-br from-brand-primary/5 to-cyan-500/5 rounded-xl p-5 border-2 border-brand-primary/30 shadow-sm flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-4xs font-extrabold uppercase tracking-widest bg-brand-primary text-white">
                Your Site
              </div>
              <div className="flex flex-col h-full justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-text-primary text-base truncate mb-1">
                    {(() => {
                      try {
                        return new URL(data.url).hostname || data.url;
                      } catch {
                        return data.url;
                      }
                    })()}
                  </h4>
                  <p className="text-4xs font-mono text-brand-primary font-bold uppercase tracking-wider mb-4">Baseline Subject</p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-text-secondary font-medium">AI Share of Voice</span>
                        <span className="font-extrabold text-brand-primary">
                          {Math.round((technicalInsights.aeoScore + technicalInsights.geoScore) / 2)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary rounded-full transition-all duration-1000"
                          style={{ width: `${Math.round((technicalInsights.aeoScore + technicalInsights.geoScore) / 2)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-3xs font-bold text-text-secondary uppercase tracking-wider mb-2">Authority Overview</h5>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Primary crawl structure checks are active. Your site currently forms the baseline visibility level for our AEO evaluation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitor Cards */}
            {data.competitors && data.competitors.map((competitor, idx) => (
              <div 
                key={idx}
                className="bg-slate-55/60 rounded-xl p-5 border border-slate-200/60 hover:border-brand-accent/25 transition-all duration-300 flex flex-col justify-between gap-4 group/comp"
              >
                <div>
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="font-extrabold text-text-primary text-base truncate group-hover/comp:text-brand-accent transition-colors">
                      {competitor.name}
                    </h4>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-4xs font-extrabold bg-slate-100 text-text-secondary uppercase tracking-widest border border-slate-200">
                      Competitor
                    </span>
                  </div>
                  <p className="text-4xs font-mono text-text-secondary uppercase tracking-wider mb-4">Inferred Market Rival</p>

                  <div className="space-y-4">
                    {/* Share of voice */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-text-secondary font-medium">AI Share of Voice</span>
                        <span className="font-extrabold text-brand-accent">{competitor.shareOfVoice}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-accent rounded-full transition-all duration-1000"
                          style={{ width: `${competitor.shareOfVoice}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Semantic Gaps */}
                    <div>
                      <h5 className="text-3xs font-bold text-state-error uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Semantic deficits
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {competitor.semanticGaps.map((gap, gIdx) => (
                          <span 
                            key={gIdx}
                            className="inline-flex px-2 py-0.5 rounded bg-state-error/5 text-state-error text-3xs font-bold border border-state-error/10 hover:bg-state-error/10 transition-colors"
                          >
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why AI Prefers Them */}
                <div className="pt-4 border-t border-slate-200/50">
                  <h5 className="text-3xs font-bold text-text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> Why the AI Prefers Them
                  </h5>
                  <p className="text-xs text-text-secondary leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/30">
                    "{competitor.whyAiPrefers}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Technical Audit Tab
  return (
    <div className="w-full max-w-7xl mx-auto px-6 tab-fade-in flex flex-col gap-8">
      <div className="light-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-accent to-amber-500"></div>

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
            <div className="bg-slate-55/60 rounded-xl p-5 border border-slate-200/60 flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <h4 className="text-3xs font-bold text-text-secondary uppercase tracking-wider">AEO Score</h4>
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
                  <span className="text-4xs text-brand-primary font-bold uppercase tracking-widest">Moderate</span>
                </div>
              </div>
              <p className="text-4xs text-text-secondary leading-tight max-w-[120px]">
                AI crawl structure context readiness check.
              </p>
            </div>

            {/* GEO Score */}
            <div className="bg-slate-55/60 rounded-xl p-5 border border-slate-200/60 flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <h4 className="text-3xs font-bold text-text-secondary uppercase tracking-wider">GEO Score</h4>
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
            <div className="bg-slate-55/60 rounded-xl p-5 border border-slate-200/60 h-full flex flex-col justify-center">
              <p className="text-3xs text-text-secondary mb-4 leading-relaxed">
                Core entities resolved from your website copy. Conversational AI search engines use these nodes to establish business classification.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {technicalInsights.entities.map((entity, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/85 hover:border-brand-primary/30 transition-all duration-200 text-xs"
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
                  className="bg-slate-55/60 rounded-xl p-4 border border-slate-200/60 flex flex-col gap-2 hover:border-slate-250 transition-all duration-300"
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
