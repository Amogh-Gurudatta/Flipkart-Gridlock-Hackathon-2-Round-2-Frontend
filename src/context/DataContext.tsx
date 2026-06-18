'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MOCK_BTP_EVENTS, type BTPEvent } from '@/lib/mockBTPData';

// Maps the BTPEvent schema to the IncidentData shape used across the UI
export interface IncidentData {
  id: string;
  latitude: number;
  longitude: number;
  severity: number;
  incident_type: string;
  title?: string;
  description?: string;
  timestamp?: string;
  address?: string;
  estimated_duration_mins?: number;
  severity_level?: string;
  traffic_cops_needed?: number;
  barricades?: number;
  diversion_route?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface DataContextType {
  incidents: IncidentData[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/** Converts a BTPEvent to the IncidentData shape used by the map and feed */
function mapBTPEventToIncident(event: BTPEvent): IncidentData {
  const severityMap: Record<string, number> = {
    LOW: 3,
    MODERATE: 5,
    HIGH: 8,
    CRITICAL: 10,
  };
  return {
    id: event.event_id,
    latitude: event.location.lat,
    longitude: event.location.lng,
    severity: severityMap[event.predictions.severity_level] ?? 5,
    incident_type: event.cause,
    title: `${event.cause} — ${event.location.address}`,
    description: event.deployment_recommendation.diversion_route,
    timestamp: new Date().toISOString(),
    address: event.location.address,
    estimated_duration_mins: event.predictions.estimated_duration_mins,
    severity_level: event.predictions.severity_level,
    traffic_cops_needed: event.deployment_recommendation.traffic_cops_needed,
    barricades: event.deployment_recommendation.barricades,
    diversion_route: event.deployment_recommendation.diversion_route,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Incidents are seeded from mock BTP data; will be replaced by live API later
  const [incidents] = useState<IncidentData[]>(
    MOCK_BTP_EVENTS.map(mapBTPEventToIncident)
  );



  const refreshData = useCallback(async () => {
    try {
      // NOTE: Incidents are served from mockBTPData for now.
      // When the Python backend is ready, replace with:
      //   const incidentsRes = await apiFetch('/incidents/');
      //   if (incidentsRes?.ok) {
      //     const data = await incidentsRes.json();
      //     setIncidents(Array.isArray(data) ? data.map(mapBTPEventToIncident) : []);
      //   }
    } catch (error) {
      console.error('Data refresh cycle failed:', error);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const tick = () => {
      const hasToken = typeof window !== 'undefined' && localStorage.getItem('access');
      if (hasToken) {
        refreshData();
      } else {
        clearInterval(intervalId);
      }
    };

    const initialToken = typeof window !== 'undefined' && localStorage.getItem('access');
    if (initialToken) {
      refreshData();
      intervalId = setInterval(tick, 5000);
    }

    return () => clearInterval(intervalId);
  }, [refreshData, pathname]);

  return (
    <DataContext.Provider
      value={{
        incidents,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}