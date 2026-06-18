'use client';

import { useState, useEffect, useRef } from 'react';
import { useData, type IncidentData } from '@/context/DataContext';
import { Crosshair, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamically import recharts-based chart (avoids SSR issues)
const ForecastChart = dynamic(() => import('@/components/map/ForecastChart'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full mt-3 p-3 flex items-center justify-center"
      style={{ border: '1px solid var(--border-color)', height: 140 }}
    >
      <span className="text-[9px] font-mono uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-muted)' }}>
        Loading forecast...
      </span>
    </div>
  ),
});

interface IncidentFeedProps {
  onSelectNode: (node: IncidentData) => void;
  activeId?: string | null;
}

const SEVERITY_BADGE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: '#ef4444', bg: '#ef444415', border: '#ef4444' },
  HIGH:     { color: '#f97316', bg: '#f9731615', border: '#f97316' },
  MODERATE: { color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b' },
  LOW:      { color: '#22c55e', bg: '#22c55e15', border: '#22c55e' },
};

/** Fires a styled sonner toast for CRITICAL / HIGH severity events */
function fireAlertToast(node: IncidentData) {
  const isCritical = node.severity_level === 'CRITICAL';
  const duration = node.estimated_duration_mins;
  const msg = `${node.severity_level} ALERT: ${node.incident_type} detected at ${node.address ?? node.title}. Severe congestion predicted${duration ? ` for the next ${duration} minutes` : ''}.`;

  if (isCritical) {
    toast.error(msg, {
      duration: 6000,
      className: 'font-mono uppercase text-[10px] tracking-wider',
      icon: '🚨',
    });
  } else {
    toast.warning(msg, {
      duration: 5000,
      className: 'font-mono uppercase text-[10px] tracking-wider',
      icon: '⚠️',
    });
  }
}

export default function IncidentFeed({ onSelectNode, activeId }: IncidentFeedProps) {
  const { incidents } = useData();
  const [isExpanded, setIsExpanded] = useState(false);

  // Track which IDs have already triggered a toast (avoid repeat-firing on re-render)
  const alertedIds = useRef<Set<string>>(new Set());

  // Fire alerts on initial load for any pre-loaded CRITICAL / HIGH events
  useEffect(() => {
    incidents.forEach((node) => {
      if (
        (node.severity_level === 'CRITICAL' || node.severity_level === 'HIGH') &&
        !alertedIds.current.has(node.id)
      ) {
        alertedIds.current.add(node.id);
        // Stagger toasts so they don't all fire at t=0
        const delay = Array.from(alertedIds.current).indexOf(node.id) * 800;
        setTimeout(() => fireAlertToast(node), delay);
      }
    });
  }, [incidents]);

  const activeNode = incidents.find((n) => n.id === activeId) ?? null;

  const handleSelect = (node: IncidentData) => {
    onSelectNode(node);
    // Fire toast on click too (only for high-severity events that haven't been alerted)
    if (node.severity_level === 'CRITICAL' || node.severity_level === 'HIGH') {
      fireAlertToast(node);
    }
  };

  return (
    <div
      className={`absolute top-4 md:top-6 right-4 md:right-6 w-[calc(100%-2rem)] md:w-80 z-[1000] flex flex-col transition-all duration-300 ${
        isExpanded ? 'max-h-[85vh]' : 'max-h-[48px] md:max-h-[calc(100vh-48px)]'
      }`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        className={`px-4 py-3 sticky top-0 flex justify-between items-center cursor-pointer md:cursor-default ${
          isExpanded ? 'border-b border-(--border-color)' : 'md:border-b md:border-(--border-color)'
        }`}
        style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)' }}
        onClick={() => {
          if (window && window.innerWidth < 768) setIsExpanded(!isExpanded);
        }}
      >
        <h2
          className="text-xs font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <Crosshair size={14} style={{ color: 'var(--accent-primary)' }} />
          Active Dispatches
        </h2>
        <div className="md:hidden">
          {isExpanded
            ? <ChevronUp size={16} style={{ color: 'var(--text-primary)' }} />
            : <ChevronDown size={16} style={{ color: 'var(--text-primary)' }} />}
        </div>
      </div>

      {/* ── Event List ───────────────────────────────────────────────────── */}
      <div className={`overflow-y-auto flex-1 p-2 space-y-2 md:block ${isExpanded ? 'block' : 'hidden'}`}>
        {incidents.map((node) => {
          const isActive = activeId === node.id;
          const sev = node.severity_level as string | undefined;
          const badge = SEVERITY_BADGE_COLORS[sev ?? ''] ?? {
            color: 'var(--text-muted)',
            bg: 'transparent',
            border: 'var(--border-color)',
          };

          return (
            <div key={node.id}>
              <button
                onClick={() => handleSelect(node)}
                className="w-full text-left p-3 cursor-pointer transition-all duration-200"
                style={{
                  border: isActive
                    ? '1px solid var(--accent-primary)'
                    : '1px solid var(--border-color)',
                  backgroundColor: isActive
                    ? 'color-mix(in srgb, var(--accent-primary) 8%, transparent)'
                    : 'transparent',
                }}
              >
                {/* ID row + severity badge */}
                <div className="flex justify-between items-start mb-1">
                  <span
                    className="text-[10px] font-mono tracking-widest font-bold flex items-center gap-1"
                    style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                  >
                    {(sev === 'CRITICAL' || sev === 'HIGH') && (
                      <AlertTriangle size={10} style={{ color: badge.color }} />
                    )}
                    {String(node.id).toUpperCase()}
                  </span>
                  <span
                    className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5"
                    style={{
                      color: badge.color,
                      backgroundColor: badge.bg,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    {sev || node.incident_type || 'ACTIVE'}
                  </span>
                </div>

                {/* Title */}
                <p
                  className="text-xs font-mono uppercase tracking-wide leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {node.title}
                </p>

                {/* Diversion route */}
                {node.diversion_route && (
                  <p
                    className="mt-1 text-[9px] font-mono tracking-wide leading-tight"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {node.diversion_route}
                  </p>
                )}
              </button>

              {/* ── Inline Forecast Chart (shown for active event) ───────── */}
              {isActive && activeNode && (
                <ForecastChart incident={activeNode} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
