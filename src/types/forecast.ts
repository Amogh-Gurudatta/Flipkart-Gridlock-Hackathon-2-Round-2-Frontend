// Mirrors app/models.py — EventRequest (camelCase per Pydantic alias)
export interface EventRequest {
  eventCause: string;
  eventType: string;
  priority: 'Low' | 'Medium' | 'High';
  corridor: string;
  requiresRoadClosure: boolean;
  policeStation: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

// Mirrors app/models.py — ForecastResponse
export interface ForecastResponse {
  event_id: string;
  cause: string;
  location: { lat: number; lng: number; address: string };
  predictions: {
    estimated_duration_mins: number;
    severity_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  };
  deployment_recommendation: {
    traffic_cops_needed: number;
    barricades: number;
    cranes: number;
    diversion_route: string;
    diversion_geometry: GeoJsonLineString | null;
    needs_backup: boolean;
    responding_station: string;
  };
  spatial_impact_geojson: GeoJsonPolygon | null;
}

export interface GeoJsonLineString {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

// Valid values from resources.py / geo.py
export const CORRIDORS = [
  'Mysore Road',
  'Tumkur Road',
  'Bellary Road 1',
  'Bellary Road 2',
  'Hosur Road',
  'Magadi Road',
  'ORR North 1',
  'ORR East 1',
  'Non-corridor',
] as const;

export const EVENT_CAUSES = [
  'accident',
  'construction',
  'tree_fall',
  'water_logging',
  'road_conditions',
  'pot_holes',
  'congestion',
  'public_event',
  'procession',
  'protest',
  'vip_movement',
  'vehicle_breakdown',
  'others',
] as const;

export const EVENT_TYPES = ['unplanned', 'planned'] as const;

export const PRIORITIES = ['Low', 'Medium', 'High'] as const;

