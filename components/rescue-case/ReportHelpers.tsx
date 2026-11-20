"use client";

import { HeartPulse, Info } from "lucide-react";

import { useFirstAidGuides, usePossibleDuplicates } from "@/hooks/use-rescue-flow";
import { formatDistance, formatRelativeTime, rescueStatusLabel } from "@/lib/rescue-case-display";
import { speciesLabel } from "@/lib/pet-display";

/**
 * Open cases close to the chosen point that may be the same animal. Advisory only: the reporter
 * can still send the report, but often someone is already on the way.
 */
export function PossibleDuplicates({ latitude, longitude, species }: { latitude?: number; longitude?: number; species?: string }) {
  const hasPoint = !!latitude && !!longitude;
  const query = usePossibleDuplicates(hasPoint ? latitude : undefined, hasPoint ? longitude : undefined, species || undefined);
  const cases = query.data ?? [];
  if (!hasPoint || cases.length === 0) return null;

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900" role="status">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <Info className="h-4 w-4" aria-hidden /> Có thể đã có người báo bé này
      </div>
      <ul className="space-y-1">
        {cases.map((item) => (
          <li key={item.caseId}>
            {speciesLabel({ species: item.species })} · {rescueStatusLabel(item.status)}
            {item.distanceMeters != null ? ` · cách ${formatDistance(item.distanceMeters)}` : ""} · báo{" "}
            {formatRelativeTime(item.reportedAt)} <span className="text-sky-700 tabular-nums">(ca {item.caseCode})</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-sky-800">
        Nếu đúng là cùng một bé, bạn có thể mở ca đó trên bản đồ để xem tiến độ. Khác bé thì cứ gửi báo cáo bình thường.
      </p>
    </div>
  );
}

/** Short first-aid steps by situation, from the backend; static guidance, not AI. */
export function FirstAidTips() {
  const query = useFirstAidGuides();
  const guides = query.data?.guides ?? [];
  if (guides.length === 0) return null;

  return (
    <details className="group rounded-lg border border-rose-200 bg-rose-50/60 p-4 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-rose-900">
        <HeartPulse className="h-4 w-4" aria-hidden />
        Sơ cứu trong lúc chờ người đến
        <span className="ml-auto text-xs font-normal text-rose-700 group-open:hidden">Mở</span>
      </summary>
      <div className="mt-3 space-y-4">
        {guides.map((guide) => (
          <div key={guide.code} className="space-y-1">
            <div className="font-medium">{guide.title}</div>
            {guide.steps?.length ? (
              <ol className="list-decimal space-y-0.5 pl-5">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : null}
            {guide.doNot?.length ? (
              <p className="text-rose-800">Không nên: {guide.doNot.join("; ")}.</p>
            ) : null}
          </div>
        ))}
        {query.data?.disclaimer ? <p className="text-xs text-muted-foreground">{query.data.disclaimer}</p> : null}
      </div>
    </details>
  );
}
