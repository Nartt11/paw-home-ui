"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef, type ReactNode, type Ref } from "react";
import Map, {
  NavigationControl,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";

import type maplibregl from "maplibre-gl";

import { cn } from "@/lib/utils";

import { useMapStyle } from "./map-style";
import { MapStyleSwitcher } from "./MapStyleSwitcher";

const VIETNAMESE_NAME = ["coalesce", ["get", "name:vi"], ["get", "name"]];

/**
 * OpenFreeMap styles label places with mixed languages ("Ho Chi Minh City"). The tiles carry
 * name:vi, so every label that shows a place name uses it, falling back to the local name.
 * Road numbers and house numbers are left as they are.
 */
function applyVietnameseLabels(map: maplibregl.Map) {
  for (const layer of map.getStyle()?.layers ?? []) {
    if (layer.type !== "symbol") continue;
    const field = map.getLayoutProperty(layer.id, "text-field");
    if (field && JSON.stringify(field).includes("name")) {
      map.setLayoutProperty(layer.id, "text-field", VIETNAMESE_NAME);
    }
  }
}

export interface BaseMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  children?: ReactNode;
  /** Off for small previews where scrolling the page must not zoom the map. */
  scrollZoom?: boolean;
  /** Off for decorative maps: no panning, no zooming, no controls. */
  interactive?: boolean;
  showStyleSwitcher?: boolean;
  onClick?: (event: MapLayerMouseEvent) => void;
  /** Called once the map can be moved (fitBounds, flyTo). */
  onLoad?: () => void;
  ref?: Ref<MapRef>;
}

/**
 * Every map of the site: OpenFreeMap vector tiles through MapLibre, with the zoom buttons
 * and the style switcher. Children are markers and popups from react-map-gl.
 */
export default function BaseMap({
  latitude,
  longitude,
  zoom = 13,
  className = "h-72 w-full",
  children,
  scrollZoom = true,
  interactive = true,
  showStyleSwitcher = true,
  onClick,
  onLoad,
  ref,
}: BaseMapProps) {
  const [style] = useMapStyle();
  const innerRef = useRef<MapRef | null>(null);

  // Tilt the camera for 3D, put it back flat for the other styles.
  useEffect(() => {
    const map = innerRef.current;
    if (!map) return;
    map.easeTo({ pitch: style.pitch, bearing: style.pitch ? -20 : 0, duration: 600 });
  }, [style.pitch]);

  const setRef = (map: MapRef | null) => {
    innerRef.current = map;
    if (typeof ref === "function") ref(map);
    else if (ref) (ref as { current: MapRef | null }).current = map;
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Map
        ref={setRef}
        initialViewState={{ latitude, longitude, zoom, pitch: style.pitch, bearing: style.pitch ? -20 : 0 }}
        mapStyle={style.url}
        style={{ width: "100%", height: "100%" }}
        scrollZoom={interactive && scrollZoom}
        interactive={interactive}
        maxPitch={70}
        // Credit stays one tap away (OpenFreeMap, OpenMapTiles, OpenStreetMap) without covering buttons.
        attributionControl={{ compact: true }}
        onClick={onClick}
        onLoad={(event) => {
          const map = event.target;
          applyVietnameseLabels(map);
          // A new style replaces every layer, so relabel after each switch.
          map.on("style.load", () => applyVietnameseLabels(map));
          onLoad?.();
        }}
        cursor={onClick ? "crosshair" : undefined}
      >
        {interactive ? <NavigationControl position="top-left" visualizePitch /> : null}
        {children}
      </Map>
      {showStyleSwitcher && interactive ? (
        <MapStyleSwitcher className="absolute right-3 top-3 z-10" />
      ) : null}
    </div>
  );
}
