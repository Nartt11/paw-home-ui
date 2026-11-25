"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Marker, Popup, type MapRef } from "react-map-gl/maplibre";

import BaseMap from "@/components/map/BaseMap";
import { OrganizationPin, RescuePin, UserPin, type RescueLevel } from "@/components/map/MapPins";
import type { Organization } from "@/types/organization.type";
import type { RescueCasePriority } from "@/types/rescue-case.type";

export interface RescueMapMarker {
  caseId: string;
  caseCode?: string;
  latitude: number;
  longitude: number;
  priority?: RescueCasePriority;
  status?: string;
  species?: string;
  reportedAt?: string;
}

export interface OrganizationMapMarker {
  organizationId: string;
  name: string;
  latitude: number;
  longitude: number;
  type?: Organization["type"];
  provinceName?: string;
  wardName?: string;
}

interface MapProps {
  rescueMarkers?: RescueMapMarker[];
  organizationMarkers?: OrganizationMapMarker[];
  loading?: boolean;
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  showUserLocation?: boolean;
  onRescueMarkerClick?: (caseId: string) => void;
  onOrganizationMarkerClick?: (organizationId: string) => void;
  zoomToLocation?: { latitude: number; longitude: number; zoom?: number } | null;
  /** The part of the map on screen, after every pan or zoom. */
  onBoundsChange?: (bounds: MapBounds) => void;
  /** Group nearby rescue markers when zoomed out (default on). */
  cluster?: boolean;
  /** Colour key in the corner (default on). */
  legend?: boolean;
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

type Cluster = { key: string; latitude: number; longitude: number; markers: RescueMapMarker[] };

const LEVEL_RANK: Record<RescueLevel, number> = { low: 0, medium: 1, high: 2 };
const LEVEL_BG: Record<RescueLevel, string> = { high: "bg-red-600", medium: "bg-amber-500", low: "bg-emerald-600" };

/**
 * Groups markers that would overlap on screen: one cell is about 64px at this zoom.
 * Above zoom 12 every marker stands alone.
 */
function clusterMarkers(markers: RescueMapMarker[], zoom: number): Cluster[] {
  if (zoom >= 12) {
    return markers.map((m) => ({ key: m.caseId, latitude: m.latitude, longitude: m.longitude, markers: [m] }));
  }
  const cell = 90 / 2 ** zoom; // 64px in degrees of longitude at this zoom
  const groups = new globalThis.Map<string, RescueMapMarker[]>();
  for (const m of markers) {
    const key = `${Math.floor(m.longitude / cell)}:${Math.floor(m.latitude / cell)}`;
    groups.set(key, [...(groups.get(key) ?? []), m]);
  }
  return [...groups.entries()].map(([key, group]) => ({
    key,
    latitude: group.reduce((s, m) => s + m.latitude, 0) / group.length,
    longitude: group.reduce((s, m) => s + m.longitude, 0) / group.length,
    markers: group,
  }));
}

function Legend() {
  const items: Array<[string, string]> = [
    ["bg-red-600", "Khẩn cấp, cao"],
    ["bg-amber-500", "Bình thường"],
    ["bg-emerald-600", "Thấp"],
    ["bg-primary", "Trung tâm"],
  ];
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg bg-white/95 p-3 text-xs shadow-md" aria-label="Chú giải bản đồ">
      <ul className="space-y-1.5">
        {items.map(([bg, label]) => (
          <li key={label} className="flex items-center gap-2">
            <span className={`size-3 rounded-full border-2 border-white shadow ${bg}`} aria-hidden />
            {label}
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span className="grid size-4 place-items-center rounded-full bg-slate-700 text-[9px] font-bold text-white" aria-hidden>3</span>
          Nhiều ca gần nhau
        </li>
      </ul>
    </div>
  );
}

const DEFAULT_CENTER: [number, number] = [10.8702, 106.8029];
const DEFAULT_ZOOM = 13;

function hasValidCoordinates(latitude: unknown, longitude: unknown): boolean {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

function getPriorityLevel(priority?: RescueCasePriority): RescueLevel {
  if (priority === "CRITICAL" || priority === "HIGH") return "high";
  if (priority === "NORMAL") return "medium";
  return "low";
}

export default function MapRescue({
  rescueMarkers = [],
  organizationMarkers = [],
  loading = false,
  className = "h-screen w-full",
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  showUserLocation = true,
  onRescueMarkerClick,
  onOrganizationMarkerClick,
  zoomToLocation,
  onBoundsChange,
  cluster = true,
  legend = true,
}: MapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);

  /** Reads the view after load and after every pan or zoom. */
  const readView = (map: MapRef) => {
    setZoom(map.getZoom());
    const b = map.getBounds();
    onBoundsChange?.({ minLat: b.getSouth(), maxLat: b.getNorth(), minLng: b.getWest(), maxLng: b.getEast() });
  };
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showUserPopup, setShowUserPopup] = useState(false);

  const validRescueMarkers = useMemo(
    () => rescueMarkers.filter((m) => hasValidCoordinates(m.latitude, m.longitude)),
    [rescueMarkers],
  );
  const validOrganizationMarkers = useMemo(
    () => organizationMarkers.filter((m) => hasValidCoordinates(m.latitude, m.longitude)),
    [organizationMarkers],
  );

  // Show every marker: one point gets a close-up, several get a frame around them.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const points = [...validRescueMarkers, ...validOrganizationMarkers].map(
      (m) => [m.longitude, m.latitude] as [number, number],
    );
    if (points.length === 0) return;
    if (points.length === 1) {
      map.easeTo({ center: points[0], zoom: Math.max(map.getZoom(), 13) });
      return;
    }
    const lngs = points.map((p) => p[0]);
    const lats = points.map((p) => p[1]);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 48, maxZoom: 15, duration: 600 },
    );
  }, [ready, validRescueMarkers, validOrganizationMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !zoomToLocation) return;
    const { latitude, longitude, zoom = 16 } = zoomToLocation;
    map.flyTo({ center: [longitude, latitude], zoom, duration: 1000 });
  }, [ready, zoomToLocation]);

  useEffect(() => {
    if (!showUserLocation || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
      (error) => console.warn("Geolocation error:", error.message),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [showUserLocation]);

  return (
    <div className={`relative z-0 ${className}`}>
      <BaseMap
        ref={mapRef}
        latitude={initialCenter[0]}
        longitude={initialCenter[1]}
        zoom={initialZoom}
        className="h-full w-full"
        onLoad={() => {
          setReady(true);
          if (mapRef.current) readView(mapRef.current);
        }}
        onMoveEnd={readView}
      >
        {userLocation ? (
          <Marker
            latitude={userLocation[0]}
            longitude={userLocation[1]}
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setShowUserPopup(true);
            }}
          >
            <UserPin />
          </Marker>
        ) : null}
        {userLocation && showUserPopup ? (
          <Popup
            latitude={userLocation[0]}
            longitude={userLocation[1]}
            offset={14}
            closeOnClick={false}
            onClose={() => setShowUserPopup(false)}
          >
            <p className="font-semibold">Vị trí của bạn</p>
            <p className="text-xs text-gray-600">
              {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
            </p>
          </Popup>
        ) : null}

        {!loading &&
          validOrganizationMarkers.map((marker) => (
            <Marker
              key={marker.organizationId}
              latitude={marker.latitude}
              longitude={marker.longitude}
              anchor="bottom"
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                onOrganizationMarkerClick?.(marker.organizationId);
              }}
              style={{ cursor: "pointer" }}
            >
              <span title={marker.name}>
                <OrganizationPin />
              </span>
            </Marker>
          ))}

        {!loading &&
          (cluster ? clusterMarkers(validRescueMarkers, zoom) : clusterMarkers(validRescueMarkers, 99)).map((group) => {
            if (group.markers.length === 1) {
              const marker = group.markers[0];
              return (
                <Marker
                  key={marker.caseId}
                  latitude={marker.latitude}
                  longitude={marker.longitude}
                  onClick={(event) => {
                    event.originalEvent.stopPropagation();
                    onRescueMarkerClick?.(marker.caseId);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <RescuePin level={getPriorityLevel(marker.priority)} />
                </Marker>
              );
            }
            // A group takes the colour of its most urgent case; a click zooms in on it.
            const level = group.markers
              .map((m) => getPriorityLevel(m.priority))
              .reduce((a, b) => (LEVEL_RANK[b] > LEVEL_RANK[a] ? b : a), "low" as RescueLevel);
            const size = group.markers.length < 10 ? "size-9" : "size-11";
            return (
              <Marker
                key={`cluster-${group.key}`}
                latitude={group.latitude}
                longitude={group.longitude}
                onClick={(event) => {
                  event.originalEvent.stopPropagation();
                  const lngs = group.markers.map((m) => m.longitude);
                  const lats = group.markers.map((m) => m.latitude);
                  mapRef.current?.fitBounds(
                    [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                    { padding: 80, maxZoom: 16, duration: 600 },
                  );
                }}
                style={{ cursor: "pointer" }}
              >
                <span
                  role="img"
                  aria-label={`${group.markers.length} ca cứu hộ ở gần nhau`}
                  className={`grid ${size} place-items-center rounded-full border-2 border-white text-sm font-bold text-white shadow-md ${LEVEL_BG[level]}`}
                >
                  {group.markers.length}
                </span>
              </Marker>
            );
          })}
      </BaseMap>

      {legend && !loading ? <Legend /> : null}

      {loading ? (
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-lg bg-white p-3 shadow-lg">
          <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : null}
    </div>
  );
}
