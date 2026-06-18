'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LivePreviewProps {
  eventId: string;
  eventCause: string;
  locationAddress: string;
  predictedDuration: number;
  severityLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

export default function LivePreview({
  eventId,
  eventCause,
  locationAddress,
  predictedDuration,
  severityLevel,
}: LivePreviewProps) {
  const [refNumber] = useState(() =>
    Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  );

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  // ── Auto-Generated Recommendations ────────────────────────────────────────
  const copsRequired = Math.ceil(predictedDuration / 30) * 2;
  const barricades = severityLevel === 'HIGH' || severityLevel === 'CRITICAL' ? 50 : 20;
  const diversionStatus =
    severityLevel === 'CRITICAL' ? 'ACTIVE — DIVERT TRAFFIC' : 'STANDBY';

  const severityColor = SEVERITY_COLORS[severityLevel];
  const isCriticalOrHigh = severityLevel === 'CRITICAL' || severityLevel === 'HIGH';

  return (
    <div className="w-full h-full flex items-start justify-center p-4">
      <div
        id="warrant-document"
        className="relative w-full max-w-[350px] sm:max-w-md md:max-w-lg shadow-2xl flex flex-col p-[5%] overflow-hidden"
        style={{
          aspectRatio: '1 / 1.414',
          backgroundColor: '#060d1a',
          border: '2px solid #1e3a5f',
          fontSize: 'clamp(7px, 2vw, 13px)',
        }}
      >
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center font-bold tracking-tighter pointer-events-none"
          style={{ color: '#1d4ed8', fontSize: '10em', opacity: 0.04 }}
        >
          BTP
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden gap-[4%]">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="pb-[4%]" style={{ borderBottom: '2px solid #1e3a5f' }}>
            {/* Logo Row */}
            <div className="flex items-center justify-center gap-[2%] mb-[3%]">
              {/* BTP Shield SVG */}
              <svg width="1.8em" height="1.8em" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" fill="#1d4ed8" opacity="0.9" />
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" fill="none" stroke="#3b82f6" strokeWidth="1" />
                <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="monospace">BTP</text>
              </svg>
              <div className="text-center">
                <div
                  className="font-mono font-bold uppercase tracking-[0.2em]"
                  style={{ color: '#e2e8f0', fontSize: '1em' }}
                >
                  BENGALURU TRAFFIC POLICE
                </div>
                <div
                  className="font-mono uppercase tracking-[0.35em]"
                  style={{ color: '#3b82f6', fontSize: '0.65em' }}
                >
                  COMMAND CENTER
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div
              className="text-center font-mono font-bold uppercase tracking-[0.25em] py-[1.5%] mt-[2%]"
              style={{
                color: '#1d4ed8',
                fontSize: '0.95em',
                backgroundColor: '#0f1f3d',
                border: '1px solid #1e3a5f',
              }}
            >
              TRAFFIC EVENT DEPLOYMENT ORDER
            </div>

            {/* Meta row */}
            <div
              className="flex justify-between mt-[3%] font-mono tracking-widest"
              style={{ color: '#475569', fontSize: '0.65em' }}
            >
              <span>DATE: {currentDate}</span>
              <span>TIME: {currentTime} IST</span>
              <span>REF: BTP/{refNumber}</span>
            </div>
          </div>

          {/* ── Event Details Box ──────────────────────────────────────────── */}
          <div
            className="p-[4%]"
            style={{ backgroundColor: '#080f1e', border: '1px solid #1e3a5f' }}
          >
            <div
              className="font-mono uppercase tracking-widest mb-[3%]"
              style={{ color: '#475569', fontSize: '0.65em' }}
            >
              ▸ EVENT DETAILS
            </div>
            <div className="flex flex-col gap-[1.5em]">
              {[
                { label: 'Event ID', value: eventId || '—' },
                { label: 'Cause / Nature', value: eventCause || '—' },
                { label: 'Location', value: locationAddress || '—' },
                { label: 'Predicted Duration', value: predictedDuration > 0 ? `${predictedDuration} minutes` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline gap-4">
                  <span
                    className="uppercase font-mono tracking-widest shrink-0"
                    style={{ color: '#475569', fontSize: '0.68em' }}
                  >
                    {label}:
                  </span>
                  <motion.span
                    key={value}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="font-mono font-bold uppercase tracking-wider text-right"
                    style={{ color: '#e2e8f0', fontSize: '0.9em' }}
                  >
                    {value}
                  </motion.span>
                </div>
              ))}

              {/* Severity Row */}
              <div className="flex justify-between items-center">
                <span
                  className="uppercase font-mono tracking-widest"
                  style={{ color: '#475569', fontSize: '0.68em' }}
                >
                  Severity Level:
                </span>
                <span
                  className="font-mono font-bold uppercase tracking-widest px-3 py-0.5"
                  style={{
                    color: severityColor,
                    backgroundColor: `${severityColor}18`,
                    border: `1px solid ${severityColor}`,
                    fontSize: '0.8em',
                  }}
                >
                  {severityLevel}
                </span>
              </div>
            </div>
          </div>

          {/* ── Auto-Generated Recommendations ───────────────────────────── */}
          <div
            className="p-[4%]"
            style={{
              backgroundColor: '#080f1e',
              border: `1px solid ${isCriticalOrHigh ? '#1d4ed8' : '#1e3a5f'}`,
            }}
          >
            <div
              className="font-mono uppercase tracking-widest mb-[3%]"
              style={{ color: '#3b82f6', fontSize: '0.65em' }}
            >
              ▸ AUTO-GENERATED DEPLOYMENT RECOMMENDATIONS
            </div>
            <div className="flex flex-col gap-[1.5em]">
              {[
                { label: 'Traffic Cops Required', value: `${copsRequired} officers` },
                { label: 'Barricades Required', value: `${barricades} units` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline">
                  <span
                    className="uppercase font-mono tracking-widest"
                    style={{ color: '#475569', fontSize: '0.68em' }}
                  >
                    {label}:
                  </span>
                  <span
                    className="font-mono font-bold uppercase tracking-wider"
                    style={{ color: '#e2e8f0', fontSize: '0.9em' }}
                  >
                    {value}
                  </span>
                </div>
              ))}

              {/* Diversion Status */}
              <div className="flex justify-between items-center">
                <span
                  className="uppercase font-mono tracking-widest"
                  style={{ color: '#475569', fontSize: '0.68em' }}
                >
                  Diversion Status:
                </span>
                <span
                  className="font-mono font-bold uppercase tracking-wider px-2 py-0.5"
                  style={{
                    color: severityLevel === 'CRITICAL' ? '#ef4444' : '#22c55e',
                    backgroundColor:
                      severityLevel === 'CRITICAL' ? '#ef444415' : '#22c55e15',
                    border: `1px solid ${severityLevel === 'CRITICAL' ? '#ef4444' : '#22c55e'}`,
                    fontSize: '0.75em',
                  }}
                >
                  {diversionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div
            className="pt-[2%] text-center font-mono tracking-widest uppercase mt-auto"
            style={{
              borderTop: '1px solid #1e3a5f',
              color: '#334155',
              fontSize: '0.6em',
            }}
          >
            Bengaluru Traffic Police — Confidential Operational Document — Not For Public Disclosure
          </div>
        </div>

        {/* ── DISPATCH AUTHORIZED Stamp ──────────────────────────────────── */}
        {eventId && eventCause && (
          <div
            className="absolute top-1/2 left-1/2 pointer-events-none z-20"
            style={{
              transform: 'translate(-50%, -50%) rotate(-12deg)',
              opacity: 0.18,
              width: '75%',
            }}
          >
            <svg width="100%" height="auto" viewBox="0 0 400 120">
              <rect
                x="5" y="5" width="390" height="110"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="10"
              />
              <text
                x="50%" y="52%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="#1d4ed8"
                style={{ fontSize: '30px', letterSpacing: '4px', fontFamily: 'monospace', fontWeight: 'bold' }}
              >
                DISPATCH AUTHORIZED
              </text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
