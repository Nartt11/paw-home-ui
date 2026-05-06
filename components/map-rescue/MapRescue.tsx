"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createMarkerIcon } from "../map/marker-factory";
import type { RescueCaseMarkerDto } from "@/services/rescue-case/rescue-case-dto";

interface MapProps {
  markers?: RescueCaseMarkerDto[];
  loading?: boolean;
}

const DEFAULT_CENTER: [number, number] = [10.8702, 106.8029]; // HCMC
const DEFAULT_ZOOM = 13;

function getPriorityLevel(
  priority: RescueCaseMarkerDto["priority"],
): "high" | "medium" | "low" {
  if (priority === "CRITICAL" || priority === "HIGH") {
    return "high";
  }
  if (priority === "NORMAL") {
    return "medium";
  }
  return "low";
}

export default function Map({ markers = [], loading = false }: MapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    // Request user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords: [number, number] = [latitude, longitude];
          setUserLocation(userCoords);
          setMapCenter(userCoords);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          // Keep default center if location not available
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        },
      );
    }
  }, []);

  return (
    <MapContainer
      center={mapCenter}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      className="w-full h-screen"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap & Carto"
      />

      {/* User location marker */}
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

      {/* Rescue case markers from API */}
      {!loading &&
        markers.map((marker) => (
          <Marker
            key={marker.caseId}
            position={[marker.latitude, marker.longitude]}
            icon={createMarkerIcon("rescue", {
              level: getPriorityLevel(marker.priority),
            })}
          >
            <Popup>
              <div className="space-y-2">
                <div className="font-semibold">{marker.caseId}</div>
                <div className="text-sm">Loài: {marker.species}</div>
                <div className="text-xs text-gray-500">
                  {new Date(marker.reportedAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-white p-3 shadow-lg z-50">
          <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}
    </MapContainer>
  );
}
