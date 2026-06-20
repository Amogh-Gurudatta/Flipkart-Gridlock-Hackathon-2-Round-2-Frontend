'use client';

import { useState, useEffect } from 'react';
import { CORRIDORS, EVENT_CAUSES, EVENT_TYPES, PRIORITIES } from '@/types/forecast';
import type { EventRequest } from '@/types/forecast';
import { useData } from '@/context/DataContext';

interface DocumentFormProps {
  isSubmitting: boolean;
  forecastPending: boolean;
  onForecast: (req: EventRequest) => void;
  onExportPdf: () => void;
  hasForecast: boolean;
}

const labelStyle = {
  color: 'var(--text-muted)',
} as const;

const inputBase = {
  backgroundColor: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
} as const;

const SEVERITY_PRIORITY_COLORS: Record<string, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] uppercase font-mono tracking-widest" style={labelStyle}>
      {children}
    </label>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-3 text-sm font-mono outline-none transition-colors duration-200 cursor-pointer appearance-none"
      style={inputBase}
      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#060d1a]">{o}</option>
      ))}
    </select>
  );
}

export default function DocumentForm({
  isSubmitting,
  forecastPending,
  onForecast,
  onExportPdf,
  hasForecast,
}: DocumentFormProps) {
  const [eventCause, setEventCause] = useState<typeof EVENT_CAUSES[number]>('accident');
  const [eventType, setEventType] = useState<typeof EVENT_TYPES[number]>('unplanned');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('High');
  const [corridor, setCorridor] = useState<typeof CORRIDORS[number]>('Tumkur Road');
  const [requiresRoadClosure, setRequiresRoadClosure] = useState(false);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const { draftLocation } = useData();

  // Auto-fill coordinates whenever the user clicks on the live map
  useEffect(() => {
    if (draftLocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLat(draftLocation.lat.toFixed(6));
      setLng(draftLocation.lng.toFixed(6));
    }
  }, [draftLocation]);

  const focusHandlers = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--accent-primary)';
  };
  const blurHandlers = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--border-color)';
  };

  const isReady =
    !!address &&
    lat !== '' &&
    lng !== '' &&
    !isNaN(parseFloat(lat)) &&
    !isNaN(parseFloat(lng));

  const handleForecast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isReady || forecastPending) return;
    onForecast({
      eventCause,
      eventType,
      priority,
      corridor,
      requiresRoadClosure,
      policeStation: 'AUTO_ASSIGNED',
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address,
      },
    });
  };

  return (
    <form onSubmit={handleForecast} className="flex flex-col gap-5 w-full max-w-md">

      {/* Event Cause */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Event Cause</FieldLabel>
        <SelectInput
          value={eventCause}
          onChange={(v) => setEventCause(v as typeof EVENT_CAUSES[number])}
          options={EVENT_CAUSES}
          disabled={forecastPending}
        />
      </div>

      {/* Event Type */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Event Type</FieldLabel>
        <SelectInput
          value={eventType}
          onChange={(v) => setEventType(v as typeof EVENT_TYPES[number])}
          options={EVENT_TYPES}
          disabled={forecastPending}
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Priority</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              disabled={forecastPending}
              onClick={() => setPriority(p)}
              className="py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              style={{
                border: `1px solid ${priority === p ? SEVERITY_PRIORITY_COLORS[p] : 'var(--border-color)'}`,
                backgroundColor: priority === p ? `${SEVERITY_PRIORITY_COLORS[p]}18` : 'var(--bg-surface)',
                color: priority === p ? SEVERITY_PRIORITY_COLORS[p] : 'var(--text-muted)',
                opacity: forecastPending ? 0.5 : 1,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Corridor */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Affected Corridor</FieldLabel>
        <SelectInput
          value={corridor}
          onChange={(v) => setCorridor(v as typeof CORRIDORS[number])}
          options={CORRIDORS}
          disabled={forecastPending}
        />
      </div>

      {/* Road Closure Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setRequiresRoadClosure((v) => !v)}
          disabled={forecastPending}
          className="relative w-10 h-5 cursor-pointer shrink-0"
          style={{
            border: `1px solid ${requiresRoadClosure ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            backgroundColor: 'transparent',
          }}
          aria-label="Toggle road closure"
        >
          <div
            className="absolute top-[2px] h-3 w-4 transition-all duration-200"
            style={{
              backgroundColor: requiresRoadClosure ? 'var(--accent-primary)' : 'var(--text-muted)',
              left: requiresRoadClosure ? 'calc(100% - 18px)' : '2px',
            }}
          />
        </button>
        <span className="text-[10px] font-mono uppercase tracking-widest" style={labelStyle}>
          Requires Road Closure {requiresRoadClosure ? '— YES' : '— NO'}
        </span>
      </div>


      {/* Location Address */}
      <div className="flex flex-col gap-2">
        <FieldLabel>Location Address</FieldLabel>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={forecastPending}
          placeholder="e.g. Near Peenya Metro Station, Tumkur Road"
          className="w-full px-4 py-3 text-sm font-mono outline-none transition-colors duration-200"
          style={{ ...inputBase, opacity: forecastPending ? 0.5 : 1 }}
          onFocus={focusHandlers}
          onBlur={blurHandlers}
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <FieldLabel>Latitude</FieldLabel>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            disabled={forecastPending}
            placeholder="e.g. 13.0285"
            className="w-full px-4 py-3 text-sm font-mono outline-none transition-colors duration-200"
            style={{ ...inputBase, opacity: forecastPending ? 0.5 : 1 }}
            onFocus={focusHandlers}
            onBlur={blurHandlers}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>Longitude</FieldLabel>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            disabled={forecastPending}
            placeholder="e.g. 77.5195"
            className="w-full px-4 py-3 text-sm font-mono outline-none transition-colors duration-200"
            style={{ ...inputBase, opacity: forecastPending ? 0.5 : 1 }}
            onFocus={focusHandlers}
            onBlur={blurHandlers}
          />
        </div>
      </div>
      <p className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--text-muted)', marginTop: '-8px' }}>
        ✦ Tip: Click on the Live Map to auto-fill coordinates
      </p>

      {/* Get Forecast */}
      <button
        type="submit"
        disabled={forecastPending || !isReady}
        className="relative w-full h-14 overflow-hidden mt-2 cursor-pointer disabled:cursor-not-allowed"
        style={{
          border: '1px solid var(--accent-primary)',
          backgroundColor: forecastPending
            ? 'var(--bg-surface)'
            : 'color-mix(in srgb, var(--accent-primary) 10%, transparent)',
        }}
        onMouseEnter={(e) => {
          if (!forecastPending && isReady)
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = forecastPending
            ? 'var(--bg-surface)'
            : 'color-mix(in srgb, var(--accent-primary) 10%, transparent)';
        }}
      >
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.3em]"
          style={{ color: forecastPending || !isReady ? 'var(--text-muted)' : 'var(--accent-primary)' }}
        >
          {forecastPending ? 'Running Forecast...' : 'Get AI Forecast'}
        </span>
        {forecastPending && (
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-primary) 40%, transparent)',
              animation: 'fillProgress 3s linear forwards',
            }}
          />
        )}
      </button>

      {/* Export PDF — only available after a successful forecast */}
      {hasForecast && (
        <button
          type="button"
          onClick={onExportPdf}
          disabled={isSubmitting}
          className="relative w-full h-12 overflow-hidden cursor-pointer disabled:cursor-not-allowed transition-opacity duration-150 hover:opacity-80"
          style={{
            border: '1px solid #22c55e',
            backgroundColor: 'rgba(34,197,94,0.08)',
          }}
        >
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.3em]"
            style={{ color: isSubmitting ? 'var(--text-muted)' : '#22c55e' }}
          >
            {isSubmitting ? 'GENERATING PDF...' : 'Export Deployment Order'}
          </span>
        </button>
      )}

      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </form>
  );
}
