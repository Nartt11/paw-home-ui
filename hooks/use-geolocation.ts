"use client";

import { useCallback, useState } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
}

type GeolocationState =
  | { status: "idle" | "locating" }
  | { status: "ready"; coordinates: Coordinates }
  | { status: "denied" | "unavailable" };

/**
 * The browser's position, asked for only when the user taps something: a permission prompt on page
 * load gets refused out of habit.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: "idle" });

  /** Asks for the position; `onReady` also gets it, for callers that act on it at once. */
  const locateThen = useCallback((onReady?: (coordinates: Coordinates) => void) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unavailable" });
      return;
    }

    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
        setState({ status: "ready", coordinates });
        onReady?.(coordinates);
      },
      (error) =>
        setState({
          status:
            error.code === error.PERMISSION_DENIED ? "denied" : "unavailable",
        }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  // Safe as an onClick handler: it ignores the event.
  const locate = useCallback(() => locateThen(), [locateThen]);

  return {
    status: state.status,
    coordinates: state.status === "ready" ? state.coordinates : undefined,
    locate,
    locateThen,
  };
}
