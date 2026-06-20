'use client';

import { useState, useMemo } from 'react';
import { useData, type IncidentData } from '@/context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SortAsc, SortDesc, MapPin, Clock, Users, Shield } from 'lucide-react';

// ── Severity meta ─────────────────────────────────────────────────────────────
const SEVERITY_LEVELS = ['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const;
type SeverityFilter = typeof SEVERITY_LEVELS[number];

const SEVERITY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  LOW:      { color: '#22c55e', bg: '#22c55e12', border: '#22c55e' },
  MODERATE: { color: '#f59e0b', bg: '#f59e0b12', border: '#f59e0b' },
  HIGH:     { color: '#f97316', bg: '#f9731612', border: '#f97316' },
  CRITICAL: { color: '#ef4444', bg: '#ef444412', border: '#ef4444' },
};

function SeverityBadge({ level }: { level: string }) {
  const s = SEVERITY_STYLES[level] ?? { color: 'var(--text-muted)', bg: 'transparent', border: 'var(--border-color)' };
  return (
    <span
      className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 tracking-widest"
      style={{ color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}` }}
    >
      {level}
    </span>
  );
}

// ── Stat card shown above the table ───────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-4"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
    >
      <div className="p-2" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DispatchLogsPage() {
  const { incidents } = useData();
  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('ALL');
  const [sortOrder, setSortOrder] = useState<'DURATION_ASC' | 'DURATION_DESC' | 'SEVERITY'>('SEVERITY');

  const SEVERITY_RANK: Record<string, number> = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };

  const filtered = useMemo<IncidentData[]>(() => {
    const q = query.toLowerCase();
    const result = incidents.filter((ev) => {
      const matchesQuery =
        ev.id.toLowerCase().includes(q) ||
        (ev.address ?? '').toLowerCase().includes(q) ||
        ev.incident_type.toLowerCase().includes(q);
      const matchesSeverity =
        severityFilter === 'ALL' || ev.severity_level === severityFilter;
      return matchesQuery && matchesSeverity;
    });

    result.sort((a, b) => {
      if (sortOrder === 'SEVERITY') {
        return (SEVERITY_RANK[b.severity_level ?? ''] ?? 0) -
               (SEVERITY_RANK[a.severity_level ?? ''] ?? 0);
      }
      const diff = (a.estimated_duration_mins ?? 0) - (b.estimated_duration_mins ?? 0);
      return sortOrder === 'DURATION_ASC' ? diff : -diff;
    });

    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, severityFilter, sortOrder, incidents]);

  // Aggregate stats
  const totalCops = incidents.reduce((s, e) => s + (e.traffic_cops_needed ?? 0), 0);
  const totalBarricades = incidents.reduce((s, e) => s + (e.barricades ?? 0), 0);
  const criticalCount = incidents.filter(e => e.severity_level === 'CRITICAL').length;

  return (
    <div
      className="min-h-screen p-6 pt-24 lg:p-12 lg:pt-28 pb-24 overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="border-l-4 pl-6" style={{ borderColor: 'var(--accent-primary)' }}>
          <h1
            className="text-2xl font-mono font-bold uppercase tracking-[0.3em] mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Active Dispatch Logs
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Bengaluru Traffic Police — All active traffic events and recommended deployments
          </p>
        </div>

        {/* ── Summary Stats ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Shield}  label="Total Events"   value={incidents.length} color="#1d4ed8" />
          <StatCard icon={Shield}  label="Critical Alerts" value={criticalCount}          color="#ef4444" />
          <StatCard icon={Users}   label="Officers Req."   value={`${totalCops} officers`} color="#f59e0b" />
          <StatCard icon={Shield}  label="Barricades Req." value={`${totalBarricades} units`} color="#22c55e" />
        </div>

        {/* ── Filter Bar ───────────────────────────────────────────────── */}
        <div
          className="flex flex-col md:flex-row gap-4 p-5"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
            <input
              type="text"
              placeholder="Search by Event ID or Location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent font-mono text-xs outline-none"
              style={{
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
            />
          </div>

          {/* Severity filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {SEVERITY_LEVELS.map((level) => {
              const isActive = severityFilter === level;
              const s = SEVERITY_STYLES[level];
              return (
                <button
                  key={level}
                  onClick={() => setSeverityFilter(level)}
                  className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer"
                  style={{
                    border: `1px solid ${isActive ? (s?.border ?? 'var(--accent-primary)') : 'var(--border-color)'}`,
                    backgroundColor: isActive ? (s?.bg ?? 'color-mix(in srgb, var(--accent-primary) 10%, transparent)') : 'transparent',
                    color: isActive ? (s?.color ?? 'var(--accent-primary)') : 'var(--text-muted)',
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {/* Sort toggle */}
          <button
            onClick={() =>
              setSortOrder((prev) =>
                prev === 'SEVERITY' ? 'DURATION_DESC' : prev === 'DURATION_DESC' ? 'DURATION_ASC' : 'SEVERITY'
              )
            }
            className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-150 cursor-pointer whitespace-nowrap"
            style={{
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-primary)'; e.currentTarget.style.color = '#020617'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            {sortOrder === 'SEVERITY' ? <SortDesc size={13} /> : <SortAsc size={13} />}
            {sortOrder === 'SEVERITY' ? 'Sort: Severity' : sortOrder === 'DURATION_DESC' ? 'Sort: Duration ↓' : 'Sort: Duration ↑'}
          </button>
        </div>

        {/* ── Data Table ───────────────────────────────────────────────── */}
        <div
          className="overflow-x-auto"
          style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}
        >
          <table className="w-full text-left font-mono border-collapse min-w-[700px]">
            <thead>
              <tr
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.35)',
                  borderBottom: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                <th className="p-4">Event ID</th>
                <th className="p-4">Cause</th>
                <th className="p-4">Location</th>
                <th className="p-4">Severity</th>
                <th className="p-4 text-right">Est. Duration</th>
                <th className="p-4 text-right">Recommended Deployment</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  filtered.map((ev, i) => (
                    <motion.tr
                      key={ev.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.04 }}
                      layout
                      className="group transition-colors duration-150"
                      style={{ borderBottom: '1px solid color-mix(in srgb, var(--border-color) 60%, transparent)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Event ID */}
                      <td className="p-4">
                        <span
                          className="text-xs font-bold tracking-wider"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          {ev.id}
                        </span>
                      </td>

                      {/* Cause */}
                      <td className="p-4 text-xs" style={{ color: 'var(--text-primary)' }}>
                        {ev.incident_type}
                      </td>

                      {/* Location */}
                      <td className="p-4">
                        <span
                          className="flex items-center gap-1.5 text-[10px] leading-snug"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <MapPin size={10} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                          {ev.address}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="p-4">
                        <SeverityBadge level={ev.severity_level ?? 'LOW'} />
                      </td>

                      {/* Est. Duration */}
                      <td className="p-4 text-right">
                        <span className="flex items-center justify-end gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={10} style={{ flexShrink: 0 }} />
                          {ev.estimated_duration_mins} min
                        </span>
                      </td>

                      {/* Recommended Deployment */}
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span
                            className="text-[10px] font-bold"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {ev.traffic_cops_needed} Cops,&nbsp;
                            {ev.barricades} Barricades
                          </span>
                          <span
                            className="text-[9px] leading-snug max-w-[200px] text-right"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {ev.diversion_route}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td
                      colSpan={6}
                      className="p-20 text-center text-[10px] uppercase tracking-[0.3em]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No events match the current filters.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ── Row count footer ─────────────────────────────────────────── */}
        <p
          className="text-[9px] font-mono uppercase tracking-widest text-right"
          style={{ color: 'var(--text-muted)' }}
        >
          Showing {filtered.length} of {incidents.length} events
        </p>

      </div>
    </div>
  );
}
