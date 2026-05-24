"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

import { createMarkerIcon } from "@/components/map/marker-factory";

interface LocationPickerMapProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange?: (coords: { latitude: number; longitude: number }) => void;
  className?: string;
  zoom?: number;
  disabled?: boolean;
}

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

function MapClickHandler({
  onChange,
  disabled,
}: {
  onChange?: (coords: { latitude: number; longitude: number }) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click(event) {
      if (disabled) return;
      onChange?.({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

function MapCenterSync({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  className = "h-72 w-full",
  zoom = 14,
  disabled = false,
}: LocationPickerMapProps) {
  const markerRef = useRef<LeafletMarker | null>(null);

  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  const center = useMemo<[number, number]>(() => {
    if (hasCoordinates) {
      return [latitude as number, longitude as number];
    }

    return DEFAULT_CENTER;
  }, [hasCoordinates, latitude, longitude]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapCenterSync center={center} />
      <MapClickHandler onChange={onChange} disabled={disabled} />

      {hasCoordinates ? (
        <Marker
          ref={markerRef}
          position={[latitude as number, longitude as number]}
          icon={createMarkerIcon("organization")}
          draggable={!disabled}
          eventHandlers={{
            dragend: () => {
              const marker = markerRef.current;
              if (!marker) return;

              const position = marker.getLatLng();
              onChange?.({
                latitude: Number(position.lat.toFixed(6)),
                longitude: Number(position.lng.toFixed(6)),
              });
            },
          }}
        />
      ) : null}
    </MapContainer>
  );
}
