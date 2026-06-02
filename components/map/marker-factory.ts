"use client";

import L, { DivIcon } from "leaflet";

export type MarkerType = "rescue" | "organization";

export type RescueLevel = "high" | "medium" | "low";

export interface MarkerOptions {
  level?: RescueLevel;
  size?: [number, number];
  anchor?: [number, number];
}

const RESCUE_COLOR: Record<RescueLevel, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

function renderRescue(level: RescueLevel): string {
  const bg = RESCUE_COLOR[level];

  return `
    <div class="flex items-center justify-center w-10 h-10 rounded-full ${bg} shadow-md border-2 border-white animate-pulse">
      <span class="text-white text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </span>
    </div>
  `;
}

/**
 * 🏢 Organization marker (pin)
 */
function renderOrganization(): string {
  return `
    <div class="flex items-center justify-center w-10 h-10 bg-primary text-white border-2 border-white shadow-md transform -rotate-45 rounded-[50%_50%_50%_0]">
      <span class="rotate-45 text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-icon lucide-building"><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 6h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 6h.01"/><path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
      </span>
    </div>
  `;
}

export function createMarkerIcon(
  type: MarkerType,
  options: MarkerOptions = {},
): DivIcon {
  let html: string;
  let iconAnchor: [number, number];

  switch (type) {
    case "rescue": {
      const level: RescueLevel = options.level ?? "medium";
      html = renderRescue(level);
      iconAnchor = options.anchor ?? [20, 20];
      break;
    }

    case "organization": {
      html = renderOrganization();
      iconAnchor = options.anchor ?? [20, 40];
      break;
    }

    default: {
      // Exhaustive check (TS strict safety)
      const _exhaustive: never = type;
      throw new Error(`Unsupported marker type: ${_exhaustive}`);
    }
  }

  return L.divIcon({
    className: "",
    html,
    iconSize: options.size ?? [25, 25],
    iconAnchor,
  });
}
