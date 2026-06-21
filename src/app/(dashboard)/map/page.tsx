'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import IncidentFeed from '@/components/map/IncidentFeed';
import { useData, type IncidentData } from '@/context/DataContext';

// Dynamically import the map widget with ssr: false to prevent Leaflet from crashing the server
const MapWidget = dynamic(() => import('@/components/map/MapWidget'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
      <div className="text-xs font-mono tracking-widest text-[#64748b] animate-pulse uppercase">
        Initializing Traffic Grid...
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useData();

  // Derive the active node from shared context so the warrants page can drive it too
  const activeNode = useMemo(
    () => incidents.find((i) => i.id === selectedIncidentId) ?? null,
    [incidents, selectedIncidentId],
  );

  const accentColor = 'var(--accent-primary)';

  // Clicking a circle or feed card highlights the incident on the map only.
  // Navigation to /warrants is intentionally one-way (warrants page → map), not vice-versa.
  const handleSelectNode = (node: IncidentData) => {
    setSelectedIncidentId(node.id === selectedIncidentId ? null : node.id);
  };

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] md:h-screen overflow-hidden">
      {/* Absolute floating UI */}
      <IncidentFeed onSelectNode={handleSelectNode} activeId={activeNode?.id} />

      {/* Underlying Map */}
      <MapWidget
        activeNode={activeNode}
        onSelectNode={handleSelectNode}
        accentColor={accentColor}
      />

      {/* Decorative reticle overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-30">
        <div style={{ border: `1px solid ${accentColor}`, width: '40vh', height: '40vh', borderRadius: '50%' }} />
        <div className="absolute w-[80vh] h-px" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
        <div className="absolute h-[80vh] w-px" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
      </div>
    </div>
  );
}
