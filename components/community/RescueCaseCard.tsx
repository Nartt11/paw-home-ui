"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, PawPrint, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";
import {
  RESCUE_PRIORITY_LABEL,
  RESCUE_STATUS_LABEL,
  formatDistance,
  isOpenRescueStatus,
  type RescueCaseBrief,
} from "@/lib/rescue-case-display";
import { cn } from "@/lib/utils";

export interface RescueCaseCardProps {
  rescueCase: RescueCaseBrief;
  /** Shown only while the case still needs help. */
  onShare?: (rescueCase: RescueCaseBrief) => void;
  className?: string;
}

/** A rescue case as it appears inside the feed: enough to decide to help, without opening the map. */
export function RescueCaseCard({
  rescueCase,
  onShare,
  className,
}: RescueCaseCardProps) {
  const open = isOpenRescueStatus(rescueCase.status);
  const urgent = rescueCase.priority === "CRITICAL" || rescueCase.priority === "HIGH";
  const distance = formatDistance(rescueCase.distanceMeters);

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-3",
        open ? "border-orange-200 bg-orange-50/60" : "border-border bg-muted/40",
        className,
      )}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {rescueCase.imageUrl ? (
          <Image
            src={rescueCase.imageUrl}
            alt={`Ảnh ca ${rescueCase.caseCode ?? ""}`}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <PawPrint className="size-6" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground">
            Ca cứu hộ {rescueCase.caseCode}
          </span>
          {rescueCase.status ? (
            <Badge variant={open ? "default" : "secondary"}>
              {RESCUE_STATUS_LABEL[rescueCase.status]}
            </Badge>
          ) : null}
          {open && urgent && rescueCase.priority ? (
            <Badge variant="destructive">
              {RESCUE_PRIORITY_LABEL[rescueCase.priority]}
            </Badge>
          ) : null}
        </div>

        {rescueCase.species ? (
          <p className="truncate text-sm font-medium text-foreground">
            {rescueCase.species}
          </p>
        ) : null}

        {rescueCase.locationText ? (
          <p className="flex items-start gap-1 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 size-3 shrink-0" />
            <span className="line-clamp-2">
              {rescueCase.locationText}
              {distance ? ` · cách bạn ${distance}` : ""}
            </span>
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" variant="outline">
            <Link href={APP_ROUTES.MAP}>Xem trên bản đồ</Link>
          </Button>
          {open && onShare ? (
            <Button size="sm" type="button" onClick={() => onShare(rescueCase)}>
              <Share2 className="size-3.5" />
              Chia sẻ
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
