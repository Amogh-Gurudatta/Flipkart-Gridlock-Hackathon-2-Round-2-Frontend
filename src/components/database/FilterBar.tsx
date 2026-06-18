'use client';

import { Search, UserPlus } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'Pending Challans', 'Clear', 'Impounded'] as const;
const FREQUENCY_OPTIONS = ['ALL', 'First-Time', 'Repeat', 'Habitual'] as const;

interface FilterBarProps {
  query: string;
  setQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  frequencyFilter: string;
  setFrequencyFilter: (val: string) => void;
  onAddRecord: () => void;
}

const selectStyle = {
  backgroundColor: 'transparent',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
};

export default function FilterBar({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  frequencyFilter,
  setFrequencyFilter,
  onAddRecord,
}: FilterBarProps) {
  return (
    <div
      className="sticky top-0 z-10 w-full p-4 mb-6"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto items-center">

        {/* ── Search + Add button ────────────────────────────────────── */}
        <div className="flex gap-3 flex-1 w-full">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Vehicle Number or Name..."
              className="w-full pl-9 pr-4 py-2 text-sm font-mono outline-none transition-colors duration-200"
              style={selectStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
            />
          </div>

          <button
            onClick={onAddRecord}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-all shrink-0 cursor-pointer"
            style={{ border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              e.currentTarget.style.color = '#020617';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
          >
            <UserPlus size={14} />
            <span className="hidden sm:inline">Register Offender</span>
          </button>
        </div>

        {/* ── Status filter ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-[10px] font-mono uppercase tracking-widest text-nowrap" style={{ color: 'var(--text-muted)' }}>
            Challan Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-sm font-mono outline-none cursor-pointer appearance-none transition-colors duration-200"
            style={selectStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-black text-white">{o}</option>
            ))}
          </select>
        </div>

        {/* ── Offense Frequency filter ───────────────────────────────── */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-[10px] font-mono uppercase tracking-widest text-nowrap" style={{ color: 'var(--text-muted)' }}>
            Offense Frequency:
          </label>
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 text-sm font-mono outline-none cursor-pointer appearance-none transition-colors duration-200"
            style={selectStyle}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          >
            {FREQUENCY_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-black text-white">{o}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
