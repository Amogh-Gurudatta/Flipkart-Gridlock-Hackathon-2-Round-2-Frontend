export interface BTPEvent {
  event_id: string;
  cause: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  predictions: {
    estimated_duration_mins: number;
    severity_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  };
  deployment_recommendation: {
    traffic_cops_needed: number;
    barricades: number;
    diversion_route: string;
  };
  spatial_impact_geojson: Record<string, unknown>;
}

export const MOCK_BTP_EVENTS: BTPEvent[] = [
  {
    event_id: 'BTP-EVT-001',
    cause: 'Political Rally',
    location: {
      lat: 12.9716,
      lng: 77.5831,
      address: 'Freedom Park, Seshadri Road',
    },
    predictions: {
      estimated_duration_mins: 185,
      severity_level: 'CRITICAL',
    },
    deployment_recommendation: {
      traffic_cops_needed: 12,
      barricades: 50,
      diversion_route: 'Divert via Seshadri Road → Raj Bhavan Road → Kasturba Road',
    },
    spatial_impact_geojson: {},
  },
  {
    event_id: 'BTP-EVT-002',
    cause: 'Tree Fall',
    location: {
      lat: 13.0098,
      lng: 77.5839,
      address: 'Sankey Road, near Windsor Manor',
    },
    predictions: {
      estimated_duration_mins: 75,
      severity_level: 'HIGH',
    },
    deployment_recommendation: {
      traffic_cops_needed: 4,
      barricades: 12,
      diversion_route: 'Divert via Palace Road → Bellary Road',
    },
    spatial_impact_geojson: {},
  },
  {
    event_id: 'BTP-EVT-003',
    cause: 'Vehicle Breakdown',
    location: {
      lat: 12.9352,
      lng: 77.6245,
      address: 'Outer Ring Road, near Silk Board Junction',
    },
    predictions: {
      estimated_duration_mins: 45,
      severity_level: 'MODERATE',
    },
    deployment_recommendation: {
      traffic_cops_needed: 3,
      barricades: 8,
      diversion_route: 'Divert via Hosur Road → NICE Road connector',
    },
    spatial_impact_geojson: {},
  },
  {
    event_id: 'BTP-EVT-004',
    cause: 'Marathon / Public Run',
    location: {
      lat: 12.9762,
      lng: 77.6033,
      address: 'MG Road, Brigade Road Junction',
    },
    predictions: {
      estimated_duration_mins: 210,
      severity_level: 'HIGH',
    },
    deployment_recommendation: {
      traffic_cops_needed: 18,
      barricades: 65,
      diversion_route: 'Divert via Richmond Road → Residency Road → Airport Road',
    },
    spatial_impact_geojson: {},
  },
];
