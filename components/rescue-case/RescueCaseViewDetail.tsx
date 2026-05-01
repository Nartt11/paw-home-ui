"use client";

import * as React from "react";

import type { RescueCase } from "@/types/rescue-case.type";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function FieldRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={mono ? "font-mono text-sm" : "text-sm"}>{value}</div>
    </div>
  );
}

function formatDateTimeVi(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function priorityToBadge(priority?: RescueCase["priority"]) {
  const p = priority ?? "NORMAL";
  const map: Record<
    string,
    { label: string; variant?: "secondary"; className?: string }
  > = {
    LOW: { label: "Thấp", className: "bg-sky-50 text-sky-700 hover:bg-sky-50" },
    NORMAL: {
      label: "Bình thường",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    HIGH: {
      label: "Cao",
      className: "bg-rose-50 text-rose-700 hover:bg-rose-50",
    },
    CRITICAL: {
      label: "Khẩn cấp",
      className: "bg-red-50 text-red-700 hover:bg-red-50",
    },
  };
  const it = map[p] ?? { label: p };
  return it.className ? (
    <Badge className={it.className}>{it.label}</Badge>
  ) : (
    <Badge variant="secondary">{it.label}</Badge>
  );
}

function statusToBadge(status?: RescueCase["status"]) {
  const s = status ?? "REPORTED";
  const map: Record<
    string,
    { label: string; className?: string; variant?: "secondary" }
  > = {
    REPORTED: {
      label: "Đã báo cáo",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    IN_PROGRESS: {
      label: "Đang xử lý",
      className: "bg-sky-50 text-sky-700 hover:bg-sky-50",
    },
    RESCUED: {
      label: "Đã cứu",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    },
    CLOSED: { label: "Đã đóng" },
  };
  const it = map[s] ?? { label: s };
  return it.className ? (
    <Badge className={it.className}>{it.label}</Badge>
  ) : (
    <Badge variant="secondary">{it.label}</Badge>
  );
}

export interface RescueCaseViewDetailProps {
  rescueCase: RescueCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RescueCaseViewDetail({
  rescueCase,
  open,
  onOpenChange,
}: RescueCaseViewDetailProps) {
  const title = rescueCase
    ? `Ca cứu hộ • ${rescueCase.caseId || ""}`
    : "Ca cứu hộ";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
            {rescueCase ? (
              <>
                {statusToBadge(rescueCase.status)}
                {priorityToBadge(rescueCase.priority)}
              </>
            ) : null}
          </div>

          <DialogDescription className="mt-1">
            {rescueCase ? rescueCase.locationText || "" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto px-6 pb-6">
          {!rescueCase ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Đang tải chi tiết...
            </div>
          ) : (
            <>
              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow label="Case ID" value={rescueCase.caseId} mono />
                <FieldRow label="Pet ID" value={rescueCase.petId || "—"} mono />
                <FieldRow label="Pet name" value={rescueCase.petName || "—"} />
                <FieldRow label="Species" value={rescueCase.species || "—"} />
                <FieldRow label="Color" value={rescueCase.color || "—"} />
                <FieldRow label="Size" value={rescueCase.size || "—"} />
              </div>

              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow
                  label="Organization"
                  value={
                    <div className="space-y-1">
                      <div>{rescueCase.organizationName || "—"}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {rescueCase.organizationId || "—"}
                      </div>
                    </div>
                  }
                />
                <FieldRow
                  label="Reporter"
                  value={
                    <div className="space-y-1">
                      <div>{rescueCase.reporterUsername || "—"}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {rescueCase.reportedBy || "—"}
                      </div>
                    </div>
                  }
                />
              </div>

              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow
                  label="Province"
                  value={rescueCase.provinceName || "—"}
                />
                <FieldRow label="Ward" value={rescueCase.wardName || "—"} />
                <FieldRow
                  label="Tọa độ"
                  value={
                    <span className="font-mono text-xs">
                      {rescueCase.latitude}, {rescueCase.longitude}
                    </span>
                  }
                />
                <FieldRow
                  label="Địa điểm"
                  value={rescueCase.locationText || "—"}
                />
              </div>

              <Separator />

              <FieldRow
                label="Mô tả"
                value={
                  <div className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-sm">
                    {rescueCase.description || "—"}
                  </div>
                }
              />

              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow
                  label="Reported at"
                  value={formatDateTimeVi(rescueCase.reportedAt)}
                />
                <FieldRow
                  label="Resolved at"
                  value={formatDateTimeVi(rescueCase.resolvedAt)}
                />
                <FieldRow
                  label="Created at"
                  value={formatDateTimeVi(rescueCase.createdAt)}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
