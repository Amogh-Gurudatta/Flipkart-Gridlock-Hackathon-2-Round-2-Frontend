'use client';

import { useState } from 'react';
import { type TrafficOffender } from '@/lib/profileData';
import { Car, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  offender: TrafficOffender;
  onDelete: (id: string) => void;
}

// ── Colour maps ──────────────────────────────────────────────────────────────
const FREQUENCY_STYLES: Record<TrafficOffender['frequency'], { color: string; bg: string; border: string }> = {
  'First-Time': { color: '#22c55e', bg: '#22c55e12', border: '#22c55e' },
  'Repeat':     { color: '#f59e0b', bg: '#f59e0b12', border: '#f59e0b' },
  'Habitual':   { color: '#ef4444', bg: '#ef444412', border: '#ef4444' },
};

const STATUS_STYLES: Record<TrafficOffender['status'], { color: string; bg: string; border: string }> = {
  'Pending Challans': { color: '#f97316', bg: '#f9731612', border: '#f97316' },
  'Clear':            { color: '#22c55e', bg: '#22c55e12', border: '#22c55e' },
  'Impounded':        { color: '#ef4444', bg: '#ef444412', border: '#ef4444' },
};

const VEHICLE_TYPE_ICONS: Record<string, string> = {
  '2-Wheeler': '🏍️',
  '4-Wheeler': '🚗',
  'Auto':      '🛺',
  'Heavy':     '🚛',
  'Other':     '🚘',
};

export default function ProfileCard({ offender, onDelete }: ProfileCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const freqStyle = FREQUENCY_STYLES[offender.frequency];
  const statusStyle = STATUS_STYLES[offender.status];

  const handleIssueChallan = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('CHALLAN ISSUED', {
      description: `Challan logged for ${offender.vehicleNumber} — ${offender.name}.`,
      className: 'font-mono uppercase text-xs',
    });
  };

  const handleImpound = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.warning('IMPOUND ORDER RAISED', {
      description: `Vehicle ${offender.vehicleNumber} flagged for impounding.`,
      className: 'font-mono uppercase text-xs',
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000); // auto-cancel after 3 s
      return;
    }
    onDelete(offender.id);
    toast.error('RECORD REMOVED', {
      description: `Offender ${offender.id} removed from registry.`,
      className: 'font-mono uppercase text-xs',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      className="relative group flex flex-col p-5 transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
    >
      {/* ── Delete button ──────────────────────────────────────────────── */}
      <button
        onClick={handleDelete}
        title="Remove record"
        className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer z-10 text-xs font-mono uppercase"
        style={{
          border: `1px solid ${isConfirming ? '#ef4444' : '#334155'}`,
          backgroundColor: isConfirming ? '#ef444418' : 'transparent',
          color: isConfirming ? '#ef4444' : '#475569',
        }}
      >
        {isConfirming ? 'Confirm?' : <Trash2 size={12} />}
      </button>

      {/* ── Header row ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 mb-4">
        {/* Vehicle type icon */}
        <div
          className="w-11 h-11 flex items-center justify-center text-xl shrink-0"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg-base) 60%, #000)',
            border: '1px solid var(--border-color)',
          }}
        >
          {VEHICLE_TYPE_ICONS[offender.vehicleType] ?? '🚘'}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3
            className="text-sm font-mono font-bold tracking-wide uppercase truncate group-hover:text-(--accent-primary) transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
          >
            {offender.name}
          </h3>
          {/* Vehicle number */}
          <p
            className="text-[11px] font-mono tracking-widest mt-0.5 font-bold"
            style={{ color: 'var(--accent-primary)' }}
          >
            {offender.vehicleNumber}
          </p>
          {/* Vehicle type + ID */}
          <p className="text-[9px] font-mono tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {offender.vehicleType} · {offender.id}
          </p>
        </div>
      </div>

      {/* ── Badges row ─────────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-4">
        {/* Status badge */}
        <span
          className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5"
          style={{
            color: statusStyle.color,
            backgroundColor: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
          }}
        >
          {offender.status}
        </span>

        {/* Frequency badge */}
        <span
          className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 flex items-center gap-1"
          style={{
            color: freqStyle.color,
            backgroundColor: freqStyle.bg,
            border: `1px solid ${freqStyle.border}`,
          }}
        >
          {offender.frequency === 'Habitual' && <AlertTriangle size={9} />}
          {offender.frequency}
        </span>
      </div>

      {/* ── Pending fines ──────────────────────────────────────────────── */}
      <div
        className="flex justify-between items-center py-3 mb-4"
        style={{ borderTop: '1px dotted var(--border-color)', borderBottom: '1px dotted var(--border-color)' }}
      >
        <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Pending Fines
        </span>
        <span
          className="text-sm font-mono font-bold"
          style={{ color: offender.pendingFines > 0 ? '#ef4444' : '#22c55e' }}
        >
          ₹{offender.pendingFines.toLocaleString('en-IN')}
        </span>
      </div>

      {/* ── Action buttons ─────────────────────────────────────────────── */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleIssueChallan}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all duration-150"
          style={{
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            e.currentTarget.style.color = '#020617';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--accent-primary)';
          }}
        >
          <FileText size={11} />
          Issue Challan
        </button>

        {offender.status !== 'Impounded' && (
          <button
            onClick={handleImpound}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all duration-150"
            style={{ border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
          >
            <Car size={11} />
            Impound
          </button>
        )}
      </div>
    </motion.div>
  );
}
