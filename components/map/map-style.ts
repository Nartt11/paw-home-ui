"use client";

import { useSyncExternalStore } from "react";

/**
 * Basemaps from OpenFreeMap (https://openfreemap.org): free, no API key, vector tiles.
 * "3D" is the Liberty style seen at an angle, which raises its building-3d layer.
 */
export const MAP_STYLES = [
  { id: "liberty", label: "Liberty", description: "Nhiều màu, dễ nhìn", url: "https://tiles.openfreemap.org/styles/liberty", pitch: 0 },
  { id: "positron", label: "Positron", description: "Nền sáng, tối giản", url: "https://tiles.openfreemap.org/styles/positron", pitch: 0 },
  { id: "bright", label: "Bright", description: "Đường phố rõ nét", url: "https://tiles.openfreemap.org/styles/bright", pitch: 0 },
  { id: "dark", label: "Dark", description: "Nền tối", url: "https://tiles.openfreemap.org/styles/dark", pitch: 0 },
  { id: "fiord", label: "Fiord", description: "Xanh đậm, dịu mắt", url: "https://tiles.openfreemap.org/styles/fiord", pitch: 0 },
  { id: "3d", label: "3D", description: "Nhà khối nổi, nhìn nghiêng", url: "https://tiles.openfreemap.org/styles/liberty", pitch: 60 },
] as const;

export type MapStyleId = (typeof MAP_STYLES)[number]["id"];
export type MapStyleOption = (typeof MAP_STYLES)[number];

const DEFAULT_STYLE: MapStyleId = "liberty";
const STORAGE_KEY = "pawhome.mapStyle";

export function getMapStyle(id: MapStyleId): MapStyleOption {
  return MAP_STYLES.find((style) => style.id === id) ?? MAP_STYLES[0];
}

// One choice for every map on the site: switching on one map switches them all,
// and the choice is remembered on this device.
const listeners = new Set<() => void>();
let current: MapStyleId | null = null;

function isStyleId(value: unknown): value is MapStyleId {
  return MAP_STYLES.some((style) => style.id === value);
}

function read(): MapStyleId {
  if (current) return current;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    current = isStyleId(saved) ? saved : DEFAULT_STYLE;
  } catch {
    current = DEFAULT_STYLE;
  }
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setMapStyle(id: MapStyleId) {
  current = id;
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // private mode or storage blocked: the choice still applies until reload
  }
  listeners.forEach((listener) => listener());
}

export function useMapStyle(): [MapStyleOption, (id: MapStyleId) => void] {
  const id = useSyncExternalStore(subscribe, read, () => DEFAULT_STYLE);
  return [getMapStyle(id), setMapStyle];
}
