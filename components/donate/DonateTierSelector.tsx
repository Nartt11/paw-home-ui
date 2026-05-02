"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DonateTier } from "@/types/donate.type";

function toneToBorder(tone: DonateTier["tone"], selected: boolean) {
  if (!selected) return "border-border";
  switch (tone) {
    case "sky":
      return "border-sky-500";
    case "emerald":
      return "border-emerald-500";
    case "orange":
      return "border-primary";
    case "rose":
      return "border-rose-500";
    case "slate":
      return "border-foreground";
    default:
      return "border-primary";
  }
}

function toneToBg(tone: DonateTier["tone"], selected: boolean) {
  if (!selected) return "bg-card";
  switch (tone) {
    case "sky":
      return "bg-sky-50";
    case "emerald":
      return "bg-emerald-50";
    case "orange":
      return "bg-accent/10";
    case "rose":
      return "bg-rose-50";
    case "slate":
      return "bg-muted";
    default:
      return "bg-muted";
  }
}

function toneToText(tone: DonateTier["tone"], selected: boolean) {
  if (!selected) return "text-foreground";
  switch (tone) {
    case "sky":
      return "text-sky-700";
    case "emerald":
      return "text-emerald-700";
    case "orange":
      return "text-primary";
    case "rose":
      return "text-rose-700";
    case "slate":
      return "text-foreground";
    default:
      return "text-primary";
  }
}

export function DonateTierSelector({
  tiers,
  selectedTierId,
  onSelectTier,
}: {
  tiers: DonateTier[];
  selectedTierId: string;
  onSelectTier: (id: string) => void;
}) {
  return (
    <Card className="rounded-3xl shadow-sm ring-1 ring-border">
      <CardHeader>
        <CardTitle className="text-base font-extrabold text-foreground">
          Chọn mức ủng hộ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tiers.map((t) => {
            const selected = selectedTierId === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTier(t.id)}
                className={
                  "relative rounded-2xl border-2 p-4 text-center transition " +
                  toneToBorder(t.tone, selected) +
                  " " +
                  toneToBg(t.tone, selected)
                }
              >
                {t.popular ? (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground hover:bg-primary">
                    PHỔ BIẾN NHẤT
                  </Badge>
                ) : null}

                <div className="text-2xl">{t.emoji}</div>
                <div
                  className={
                    "mt-2 text-sm font-black " + toneToText(t.tone, selected)
                  }
                >
                  {t.label}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {t.description}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
