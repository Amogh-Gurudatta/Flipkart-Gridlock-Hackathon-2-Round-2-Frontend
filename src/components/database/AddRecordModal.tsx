'use client';

import { useState } from 'react';
import { type TrafficOffender } from '@/lib/profileData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (offender: TrafficOffender) => void;
}

const VEHICLE_TYPES: TrafficOffender['vehicleType'][] = ['2-Wheeler', '4-Wheeler', 'Auto', 'Heavy', 'Other'];
const STATUS_OPTIONS: TrafficOffender['status'][] = ['Pending Challans', 'Clear', 'Impounded'];
const FREQUENCY_OPTIONS: TrafficOffender['frequency'][] = ['First-Time', 'Repeat', 'Habitual'];

const DEFAULT_FORM = {
  name: '',
  vehicleNumber: '',
  vehicleType: '4-Wheeler' as TrafficOffender['vehicleType'],
  status: 'Pending Challans' as TrafficOffender['status'],
  frequency: 'First-Time' as TrafficOffender['frequency'],
  pendingFines: 0,
};

const inputCls = 'w-full bg-black/40 border border-(--border-color) p-2 font-mono text-sm outline-none focus:border-(--accent-primary) transition-colors';
const selectCls = 'w-full bg-black/40 border border-(--border-color) p-2 font-mono text-xs outline-none focus:border-(--accent-primary) transition-colors cursor-pointer';

export default function AddRecordModal({ isOpen, onClose, onAdd }: AddRecordModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const set = <K extends keyof typeof DEFAULT_FORM>(key: K, val: (typeof DEFAULT_FORM)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.vehicleNumber) return;
    setIsSaving(true);

    const newOffender: TrafficOffender = {
      id: `OFF-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      ...form,
    };

    // Simulate a brief async save (replace with real API call later)
    await new Promise((r) => setTimeout(r, 600));

    onAdd(newOffender);
    toast.success('OFFENDER REGISTERED', {
      description: `${form.vehicleNumber} — ${form.name} added to registry.`,
      className: 'font-mono uppercase text-xs',
    });

    onClose();
    setForm(DEFAULT_FORM);
    setIsSaving(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] overflow-y-auto py-10">
          <div className="flex min-h-full items-center justify-center p-4">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ duration: 0.25, ease: 'circOut' }}
              className="relative w-full max-w-xl shadow-[0_0_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--border-color)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 shrink-0"
                style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <Shield size={17} style={{ color: 'var(--accent-primary)' }} />
                  <h2 className="font-mono font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-primary)' }}>
                    Register Traffic Offense
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="transition-colors cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Owner / Driver Name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Owner / Driver Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="e.g. Rajan Kumar"
                      className={inputCls}
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>

                  {/* Vehicle Number */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Vehicle Number *
                    </label>
                    <input
                      required
                      value={form.vehicleNumber}
                      onChange={(e) => set('vehicleNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. KA-01-AB-1234"
                      className={inputCls}
                      style={{ color: 'var(--accent-primary)', letterSpacing: '0.1em' }}
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Vehicle Type
                    </label>
                    <select
                      value={form.vehicleType}
                      onChange={(e) => set('vehicleType', e.target.value as TrafficOffender['vehicleType'])}
                      className={selectCls}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {VEHICLE_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-black text-white">{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pending Fines */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Pending Fine Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.pendingFines}
                      onChange={(e) => set('pendingFines', Number(e.target.value))}
                      className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Challan Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => set('status', e.target.value as TrafficOffender['status'])}
                      className={selectCls}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-black text-white">{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Offense Frequency */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Offense Frequency
                    </label>
                    <select
                      value={form.frequency}
                      onChange={(e) => set('frequency', e.target.value as TrafficOffender['frequency'])}
                      className={selectCls}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {FREQUENCY_OPTIONS.map((f) => (
                        <option key={f} value={f} className="bg-black text-white">{f}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Footer buttons */}
                <div
                  className="flex justify-end gap-3 pt-4"
                  style={{ borderTop: '1px solid var(--border-color)' }}
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 font-mono text-[10px] uppercase font-bold transition-colors cursor-pointer"
                    style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 font-mono text-[10px] uppercase font-bold flex items-center gap-2 transition-opacity cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: 'var(--accent-primary)', color: '#020617' }}
                  >
                    <Save size={13} />
                    {isSaving ? 'Registering...' : 'Register Offender'}
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
