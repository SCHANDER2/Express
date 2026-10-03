'use client';

import React, { useState } from 'react';
import { SeoAuditData } from '@/types';
import ScoreGauge from './ScoreGauge';
import IssueCard from './IssueCard';

interface SeoAuditReportProps {
  data: SeoAuditData;
}

export default function SeoAuditReport({ data }: SeoAuditReportProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Categories list
  const categories = ['All', ...Object.keys(data.categoryScores || {})];

  // Filter issues
  const displayedIssues = (data.issues || [])
    .filter(issue => activeCategory === 'All' || issue.category === activeCategory)
    .sort((a, b) => {
      const sevMap: Record<string, number> = { critical: 3, warning: 2, good: 1 };
      return (sevMap[b.severity] || 0) - (sevMap[a.severity] || 0);
    });

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-6 tab-fade-in">
      {/* Top Header Section */}
      <div className="light-panel rounded-2xl p-8 flex flex-col md:flex-row items-center gap-12">
        <ScoreGauge score={data.score} label={data.scoreLabel} size="lg" />
        
        <div className="flex-1 flex flex-col gap-6 w-full">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">SEO Audit Overview</h2>
            <p className="text-text-secondary text-sm">Comprehensive technical and content analysis for search engine visibility.</p>
          </div>

          {/* Summary Pills */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
              <span className="text-2xl font-black text-red-600">{data.summary?.critical || 0}</span>
              <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Critical<br/>Issues</span>
            </div>
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
              <span className="text-2xl font-black text-orange-600">{data.summary?.warnings || 0}</span>
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Warnings<br/>Found</span>
            </div>
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 px-4 py-3 rounded-xl flex-1 min-w-[140px]">
              <span className="text-2xl font-black text-green-600">{data.summary?.good || 0}</span>
              <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Passed<br/>Checks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex flex-col gap-4">
        <div className="flex overflow-x-auto pb-2 gap-2 log-scrollbar">
          {categories.map(cat => {
            const isActive = cat === activeCategory;
            const score = (cat !== 'All' && data.categoryScores) ? data.categoryScores[cat].score : null;
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-md' 
                    : 'bg-white text-text-secondary hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                {score !== null && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 
                    score >= 80 ? 'bg-green-100 text-green-700' :
                    score >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {score}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Issues List */}
        <div className="grid grid-cols-1 gap-4">
          {displayedIssues.length > 0 ? (
            displayedIssues.map((issue, idx) => (
              <IssueCard key={`${issue.id}-${idx}`} issue={issue} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-text-secondary font-medium">No issues found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
