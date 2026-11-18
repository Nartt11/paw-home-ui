"use client";

import dynamic from "next/dynamic";

// MapLibre needs the browser (WebGL, window), so the map is never rendered on the server.
const BaseMap = dynamic(() => import("@/components/map/BaseMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-xl bg-slate-800" />,
});

/** A still view of Vietnam in the visitor's map style; the real map is one click away. */
export default function HomeMapPreview() {
  return (
    <div role="img" aria-label="Bản đồ Việt Nam. Mở trang Bản đồ để xem các ca cứu hộ." className="h-full w-full">
      <BaseMap latitude={16.2} longitude={106.3} zoom={4.4} interactive={false} className="h-full w-full rounded-xl" />
    </div>
  );
}
