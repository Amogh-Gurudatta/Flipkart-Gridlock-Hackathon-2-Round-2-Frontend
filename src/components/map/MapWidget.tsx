'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useData, type IncidentData } from '@/context/DataContext';

// Custom controller to handle smooth panning when activeNode changes
function MapController({ activeNode }: { activeNode: IncidentData | null }) {
  const map = useMap();

  useEffect(() => {
    if (activeNode) {
      map.flyTo([activeNode.latitude, activeNode.longitude], 15, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [activeNode, map]);

  return null;
}

/**
 * Listens for map-level clicks and writes the latlng into context so the
 * Forecast Engine form can auto-fill the location.
 *
 * `markerJustClicked` is a ref owned by MapWidget. The marker's own click
 * handler sets it to `true` synchronously before the map click fires (Leaflet
 * always dispatches layer events before map events in the same tick). We check
 * and reset the flag here so that clicking a circle never also places a draft
 * location pin.
 */
function ClickCatcher({
  markerJustClicked,
}: {
  markerJustClicked: React.MutableRefObject<boolean>;
}) {
  const { setDraftLocation } = useData();
  useMapEvents({
    click(e) {
      if (markerJustClicked.current) {
        markerJustClicked.current = false;
        return;
      }
      setDraftLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface MapWidgetProps {
  activeNode: IncidentData | null;
  onSelectNode: (node: IncidentData) => void;
  accentColor: string;
}

export default function MapWidget({
  activeNode,
  onSelectNode,
  accentColor,
}: MapWidgetProps) {
  const { incidents, lastForecast, draftLocation, setDraftLocation } = useData();

  // Semaphore: set to true by the marker click handler so ClickCatcher can
  // skip the subsequent (spurious) map-level click that Leaflet always fires.
  const markerJustClicked = useRef(false);

  // ESC key clears the pending (draft) location marker
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDraftLocation(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setDraftLocation]);

  // Bengaluru, India center
  const initialCenter: [number, number] = [12.9716, 77.5946];

  return (
    <div className="absolute inset-0 w-full h-full bg-black z-0">
      <MapContainer
        center={initialCenter}
        zoom={12}
        zoomControl={false}
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapController activeNode={activeNode} />
        <ClickCatcher markerJustClicked={markerJustClicked} />

        {/* ── Incident markers ───────────────────────────────────────────── */}
        {incidents.map((node) => {
          const isActive = activeNode?.id === node.id;
          return (
            <CircleMarker
              key={node.id}
              center={[node.latitude, node.longitude]}
              radius={isActive ? 12 : 6}
              pathOptions={{
                color: accentColor,
                fillColor: accentColor,
                fillOpacity: isActive ? 0.8 : 0.4,
                weight: isActive ? 2 : 1,
              }}
              eventHandlers={{
                click: () => {
                  // Flag MUST be set before calling onSelectNode so that
                  // ClickCatcher's map-click handler (which fires right after)
                  // sees it and bails out without placing a draft marker.
                  markerJustClicked.current = true;
                  onSelectNode(node);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={isActive}>
                <span className="font-mono text-[9px] uppercase font-bold tracking-tighter">
                  {node.incident_type || node.id}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* ── Live forecast: spatial impact zone (polygon from backend) ─── */}
        {lastForecast?.spatial_impact_geojson && (
          <GeoJSON
            // key forces re-render whenever the forecast changes
            key={`impact-${lastForecast.event_id}`}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={lastForecast.spatial_impact_geojson as any}
            style={{
              color: '#ef4444',
              weight: 1.5,
              fillColor: '#ef4444',
              fillOpacity: 0.12,
              dashArray: '4 4',
            }}
          />
        )}

        {/* ── Live forecast: OSRM diversion route (LineString from backend) */}
        {lastForecast?.deployment_recommendation.diversion_geometry && (
          <GeoJSON
            key={`diversion-${lastForecast.event_id}`}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={lastForecast.deployment_recommendation.diversion_geometry as any}
            style={{
              color: '#22c55e',
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}

        {/* ── Draft location marker (set by map click) ────────────────── */}
        {draftLocation && (
          <CircleMarker
            center={[draftLocation.lat, draftLocation.lng]}
            radius={8}
            pathOptions={{
              color: '#ffffff',
              fillColor: '#facc15',
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
              <span className="font-mono text-[9px] uppercase font-bold tracking-tighter">
                PENDING LOCATION
              </span>
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
