'use client';

import React from 'react';
import { AeoAnalysisData } from '@/types';
import ScoreGauge from './ScoreGauge';
import { MessageSquare, Mic, List, HelpCircle, Users, Target, FileText, Cpu, CheckCircle2, XCircle } from 'lucide-react';

interface AeoReportProps {
  data: AeoAnalysisData;
}

export default function AeoReport({ data }: AeoReportProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-6 tab-fade-in">
      
      {/* Top Section */}
      <div className="light-panel rounded-2xl p-8 flex flex-col md:flex-row items-center gap-12">
        <ScoreGauge score={data.score} label={data.scoreLabel} size="lg" />
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 items-center text-center">
            <Mic className="w-5 h-5 text-brand-accent" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Voice Readiness</span>
            <span className="text-2xl font-black text-text-primary">{data.voiceSearchReadiness}%</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 items-center text-center">
            <List className="w-5 h-5 text-brand-accent" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Direct Answer</span>
            <span className="text-2xl font-black text-text-primary">{data.directAnswerCoverage}%</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 items-center text-center">
            <MessageSquare className="w-5 h-5 text-brand-accent" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Content Clarity</span>
            <span className="text-2xl font-black text-text-primary">{data.contentClarity}%</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Query Patterns */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-brand-primary" /> Query Patterns
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-text-secondary uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 font-bold">Query</th>
                  <th className="py-3 px-4 font-bold">Answerability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-text-primary">
                {(data.queryPatterns || []).map((qp, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4">
                      <div className="font-medium">{qp.query}</div>
                      <div className="text-xs text-text-secondary mt-1">{qp.recommendation}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        qp.answerability === 'strong' ? 'bg-green-100 text-green-700' :
                        qp.answerability === 'moderate' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {qp.answerability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Snippet Eligibility */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <Target className="w-4 h-4 text-brand-primary" /> Featured Snippet Eligibility
          </h3>
          <div className="flex flex-col gap-3">
            {(data.featuredSnippetEligibility || []).map((fs, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                {fs.eligible ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-text-primary mb-1">{fs.snippetType}</div>
                  <div className="text-sm text-text-secondary">{fs.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Quality */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-brand-primary" /> FAQ Quality Assessment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.faqQuality || []).map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-text-primary text-sm">{faq.question}</h4>
                  <div className="flex items-center gap-2 text-xs font-bold whitespace-nowrap">
                    Score: <span className={faq.score >= 80 ? 'text-green-600' : faq.score >= 50 ? 'text-orange-500' : 'text-red-500'}>{faq.score}/100</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary bg-white p-3 rounded border border-slate-200 line-clamp-2">
                  {faq.answer}
                </p>
                {faq.improvement && (
                  <p className="text-xs font-medium text-brand-primary bg-blue-50 p-2 rounded">
                    💡 {faq.improvement}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Target Personas */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <Users className="w-4 h-4 text-brand-primary" /> Target Personas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data.personas || []).map((persona, idx) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-text-primary text-sm">{persona.role}</h4>
                  <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded uppercase">
                    {persona.intent}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="font-bold text-text-secondary block mb-1">Pain Points:</span>
                    <ul className="list-disc pl-4 text-text-primary space-y-0.5">
                      {(persona.painPoints || []).map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-text-secondary block mb-1">Engagement Triggers:</span>
                    <ul className="list-disc pl-4 text-text-primary space-y-0.5">
                      {(persona.engagementTriggers || []).map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intent Distribution */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <Target className="w-4 h-4 text-brand-primary" /> Intent Distribution
          </h3>
          <div className="flex flex-col gap-4 justify-center h-full">
            <div className="space-y-3">
              {(data.intents || []).map((intent, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-secondary">{intent.type}</span>
                  <span className="font-bold text-text-primary">{intent.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              {(data.intents || []).map((intent, idx) => {
                const colors = ['bg-brand-primary', 'bg-brand-accent', 'bg-green-500', 'bg-orange-500', 'bg-slate-400'];
                return (
                  <div 
                    key={idx}
                    style={{ width: `${intent.percentage}%` }}
                    className={`h-full ${colors[idx % colors.length]}`}
                    title={`${intent.type}: ${intent.percentage}%`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Entities Tag Cloud */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-brand-primary" /> Extracted Entities
          </h3>
          <div className="flex flex-wrap gap-2">
            {(data.entities || []).map((entity, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <span className="font-bold text-text-primary">{entity.name}</span>
                <span className="bg-white px-1.5 py-0.5 rounded text-[10px] uppercase font-mono text-text-secondary border border-slate-100">
                  {entity.type}
                </span>
                <span className="font-mono font-bold text-brand-primary text-[10px]">
                  {entity.relevance.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Gaps */}
        <div className="light-panel rounded-2xl p-6 flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-brand-primary" /> Content Gaps
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-text-secondary uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 font-bold">Topic</th>
                  <th className="py-3 px-4 font-bold">Priority</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-text-primary">
                {(data.contentGaps || []).map((gap, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-bold">{gap.topic}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        gap.priority === 'High' ? 'bg-red-100 text-red-700' :
                        gap.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {gap.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">{gap.status}</td>
                    <td className="py-3 px-4 text-xs text-text-secondary">{gap.recommendation}</td>
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
