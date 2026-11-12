import { AlertTriangle, CheckCircle2, CircleHelp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { MatchCertainty, MatchLevel, MatchResult } from "@/types/adoption.type";

const LEVEL: Record<MatchLevel, { label: string; className: string }> = {
  HIGH: { label: "Rất phù hợp", className: "bg-emerald-50 text-emerald-700" },
  MEDIUM: { label: "Khá phù hợp", className: "bg-sky-50 text-sky-700" },
  LOW: { label: "Ít phù hợp", className: "bg-amber-50 text-amber-700" },
  NOT_SUITABLE: { label: "Không phù hợp", className: "bg-rose-50 text-rose-700" },
};

const CERTAINTY: Record<MatchCertainty, string> = {
  HIGH: "độ tin cậy cao",
  MEDIUM: "độ tin cậy vừa",
  LOW: "độ tin cậy thấp",
  NONE: "chưa đủ dữ liệu",
};

const STATUS_ICON = {
  OK: <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />,
  WARN: <AlertTriangle className="size-4 shrink-0 text-amber-600" />,
  UNKNOWN: <CircleHelp className="size-4 shrink-0 text-muted-foreground" />,
};

/** Explainable compatibility between the applicant's profile and the pet's traits. */
export function AdoptionMatchSection({ match }: { match?: MatchResult | null }) {
  if (!match) return null;
  const level = LEVEL[match.level];

  return (
    <section className="space-y-3 rounded-3xl border p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Độ phù hợp</span>
        <Badge className={level.className}>{level.label}</Badge>
        {match.score != null && (
          <span className="text-sm font-medium">{Math.round(match.score)}/100</span>
        )}
        <span className="text-xs text-muted-foreground">{CERTAINTY[match.certainty]}</span>
      </div>
      <Separator />

      {(match.warnings ?? []).length > 0 && (
        <div className="space-y-1 rounded-xl bg-rose-50 p-3 text-sm text-rose-900">
          {match.warnings!.map((w) => (
            <p key={w.code} className="flex gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {w.text}
            </p>
          ))}
          {match.warningsAcknowledged && (
            <p className="text-xs">Người nộp đơn đã xác nhận đọc các cảnh báo này.</p>
          )}
        </div>
      )}

      <ul className="space-y-1.5 text-sm">
        {(match.reasons ?? []).map((r) => (
          <li key={r.code} className="flex gap-2">
            {STATUS_ICON[r.status]}
            <span>{r.text}</span>
          </li>
        ))}
      </ul>

      {(match.preparation ?? []).length > 0 && (
        <div className="text-sm">
          <p className="mb-1 font-medium">Cần chuẩn bị</p>
          <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
            {match.preparation!.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
