"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { RescueCaseUpdate } from "@/components/rescue-case/RescueCaseUpdate";
import { CompleteRescueDialog } from "@/components/rescue-case/CompleteRescueDialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUpdateRescueCaseStatus } from "@/hooks/use-rescue-case";
import type { RescueCase } from "@/types/rescue-case.type";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MapPicker = dynamic(() => import("@/components/map/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
      Đang tải bản đồ...
    </div>
  ),
});

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

function hasValidCoordinates(latitude: unknown, longitude: unknown) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

const RESCUE_CASE_STATUS_OPTIONS: Array<{
  value: NonNullable<RescueCase["status"]>;
  label: string;
}> = [
  { value: "REPORTED", label: "Đã báo cáo" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "RESCUED", label: "Đã cứu" },
  { value: "CLOSED", label: "Đã đóng" },
];

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
  const currentUserQuery = useCurrentUser();
  const updateStatusMutation = useUpdateRescueCaseStatus();
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [completeRescueOpen, setCompleteRescueOpen] = React.useState(false);
  const [selectValue, setSelectValue] = React.useState<string>("REPORTED");

  const [prevStatus, setPrevStatus] = React.useState<string | null>(null);

  if (rescueCase && (rescueCase.status ?? "REPORTED") !== prevStatus) {
    setPrevStatus(rescueCase.status ?? "REPORTED");
    setSelectValue(rescueCase.status ?? "REPORTED");
  }
  const title = rescueCase
    ? `Ca cứu hộ • ${rescueCase.caseId || ""}`
    : "Ca cứu hộ";
  const canShowMap = rescueCase
    ? hasValidCoordinates(rescueCase.latitude, rescueCase.longitude)
    : false;
  const normalizedRoles = React.useMemo(
    () =>
      (currentUserQuery.data?.roles ?? [])
        .filter((role): role is string => Boolean(role))
        .map((role) => role.toUpperCase()),
    [currentUserQuery.data?.roles],
  );
  const canUpdateRescueCase =
    normalizedRoles.length > 0 && !normalizedRoles.includes("USER");
  const canOpenUpdateForm = normalizedRoles.includes("ADMIN");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
              {rescueCase ? (
                <>
                  {statusToBadge(rescueCase.status)}
                  {priorityToBadge(rescueCase.priority)}
                </>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {rescueCase && rescueCase.status !== "RESCUED" && rescueCase.status !== "CLOSED" ? (
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold rounded-xl"
                  onClick={() => setCompleteRescueOpen(true)}
                  disabled={updateStatusMutation.isPending}
                >
                  Hoàn thành cứu hộ
                </Button>
              ) : null}

              {rescueCase && canOpenUpdateForm ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUpdateOpen(true)}
                  disabled={updateStatusMutation.isPending}
                  className="cursor-pointer font-semibold rounded-xl"
                >
                  Cập nhật ca cứu hộ
                </Button>
              ) : null}
            </div>
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

              {canUpdateRescueCase ? (
                <>
                  <Separator />

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Cập nhật trạng thái
                      </div>
                      <Select
                        value={selectValue}
                        onValueChange={async (value) => {
                          const nextStatus =
                            value as NonNullable<RescueCase["status"]>;

                          if (nextStatus === rescueCase.status) {
                            return;
                          }

                          if (nextStatus === "RESCUED") {
                            setCompleteRescueOpen(true);
                            return;
                          }

                          try {
                            setSelectValue(nextStatus);
                            await updateStatusMutation.mutateAsync({
                              id: rescueCase.caseId,
                              status: nextStatus,
                            });
                          } catch {
                            setSelectValue(rescueCase.status ?? "REPORTED");
                          }
                        }}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESCUE_CASE_STATUS_OPTIONS.map((statusOption) => (
                            <SelectItem
                              key={statusOption.value}
                              value={statusOption.value}
                            >
                              {statusOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              ) : null}

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
                <FieldRow label="Province" value={rescueCase.provinceName || "—"} />
                <FieldRow label="Ward" value={rescueCase.wardName || "—"} />
                <FieldRow
                  label="Tọa độ"
                  value={
                    <span className="font-mono text-xs">
                      {canShowMap
                        ? `${rescueCase.latitude}, ${rescueCase.longitude}`
                        : "—"}
                    </span>
                  }
                />
                <FieldRow
                  label="Địa điểm"
                  value={rescueCase.locationText || "—"}
                />
              </div>

              {canShowMap ? (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Vị trí trên bản đồ
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <MapPicker
                    title={rescueCase.caseCode || rescueCase.caseId}
                    latitude={rescueCase.latitude}
                    longitude={rescueCase.longitude}
                  />
                </div>
              </div>
              ) : null}

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

      {rescueCase && canOpenUpdateForm && updateOpen ? (
        <RescueCaseUpdate
          key={rescueCase.caseId}
          open={updateOpen}
          onOpenChange={setUpdateOpen}
          rescueCase={rescueCase}
        />
      ) : null}

      {rescueCase && completeRescueOpen ? (
        <CompleteRescueDialog
          key={`complete-${rescueCase.caseId}`}
          rescueId={rescueCase.caseId}
          open={completeRescueOpen}
          onOpenChange={setCompleteRescueOpen}
        />
      ) : null}
    </>
  );
}
