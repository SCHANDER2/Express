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
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out transform"
    >
      {/* LEFT COLUMN: Deep Market & Customer Profile Report */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-600"></div>
        
        <header className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Deep Market & Customer Profile</h2>
            <p className="text-xs text-gray-400">Search intent classification & semantic content gaps</p>
          </div>
        </header>

        {/* Personas */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase flex items-center gap-2">
            <Compass className="w-4 h-4" /> Target Audience Personas
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {marketProfile.personas.map((persona, idx) => (
              <div 
                key={idx} 
                className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/80 hover:border-indigo-500/30 transition-all duration-300 group/card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-gray-200 text-sm group-hover/card:text-indigo-400 transition-colors">
                    {persona.role}
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {persona.intent}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
                  <div>
                    <h5 className="font-semibold text-rose-400/90 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Search Pain Points
                    </h5>
                    <ul className="space-y-1 list-disc pl-4 text-gray-400">
                      {persona.painPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-emerald-400/95 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Engagement Triggers
                    </h5>
                    <ul className="space-y-1 list-disc pl-4 text-gray-400">
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
          <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Intent Distribution
          </h3>
          <div className="bg-gray-900/40 rounded-xl p-5 border border-gray-800/50">
            <div className="flex flex-wrap gap-4 mb-4">
              {marketProfile.intents.map((intent, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ 
                      backgroundColor: 
                        idx === 0 ? "#6366f1" : 
                        idx === 1 ? "#8b5cf6" : 
                        idx === 2 ? "#10b981" : "#6b7280" 
                    }}
                  ></span>
                  <span className="text-gray-400 font-medium">{intent.type}</span>
                  <span className="text-gray-200 font-bold">{intent.percentage}%</span>
                </div>
              ))}
            </div>
            {/* Visual Bar chart stack */}
            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden flex">
              {marketProfile.intents.map((intent, idx) => (
                <div 
                  key={idx}
                  style={{ width: `${intent.percentage}%` }}
                  className={`h-full transition-all duration-1000 ${
                    idx === 0 ? "bg-indigo-500" : 
                    idx === 1 ? "bg-violet-500" : 
                    idx === 2 ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                  title={`${intent.type}: ${intent.percentage}%`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Gaps */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" /> AI Content Gap Analysis
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-800/80">
            <table className="min-w-full divide-y divide-gray-800 bg-gray-900/20 text-left text-xs">
              <thead className="bg-gray-900/60 text-gray-300 font-semibold">
                <tr>
                  <th className="px-4 py-3">Topic Path / Content Gap</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Parser Status</th>
                  <th className="px-4 py-3">Optimization Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-gray-400">
                {marketProfile.contentGaps.map((gap, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-200">{gap.topic}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold ${
                        gap.priority === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                        gap.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}>
                        {gap.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-gray-300">{gap.status}</td>
                    <td className="px-4 py-3.5 text-gray-300 leading-relaxed">{gap.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Technical Core Insights & Service Mapping */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>

        <header className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Technical Insights & Entity Map</h2>
            <p className="text-xs text-gray-400">Search parser diagnostics & vector engine accessibility</p>
          </div>
        </header>

        {/* circular scores */}
        <div className="grid grid-cols-2 gap-4">
          {/* AEO Score */}
          <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/80 flex flex-col items-center justify-center gap-3 text-center">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AEO Score (Answer Optimization)</h4>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-800"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${technicalInsights.aeoScore}, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-white">{technicalInsights.aeoScore}%</span>
                <span className="text-3xs text-indigo-400 font-medium">Moderate</span>
              </div>
            </div>
            <p className="text-3xs text-gray-400 leading-tight">
              Calculates how effectively AI search systems parse your data for Q&A direct snippets.
            </p>
          </div>

          {/* GEO Score */}
          <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/80 flex flex-col items-center justify-center gap-3 text-center">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">GEO Score (Generative Search)</h4>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-800"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${technicalInsights.geoScore}, 100`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-white">{technicalInsights.geoScore}%</span>
                <span className="text-3xs text-emerald-400 font-medium">Fair</span>
              </div>
            </div>
            <p className="text-3xs text-gray-400 leading-tight">
              Measures compliance with modern Retrieval-Augmented Generation (RAG) queries.
            </p>
          </div>
        </div>

        {/* Entity Extraction */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-wider text-emerald-300 uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Extracted NLP Entities
          </h3>
          <div className="bg-gray-900/40 rounded-xl p-5 border border-gray-800/50">
            <p className="text-2xs text-gray-400 mb-3.5 leading-relaxed">
              These are the core semantic entities resolved from the website content. AI engines use these mappings to classify what your business serves.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {technicalInsights.entities.map((entity, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-emerald-500/30 transition-all duration-200 text-xs"
                >
                  <span className="font-semibold text-gray-200">{entity.name}</span>
                  <span className="text-3xs text-gray-500 uppercase tracking-widest bg-gray-800 px-1.5 py-0.5 rounded">
                    {entity.type}
                  </span>
                  <span className="text-3xs text-emerald-400 font-mono font-bold" title="Relevance Score">
                    {entity.relevance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Diagnostics */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-wider text-emerald-300 uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Diagnostics & Recommendations
          </h3>
          <div className="space-y-4">
            {technicalInsights.insights.map((insight, idx) => (
              <div 
                key={idx}
                className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/80 flex flex-col gap-2 hover:border-gray-700/80 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {insight.status === "optimal" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {insight.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {insight.status === "critical" && <XCircle className="w-4 h-4 text-rose-500" />}
                    <span className="font-semibold text-gray-200 text-xs sm:text-sm">{insight.metric}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider ${
                    insight.status === "optimal" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    insight.status === "warning" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {insight.value}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pl-6">
                  {insight.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
