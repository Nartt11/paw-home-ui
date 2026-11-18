import { AlertCircle, Building2, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

export type RescueLevel = "high" | "medium" | "low";

const RESCUE_COLOR: Record<RescueLevel, string> = {
  high: "bg-red-600",
  medium: "bg-amber-500",
  low: "bg-emerald-600",
};

const RESCUE_LABEL: Record<RescueLevel, string> = {
  high: "Ca khẩn cấp",
  medium: "Ca cần giúp",
  low: "Ca ít gấp",
};

/** A rescue case; the colour says how urgent it is. Anchored at its centre. */
export function RescuePin({ level = "medium", pulse = true }: { level?: RescueLevel; pulse?: boolean }) {
  return (
    <span
      role="img"
      aria-label={RESCUE_LABEL[level]}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border-2 border-white text-white shadow-md",
        RESCUE_COLOR[level],
        pulse && level === "high" && "animate-pulse",
      )}
    >
      <AlertCircle className="size-5" strokeWidth={2.5} aria-hidden />
    </span>
  );
}

/** A shelter or vet clinic. Anchored at its bottom tip. */
export function OrganizationPin() {
  return (
    <span
      role="img"
      aria-label="Trung tâm cứu hộ"
      className="flex size-9 -rotate-45 items-center justify-center rounded-[50%_50%_50%_0] border-2 border-white bg-primary text-white shadow-md"
    >
      <Building2 className="size-5 rotate-45" aria-hidden />
    </span>
  );
}

/** Where the viewer is. */
export function UserPin() {
  return (
    <span role="img" aria-label="Vị trí của bạn" className="relative flex size-5 items-center justify-center">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-60" />
      <span className="relative inline-flex size-4 rounded-full border-2 border-white bg-sky-600 shadow" />
    </span>
  );
}

/** A plain location pin, for a single place. Anchored at its bottom tip. */
export function PlacePin() {
  return <MapPin aria-hidden className="size-9 fill-red-600 text-white drop-shadow-md" strokeWidth={1.5} />;
}
