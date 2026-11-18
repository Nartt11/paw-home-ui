"use client";

import { useEffect, useRef, useState } from "react";
import { Marker, type MapRef } from "react-map-gl/maplibre";

import BaseMap from "@/components/map/BaseMap";
import { RescuePin } from "@/components/map/MapPins";

interface LocationPickerMapProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange?: (coords: { latitude: number; longitude: number }) => void;
  className?: string;
  zoom?: number;
  disabled?: boolean;
}

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

function round6(value: number) {
  return Number(value.toFixed(6));
}

/** Pick a place: click the map, or drag the marker. */
export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  className = "h-72 w-full",
  zoom = 14,
  disabled = false,
}: LocationPickerMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [ready, setReady] = useState(false);

  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  const centerLat = hasCoordinates ? (latitude as number) : DEFAULT_CENTER[0];
  const centerLng = hasCoordinates ? (longitude as number) : DEFAULT_CENTER[1];

  // Follow the value when it changes from outside (address search, "use my location").
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !hasCoordinates) return;
    map.easeTo({ center: [centerLng, centerLat], duration: 500 });
  }, [ready, hasCoordinates, centerLat, centerLng]);

  return (
    <BaseMap
      ref={mapRef}
      latitude={centerLat}
      longitude={centerLng}
      zoom={zoom}
      className={className}
      onLoad={() => setReady(true)}
      onClick={
        disabled
          ? undefined
          : (event) => onChange?.({ latitude: round6(event.lngLat.lat), longitude: round6(event.lngLat.lng) })
      }
    >
      {hasCoordinates ? (
        <Marker
          latitude={latitude as number}
          longitude={longitude as number}
          draggable={!disabled}
          onDragEnd={(event) =>
            onChange?.({ latitude: round6(event.lngLat.lat), longitude: round6(event.lngLat.lng) })
          }
        >
          <RescuePin level="high" pulse={false} />
        </Marker>
      ) : null}
    </BaseMap>
  );
}
