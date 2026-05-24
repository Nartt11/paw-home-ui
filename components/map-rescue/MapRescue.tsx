"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { createMarkerIcon } from "@/components/map/marker-factory";
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
}

const DEFAULT_CENTER: [number, number] = [10.8702, 106.8029];
const DEFAULT_ZOOM = 13;

function hasValidCoordinates(
  latitude: unknown,
  longitude: unknown,
): latitude is number {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

function getPriorityLevel(
  priority?: RescueCasePriority,
): "high" | "medium" | "low" {
  if (priority === "CRITICAL" || priority === "HIGH") {
    return "high";
  }
  if (priority === "NORMAL") {
    return "medium";
  }
  return "low";
}

function FitMapBounds({
  rescueMarkers,
  organizationMarkers,
}: Pick<MapProps, "rescueMarkers" | "organizationMarkers">) {
  const map = useMap();

  const points = useMemo(() => {
    return [
      ...(rescueMarkers ?? [])
        .filter((marker) =>
          hasValidCoordinates(marker.latitude, marker.longitude),
        )
        .map((marker) => [marker.latitude, marker.longitude] as [number, number]),
      ...(organizationMarkers ?? [])
        .filter((marker) =>
          hasValidCoordinates(marker.latitude, marker.longitude),
        )
        .map((marker) => [marker.latitude, marker.longitude] as [number, number]),
    ];
  }, [organizationMarkers, rescueMarkers]);

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], Math.max(map.getZoom(), 13));
      return;
    }

    map.fitBounds(points, {
      padding: [40, 40],
    });
  }, [map, points]);

  return null;
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
}: MapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const validRescueMarkers = useMemo(
    () =>
      rescueMarkers.filter((marker) =>
        hasValidCoordinates(marker.latitude, marker.longitude),
      ),
    [rescueMarkers],
  );
  const validOrganizationMarkers = useMemo(
    () =>
      organizationMarkers.filter((marker) =>
        hasValidCoordinates(marker.latitude, marker.longitude),
      ),
    [organizationMarkers],
  );

  useEffect(() => {
    if (!showUserLocation || !("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userCoords: [number, number] = [latitude, longitude];
        setUserLocation(userCoords);
        setMapCenter(userCoords);
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, [showUserLocation]);

  return (
    <div className={`relative z-0 ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={initialZoom}
        scrollWheelZoom
        className="z-0 h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap & Carto"
        />

        <FitMapBounds
          rescueMarkers={validRescueMarkers}
          organizationMarkers={validOrganizationMarkers}
        />

        {userLocation && (
          <Marker position={userLocation} icon={createMarkerIcon("organization")}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">Vị trí của bạn</p>
                <p className="text-xs text-gray-600">
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {!loading &&
          validOrganizationMarkers.map((marker) => (
            <Marker
              key={marker.organizationId}
              position={[marker.latitude, marker.longitude]}
              icon={createMarkerIcon("organization")}
              eventHandlers={{
                click: () => onOrganizationMarkerClick?.(marker.organizationId),
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{marker.name}</p>
                  <p className="text-sm">{marker.type ?? "ORGANIZATION"}</p>
                  <p className="text-xs text-gray-500">
                    {[marker.wardName, marker.provinceName]
                      .filter(Boolean)
                      .join(", ") || "Chưa có địa chỉ"}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {!loading &&
          validRescueMarkers.map((marker) => (
            <Marker
              key={marker.caseId}
              position={[marker.latitude, marker.longitude]}
              icon={createMarkerIcon("rescue", {
                level: getPriorityLevel(marker.priority),
              })}
              eventHandlers={{
                click: () => onRescueMarkerClick?.(marker.caseId),
              }}
            >
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold">{marker.caseCode ?? marker.caseId}</div>
                  <div className="text-sm">Loài: {marker.species ?? "—"}</div>
                  <div className="text-xs text-gray-500">
                    {marker.reportedAt
                      ? new Date(marker.reportedAt).toLocaleDateString("vi-VN")
                      : "Chưa có thời gian báo cáo"}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {loading ? (
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg bg-white p-3 shadow-lg">
          <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : null}
    </div>
  );
}
