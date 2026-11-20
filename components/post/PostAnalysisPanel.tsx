"use client";

import { Badge } from "@/components/ui/badge";
import { usePostAnalysis } from "@/hooks/use-post-analysis";
import type { PostAnalysisStatus, PostCategory } from "@/types/post.type";

const STATUS_LABEL: Record<PostAnalysisStatus, string> = {
  PENDING: "Chờ phân tích",
  ANALYZING: "Đang phân tích",
  ANALYZED: "Chờ tác giả xác nhận",
  CONFIRMED: "Tác giả đã xác nhận",
  REJECTED: "Tác giả đã từ chối",
  FAILED: "Phân tích lỗi",
};

const CATEGORY_LABEL: Record<PostCategory, string> = {
  RESCUE: "Cứu hộ",
  ADOPTION: "Nhận nuôi",
  LOST: "Thất lạc",
  FOUND: "Tìm thấy",
  GENERAL: "Chung",
};

function pct(value?: number | null) {
  return value == null ? "" : ` (${Math.round(value * 100)}%)`;
}

/** Read-only: confirm / reject / retry belong to the post author in the backend. */
export function PostAnalysisPanel({ postId }: { postId: string }) {
  const { data, isPending, isError } = usePostAnalysis(postId);

  if (isPending) return <p className="text-sm text-muted-foreground">Đang tải...</p>;
  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">Bài đăng chưa có phân tích AI.</p>;
  }

  const s = data.suggestion;
  const rows: [string, string][] = s
    ? [
        ["Chủ đề", s.category ? CATEGORY_LABEL[s.category] + pct(s.categoryConfidence) : "—"],
        ["Loài", (s.species ?? "—") + pct(s.speciesConfidence)],
        [
          "Khu vực",
          [s.district, s.province].filter(Boolean).join(", ") + pct(s.locationConfidence) || "—",
        ],
        ["Cần cứu hộ", s.needsRescue ? `Có${s.urgency ? ` · ${s.urgency}` : ""}` : "Không"],
        ["Tóm tắt", s.rescueSummary ?? "—"],
      ]
    : [];

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={data.status === "FAILED" ? "destructive" : "secondary"}>
          {STATUS_LABEL[data.status]}
        </Badge>
        {data.model && <span className="text-xs text-muted-foreground">Model: {data.model}</span>}
        {data.analyzedAt && (
          <span className="text-xs text-muted-foreground">
            {new Date(data.analyzedAt).toLocaleString("vi-VN")}
          </span>
        )}
      </div>
      {rows.length > 0 && (
        <dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1.5">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {s && s.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {s.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
