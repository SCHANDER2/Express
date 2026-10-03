'use client';

import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Calculate color
  let color = 'text-green-600';
  if (normalizedScore < 40) color = 'text-red-600';
  else if (normalizedScore < 60) color = 'text-orange-500';
  else if (normalizedScore < 80) color = 'text-yellow-500';

  const sizeClasses = {
    sm: 'w-24 h-12 text-sm',
    md: 'w-40 h-20 text-2xl',
    lg: 'w-64 h-32 text-5xl',
  };

  const labelSizeClasses = {
    sm: 'text-xs mt-1',
    md: 'text-sm mt-2',
    lg: 'text-lg mt-4',
  };

  // Semi-circle math
  const dashArray = 180;
  const dashOffset = 180 - (normalizedScore / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-end justify-center overflow-hidden ${sizeClasses[size]}`}>
        {/* Background Arc */}
        <svg
          className="absolute top-0 left-0 w-full h-full text-slate-200"
          viewBox="0 0 100 50"
        >
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
        {/* Foreground Arc */}
        <svg
          className={`absolute top-0 left-0 w-full h-full ${color} transition-all duration-1000 ease-out`}
          viewBox="0 0 100 50"
        >
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
          />
        </svg>
        {/* Score Text */}
        <span className="absolute font-extrabold text-text-primary z-10 bottom-0 leading-none">
          {normalizedScore}
        </span>
      </div>
      <span className={`font-bold text-text-secondary uppercase tracking-widest ${labelSizeClasses[size]}`}>
        {label}
      </span>
    </div>
  );
}
