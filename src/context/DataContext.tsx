"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { ForecastResponse } from "@/types/forecast";

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
  cranes?: number;
  diversion_route?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface DataContextType {
  /** Mock + live incidents shown on the map */
  incidents: IncidentData[];
  /**
   * The most recently received ForecastResponse from POST /api/v1/forecast.
   * Set here so any component (e.g. MapWidget) can render the diversion path
   * and impact polygon without prop drilling through every page.
   */
  lastForecast: ForecastResponse | null;
  setLastForecast: (f: ForecastResponse | null) => void;
  /** Coordinates picked by clicking on the live map, used to auto-fill the form */
  draftLocation: { lat: number; lng: number } | null;
  setDraftLocation: (loc: { lat: number; lng: number } | null) => void;
  /** The incident currently selected across the map and dispatch log */
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  /** Full history of all generated forecasts, persisted in localStorage */
  forecastHistory: ForecastResponse[];
  setForecastHistory: (history: ForecastResponse[]) => void;
  /** Function to delete a specific incident by ID from both state and storage */
  deleteIncident: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/** Converts a ForecastResponse to the IncidentData shape used by the map and feed */
function mapForecastToIncident(event: ForecastResponse): IncidentData {
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
    cranes: event.deployment_recommendation.cranes ?? 0,
    diversion_route: event.deployment_recommendation.diversion_route,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [lastForecast, setLastForecast] = useState<ForecastResponse | null>(
    null,
  );
  const [draftLocation, setDraftLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );
  const [forecastHistory, setForecastHistory] = useState<ForecastResponse[]>(
    [],
  );

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("btp_forecast_history");
      if (saved) {
        const parsed = JSON.parse(saved) as ForecastResponse[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForecastHistory(parsed);
        // Hydrate the map and feeds with the historical data
        setIncidents((prev) => {
          const historicalIncidents = parsed.map(mapForecastToIncident);
          const existingIds = new Set(prev.map((i) => i.id));
          const newIncidents = historicalIncidents.filter(
            (i) => !existingIds.has(i.id),
          );
          return [...newIncidents, ...prev];
        });
      }
    } catch (e) {
      console.error("Failed to load forecast history", e);
    }
  }, []);

  useEffect(() => {
    if (lastForecast) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIncidents((prev) => {
        // Prevent duplicate appending if the same forecast object is passed
        if (prev.find((i) => i.id === lastForecast.event_id)) return prev;
        return [mapForecastToIncident(lastForecast), ...prev];
      });

      setForecastHistory((prev) => {
        if (prev.find((f) => f.event_id === lastForecast.event_id)) return prev;
        const newHistory = [lastForecast, ...prev].slice(0, 50); // Keep last 50 events
        try {
          localStorage.setItem(
            "btp_forecast_history",
            JSON.stringify(newHistory),
          );
        } catch (e) {
          console.error("Failed to save forecast history", e);
        }
        return newHistory;
      });
    }
  }, [lastForecast]);

  const deleteIncident = (id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    setForecastHistory((prev) => {
      const newHistory = prev.filter((f) => f.event_id !== id);
      try {
        localStorage.setItem(
          "btp_forecast_history",
          JSON.stringify(newHistory),
        );
      } catch (e) {
        console.error("Failed to update localStorage on delete", e);
      }
      return newHistory;
    });
    if (lastForecast?.event_id === id) {
      setLastForecast(null);
    }
    if (selectedIncidentId === id) {
      setSelectedIncidentId(null);
    }
  };

  return (
    <DataContext.Provider
      value={{
        incidents,
        lastForecast,
        setLastForecast,
        draftLocation,
        setDraftLocation,
        selectedIncidentId,
        setSelectedIncidentId,
        forecastHistory,
        setForecastHistory,
        deleteIncident,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
