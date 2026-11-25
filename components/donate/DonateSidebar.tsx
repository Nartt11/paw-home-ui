import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { DonateImpactBar, DonateImpactItem } from "@/types/donate.type";

function toneToProgress(tone: DonateImpactBar["tone"]) {
  switch (tone) {
    case "orange":
      return "bg-primary";
    case "emerald":
      return "bg-emerald-500";
    case "sky":
      return "bg-sky-500";
    case "sun":
      return "bg-yellow-400";
    default:
      return "bg-muted-foreground";
  }
}

export function DonateSidebar({
  impactBars,
  impacts,
}: {
  impactBars: DonateImpactBar[];
  impacts: DonateImpactItem[];
}) {
  return (
    <aside className="space-y-4">
      <Card className="rounded-3xl shadow-sm ring-1 ring-border">
        <CardHeader>
          <CardTitle className="text-sm font-extrabold text-foreground">
            💡 Ủng hộ để làm gì?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {impactBars.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground">{b.label}</span>
                <span className="font-bold text-foreground">{b.percent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={"h-full rounded-full " + toneToProgress(b.tone)}
                  style={{ width: `${b.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm ring-1 ring-border">
        <CardHeader>
          <CardTitle className="text-sm font-extrabold text-foreground">
            🐾 Tác động thực tế
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {impacts.map((i) => (
            <div key={i.description} className="flex gap-3">
              <span className="text-lg">{i.emoji}</span>
              <div>
                <div className="text-sm font-bold text-primary">{i.amount}</div>
                <div className="text-xs text-muted-foreground">
                  {i.description}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </aside>
  );
}
