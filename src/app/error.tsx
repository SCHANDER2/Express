'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error('[EXPRESS] Client error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-extrabold text-text-primary mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          EXPRESS encountered an unexpected error. This is usually temporary — try refreshing the page or analyzing a different URL.
        </p>
        {error.digest && (
          <p className="text-3xs font-mono text-text-secondary/50 mb-4">
            Error Reference: {error.digest}
          </p>
        )}
        <button
          onClick={() => unstable_retry()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold transition-all hover:bg-cyan-600 active:scale-98 shadow-md shadow-brand-primary/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
