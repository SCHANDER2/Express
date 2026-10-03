'use client';

import React from 'react';
import { GeoAnalysisData } from '@/types';
import ScoreGauge from './ScoreGauge';
import PayloadZone from './PayloadZone';
import OffSiteStrategyZone from './OffSiteStrategyZone';
import { Database, Search, ShieldCheck, FileText, CheckCircle2, XCircle, BarChart3, Sparkles, AlertCircle } from 'lucide-react';

interface GeoReportProps {
  data: GeoAnalysisData;
}

export default function GeoReport({ data }: GeoReportProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-6 tab-fade-in">
      
      {/* Top Section */}
      <div className="light-panel rounded-2xl p-8 flex flex-col md:flex-row items-center gap-12">
        <ScoreGauge score={data.score} label={data.scoreLabel} size="lg" />
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 items-center text-center">
            <ShieldCheck className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Citation Worthiness</span>
            <span className="text-2xl font-black text-text-primary">{data.citationWorthiness}%</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 items-center text-center">
            <FileText className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Semantic Density</span>
            <span className="text-2xl font-black text-text-primary">{data.semanticDensity}%</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 items-center text-center">
            <Search className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">LLM Retrievability</span>
            <span className="text-2xl font-black text-text-primary">{data.llmRetrievability}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RAG Compatibility */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <Database className="w-4 h-4 text-brand-primary" /> RAG Compatibility
          </h3>
          <div className="flex flex-col gap-4">
            {(data.ragCompatibility || []).map((metric, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-text-primary">{metric.metric}</span>
                  <span className="font-black text-text-primary">{metric.score}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${metric.score >= 80 ? 'bg-green-500' : metric.score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-secondary">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Authority Signals */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-brand-primary" /> Authority Signals
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {(data.authoritySignals || []).map((signal, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                {signal.present ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-sm text-text-primary">{signal.signal}</div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  signal.impact === 'High' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-200 text-slate-600'
                }`}>
                  {signal.impact} Impact
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Factual Claims Audit */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-brand-primary" /> Factual Claims Audit
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-text-secondary uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 font-bold">Claim Detected</th>
                  <th className="py-3 px-4 font-bold">Verifiable</th>
                  <th className="py-3 px-4 font-bold">Suggested Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-text-primary">
                {(data.factualClaims || []).map((claim, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-medium">{claim.claim}</td>
                    <td className="py-3 px-4">
                      {claim.verifiable ? (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold uppercase">Yes</span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs">{claim.source || 'Needs citation'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Topic Coverage */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <Search className="w-4 h-4 text-brand-primary" /> Topic Coverage Depth
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data.topicCoverage || []).map((topic, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                <div className="font-bold text-text-primary text-sm">{topic.topic}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-secondary font-bold uppercase">Depth:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    topic.depth === 'comprehensive' ? 'bg-green-100 text-green-700' :
                    topic.depth === 'moderate' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {topic.depth}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mt-2 bg-white p-2 rounded border border-slate-100">
                  {topic.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Competitors (Reusing pattern) */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2">
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
            <div className="bg-blue-50/50 rounded-xl p-5 border-2 border-brand-primary/30 shadow-sm flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-brand-primary text-white">
                Your Site
              </div>
              <div className="flex flex-col h-full justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-text-primary text-base truncate mb-1">
                    {(() => {
                      try { return new URL(data.url).hostname || data.url; } catch { return data.url; }
                    })()}
                  </h4>
                  <p className="text-[10px] font-mono text-brand-primary font-bold uppercase tracking-wider mb-4">Baseline Subject</p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-text-secondary font-medium">AI Share of Voice</span>
                        <span className="font-extrabold text-brand-primary">
                          {data.score}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary rounded-full transition-all"
                          style={{ width: `${data.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitor Cards */}
            {(data.competitors || []).map((competitor, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-brand-accent/30 transition-all duration-300 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="font-extrabold text-text-primary text-base truncate">{competitor.name}</h4>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-text-secondary uppercase tracking-widest border border-slate-200">
                      Competitor
                    </span>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-text-secondary font-medium">AI Share of Voice</span>
                        <span className="font-extrabold text-brand-accent">{competitor.shareOfVoice}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-accent rounded-full transition-all"
                          style={{ width: `${competitor.shareOfVoice}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-state-error uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Semantic deficits
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {(competitor.semanticGaps || []).map((gap, gIdx) => (
                          <span key={gIdx} className="inline-flex px-2 py-0.5 rounded bg-state-error/5 text-state-error text-[10px] font-bold border border-state-error/10">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> Why the AI Prefers Them
                  </h5>
                  <p className="text-xs text-text-secondary leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    &ldquo;{competitor.whyAiPrefers}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Embed Payload & Offsite */}
      <div className="-mx-6">
        <PayloadZone payloads={data.payloads} />
      </div>
      <div className="mt-8 -mx-6">
        <OffSiteStrategyZone offSiteStrategy={data.offSiteStrategy} />
      </div>

    </div>
  );
}
