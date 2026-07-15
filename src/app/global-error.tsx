'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error('[EXPRESS] Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#f8fafc',
          color: '#0f172a',
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 20px',
              borderRadius: 16,
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Critical Application Error
          </h2>
          <p
            style={{
              fontSize: 14,
              color: '#64748b',
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            EXPRESS experienced a critical error. Please refresh the page to
            continue.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#94a3b8',
                marginBottom: 16,
              }}
            >
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={() => unstable_retry()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 12,
              backgroundColor: '#0891b2',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(8,145,178,0.2)',
            }}
          >
            ↻ Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
