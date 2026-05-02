import * as React from "react";
import { CheckCircle2, Shield, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type {
  DonateDonor,
  DonateImpactBar,
  DonateImpactItem,
  DonateTrustBadge,
} from "@/types/donate.type";

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

function trustIcon(name: DonateTrustBadge["icon"]) {
  switch (name) {
    case "shield":
      return Shield;
    case "check":
      return CheckCircle2;
    case "users":
      return Users;
  }
}

function trustTone(tone: DonateTrustBadge["tone"]) {
  switch (tone) {
    case "emerald":
      return "bg-emerald-500/10 text-emerald-600";
    case "sky":
      return "bg-sky-500/10 text-sky-600";
    case "orange":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function DonateSidebar({
  impactBars,
  impacts,
  trustBadges,
  donors,
}: {
  impactBars: DonateImpactBar[];
  impacts: DonateImpactItem[];
  trustBadges: DonateTrustBadge[];
  donors: DonateDonor[];
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

      <Card className="rounded-3xl shadow-sm ring-1 ring-border">
        <CardContent className="p-6">
          <div className="space-y-4">
            {trustBadges.map((b) => {
              const Icon = trustIcon(b.icon);

              return (
                <div key={b.title} className="flex items-start gap-3">
                  <div
                    className={
                      "grid h-9 w-9 place-items-center rounded-xl " +
                      trustTone(b.tone)
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {b.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {b.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm ring-1 ring-border">
        <CardHeader>
          <CardTitle className="text-sm font-extrabold text-foreground">
            ❤️ Nhà hảo tâm gần đây
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {donors.map((d) => (
            <div
              key={`${d.name}-${d.time}-${d.amount}`}
              className="flex items-center gap-3"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-base">
                {d.avatar}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground">
                  {d.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {d.time}
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {d.amount}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
