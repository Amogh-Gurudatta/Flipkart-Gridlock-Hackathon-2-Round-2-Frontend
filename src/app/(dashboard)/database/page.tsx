'use client';

import { useState, useMemo } from 'react';
import { MOCK_OFFENDERS, type TrafficOffender } from '@/lib/profileData';
import FilterBar from '@/components/database/FilterBar';
import ProfileCard from '@/components/database/ProfileCard';
import AddRecordModal from '@/components/database/AddRecordModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function DatabasePage() {
  // Local state — seeded from mock data; swap for API data when backend is live
  const [offenders, setOffenders] = useState<TrafficOffender[]>(MOCK_OFFENDERS);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [frequencyFilter, setFrequencyFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return offenders.filter((o) => {
      const matchesQuery =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.vehicleNumber.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesFrequency = frequencyFilter === 'ALL' || o.frequency === frequencyFilter;

      return matchesQuery && matchesStatus && matchesFrequency;
    });
  }, [offenders, query, statusFilter, frequencyFilter]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAdd = (offender: TrafficOffender) => {
    setOffenders((prev) => [offender, ...prev]);
  };

  const handleDelete = (id: string) => {
    setOffenders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="min-h-screen relative overflow-y-auto" style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* Sticky filter bar */}
      <FilterBar
        query={query}
        setQuery={setQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        frequencyFilter={frequencyFilter}
        setFrequencyFilter={setFrequencyFilter}
        onAddRecord={() => setIsModalOpen(true)}
      />

      {/* Register offense modal */}
      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">

        {/* Page title */}
        <div className="mb-6 border-l-4 pl-5" style={{ borderColor: 'var(--accent-primary)' }}>
          <h1
            className="text-xl font-mono font-bold uppercase tracking-[0.3em]"
            style={{ color: 'var(--text-primary)' }}
          >
            Traffic Offender Registry
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>
            Bengaluru Traffic Police — {filtered.length} of {offenders.length} records shown
          </p>
        </div>

        {/* Card grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((offender) => (
              <ProfileCard
                key={offender.id}
                offender={offender}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-20"
            >
              <p
                className="text-sm font-mono uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                No matching offenders found in registry.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
