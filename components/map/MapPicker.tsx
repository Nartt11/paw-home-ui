"use client";

import { Marker } from "react-map-gl/maplibre";

import BaseMap from "@/components/map/BaseMap";
import { PlacePin } from "@/components/map/MapPins";

export interface Props {
  title: string;
  latitude: number;
  longitude: number;
}

function hasValidCoordinates(latitude: unknown, longitude: unknown) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

/** Shows one place; scrolling the page does not zoom it. */
export default function MapPicker({ title, latitude, longitude }: Props) {
  if (!hasValidCoordinates(latitude, longitude)) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-muted/20 px-4 text-center text-sm text-muted-foreground">
        Chưa có tọa độ hợp lệ để hiển thị bản đồ.
      </div>
    );
  }

  return (
    <BaseMap latitude={latitude} longitude={longitude} zoom={15} scrollZoom={false} className="h-64 w-full">
      <Marker latitude={latitude} longitude={longitude} anchor="bottom">
        <span title={title}>
          <PlacePin />
        </span>
      </Marker>
    </BaseMap>
  );
}
