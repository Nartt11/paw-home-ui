import type * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_TONE_SOFT, type StatusTone } from "@/lib/status-tone";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  /** undefined while loading. */
  value?: number | null;
  icon?: LucideIcon;
  /** A line under the number, e.g. the change since last month. */
  hint?: React.ReactNode;
  /** Colours the icon only when the number needs attention (value > 0). */
  tone?: StatusTone;
}

/**
 * The one KPI card of the admin area: plain-case label (Vietnamese diacritics stay readable),
 * large tabular number, neutral icon. Colour appears only when the figure needs attention.
 */
export function KpiCard({ label, value, icon: Icon, hint, tone }: KpiCardProps) {
  const attention = tone && typeof value === "number" && value > 0;
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardDescription className="text-sm">{label}</CardDescription>
          {value === undefined ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            // The small card shrinks its title through a group variant; the number overrides it.
            <CardTitle className="text-3xl leading-tight font-semibold tabular-nums group-data-[size=sm]/card:text-3xl">
              {value === null ? "—" : value.toLocaleString("vi-VN")}
            </CardTitle>
          )}
        </div>
        {Icon ? (
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg border",
              attention ? STATUS_TONE_SOFT[tone] : "bg-muted text-muted-foreground",
            )}
            aria-hidden
          >
            <Icon className="size-4" />
          </span>
        ) : null}
      </CardHeader>
      {hint ? <CardContent className="text-xs text-muted-foreground">{hint}</CardContent> : null}
    </Card>
  );
}
