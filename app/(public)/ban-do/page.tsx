"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map-rescue/MapRescue"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function MapRescuePage() {
  return (
    <div className="flex h-full">
      <aside className="absolute right-0 h-full w-105 bg-white shadow-xl z-[1000] border-l">
        Nội dung sidebar
      </aside>

      <main className="flex-1">
        <Map />
      </main>
    </div>
  );
}
