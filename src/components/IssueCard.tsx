'use client';

import React from 'react';
import { SeoIssue } from '@/lib/seo-checks';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface IssueCardProps {
  issue: SeoIssue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  let borderColor = 'border-l-green-500';
  let badgeClass = 'bg-green-100 text-green-700';
  let Icon = CheckCircle2;
  let iconColor = 'text-green-500';

  if (issue.severity === 'critical') {
    borderColor = 'border-l-red-500';
    badgeClass = 'bg-red-100 text-red-700';
    Icon = XCircle;
    iconColor = 'text-red-500';
  } else if (issue.severity === 'warning') {
    borderColor = 'border-l-orange-500';
    badgeClass = 'bg-orange-100 text-orange-700';
    Icon = AlertTriangle;
    iconColor = 'text-orange-500';
  }

  return (
    <div className={`light-panel rounded-lg p-5 border-l-4 ${borderColor} flex flex-col gap-3 group`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
          <h4 className="font-bold text-text-primary">{issue.title}</h4>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap ${badgeClass}`}>
          {issue.severity}
        </span>
      </div>
      <p className="text-sm text-text-secondary">
        {issue.description}
      </p>
      {issue.currentValue && (
        <div className="text-xs bg-slate-50 p-2 rounded border border-slate-100 font-mono text-slate-600 break-all">
          <span className="font-bold mr-2 text-slate-400">Current:</span>
          {issue.currentValue}
        </div>
      )}
      {issue.recommendation && (
        <div className="text-sm font-medium text-brand-primary mt-1">
          <span className="mr-2">💡 Recommendation:</span>
          {issue.recommendation}
        </div>
      )}
    </div>
  );
}
