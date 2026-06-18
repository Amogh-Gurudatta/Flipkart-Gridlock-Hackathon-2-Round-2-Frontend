'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function GatewayPage() {
  const router = useRouter();
  const [fieldOne, setFieldOne] = useState('');
  const [fieldTwo, setFieldTwo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fieldOne || !fieldTwo) return;

    setIsLoading(true);
    setErrorInfo(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    try {
      const response = await fetch(`${apiUrl}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: fieldOne,
          password: fieldTwo,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Finalize Session
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        router.push('/map');
      } else if (response.status === 401) {
        setErrorInfo('ACCESS DENIED: Invalid credentials');
      } else {
        setErrorInfo(`ERROR: Unexpected server response (${response.status})`);
      }
    } catch {
      setErrorInfo('ERROR: Network offline or backend unreachable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Login Card */}
      <div
        className="w-full max-w-md relative"
        style={{
          backgroundColor: 'var(--bg-surface)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Top Accent Bar */}
        <div
          className="h-[2px] w-full"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        />

        <div className="p-8 pt-6">

          {/* Header */}
          <div className="mb-8 mt-2">
            <div className="flex items-center gap-3 mb-3">
              <Shield
                size={20}
                style={{ color: 'var(--accent-primary)' }}
                strokeWidth={2}
              />
              <h1
                className="text-sm font-mono font-bold uppercase tracking-[0.25em]"
                style={{ color: 'var(--text-primary)' }}
              >
                BTP Predictive Command Center
              </h1>
            </div>
            <p
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              Bengaluru Traffic Police — Authorized Personnel Only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field One */}
            <div>
              <label
                htmlFor="field-one"
                className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Officer ID / Badge Number
              </label>
              <input
                id="field-one"
                type="text"
                value={fieldOne}
                onChange={(e) => setFieldOne(e.target.value)}
                placeholder="Enter badge number"
                autoComplete="off"
                className="w-full bg-transparent text-sm font-mono py-2 px-0 outline-none transition-colors duration-200"
                style={{
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--accent-primary)',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderRadius: 0,
                }}
              />
            </div>

            {/* Field Two */}
            <div>
              <label
                htmlFor="field-two"
                className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Password
              </label>
              <input
                id="field-two"
                type="password"
                value={fieldTwo}
                onChange={(e) => setFieldTwo(e.target.value)}
                placeholder="••••••••••"
                autoComplete="off"
                className="w-full bg-transparent text-sm font-mono py-2 px-0 outline-none transition-colors duration-200"
                style={{
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--accent-primary)',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderRadius: 0,
                }}
              />
            </div>

            {/* Submit */}
            <button
              id="auth-submit"
              type="submit"
              disabled={isLoading || (isMounted && (!fieldOne || !fieldTwo))}
              className="w-full py-3 text-xs font-mono font-bold uppercase tracking-[0.3em] cursor-pointer transition-opacity duration-150 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#020617',
                border: 'none',
              }}
            >
              {isLoading ? 'AUTHENTICATING...' : 'Authenticate'}
            </button>
          </form>

          {/* Error Details */}
          {errorInfo && (
            <div className="mt-4 p-2 tracking-widest text-[10px] font-mono text-center uppercase border border-red-900/50 text-red-500 bg-red-900/10">
              {errorInfo}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <p
              className="text-[9px] font-mono uppercase tracking-[0.15em]"
              style={{ color: 'var(--text-muted)', opacity: 0.6 }}
            >
              Coordinate: 12.9716° N, 77.5946° E — Bengaluru, Karnataka
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
