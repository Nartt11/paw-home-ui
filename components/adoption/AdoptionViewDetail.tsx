"use client";

import * as React from "react";
import Image from "next/image";
import { CalendarDays, Home, PawPrint, ShieldCheck, UserRound } from "lucide-react";

import type { Adoption } from "@/types/adoption.type";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
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

function statusToBadge(status?: string) {
  const s = status ?? "PENDING";
  const map: Record<
    string,
    { label: string; className?: string; variant?: "secondary" }
  > = {
    PENDING: {
      label: "Cho xet duyet",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    APPROVED: {
      label: "Da duyet",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    },
    REJECTED: {
      label: "Tu choi",
      className: "bg-rose-50 text-rose-700 hover:bg-rose-50",
    },
    CANCELLED: {
      label: "Da huy",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    },
    COMPLETED: {
      label: "Hoan thanh",
      className: "bg-blue-50 text-blue-700 hover:bg-blue-50",
    },
  };

  const item = map[s] ?? { label: s };

  return item.className ? (
    <Badge className={item.className}>{item.label}</Badge>
  ) : (
    <Badge variant="secondary">{item.label}</Badge>
  );
}

export interface AdoptionViewDetailProps {
  adoption: Adoption | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  onCancel?: (applicationId: string) => void;
  onComplete?: (applicationId: string) => void;
}

export function AdoptionViewDetail({
  adoption,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onCancel,
  onComplete,
}: AdoptionViewDetailProps) {
  const title = adoption
    ? `Don nhan nuoi • ${adoption.adoptionCode || adoption.applicationId}`
    : "Don nhan nuoi";
  const canDecide = adoption?.status === "PENDING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-5xl bg-white">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
                {adoption ? statusToBadge(adoption.status) : null}
              </div>
              <DialogDescription>
                {adoption
                  ? `${adoption.applicantUsername || "—"} -> ${adoption.petName || "—"}`
                  : ""}
              </DialogDescription>
            </div>

            {adoption && canDecide ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onReject?.(adoption.applicationId)}
                  disabled={!onReject}
                >
                  Tu choi
                </Button>
                <Button
                  type="button"
                  onClick={() => onApprove?.(adoption.applicationId)}
                  disabled={!onApprove}
                >
                  Duyet don
                </Button>
              </div>
            ) : adoption?.status === "APPROVED" ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  onClick={() => onCancel?.(adoption.applicationId)}
                  disabled={!onCancel}
                >
                  Hủy đơn
                </Button>
                <Button
                  type="button"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => onComplete?.(adoption.applicationId)}
                  disabled={!onComplete}
                >
                  Hoàn thành
                </Button>
              </div>
            ) : null}
          </div>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 pb-6">
          {!adoption ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Dang tai chi tiet...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-3xl border bg-card">
                  <div className="relative aspect-[4/5] bg-muted">
                    {adoption.petPrimaryImageUrl ? (
                      <Image
                        src={adoption.petPrimaryImageUrl}
                        alt={adoption.petName || "Pet image"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Chua co hinh anh
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                      icon={<PawPrint className="size-4 text-orange-600" />}
                      label="Thu cung"
                      value={adoption.petName || "—"}
                    />
                    <SummaryCard
                      icon={<UserRound className="size-4 text-sky-600" />}
                      label="Nguoi nop don"
                      value={adoption.applicantUsername || "—"}
                    />
                    <SummaryCard
                      icon={<Home className="size-4 text-emerald-600" />}
                      label="Trung tam"
                      value={adoption.organizationName || "—"}
                    />
                    <SummaryCard
                      icon={<CalendarDays className="size-4 text-violet-600" />}
                      label="Ngay tao"
                      value={formatDateTimeVi(adoption.createdAt)}
                    />
                  </div>

                  <div className="space-y-3 rounded-3xl border bg-card p-5">
                    <div className="text-sm font-semibold">Thong tin xu ly</div>
                    <Separator />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldRow
                        label="Nguoi quyet dinh"
                        value={adoption.decidedByUsername || "Chua quyet dinh"}
                      />
                      <FieldRow
                        label="Thoi diem quyet dinh"
                        value={formatDateTimeVi(adoption.decidedAt)}
                      />
                      <FieldRow
                        label="Thoi diem san sang ban giao"
                        value={formatDateTimeVi(adoption.readyAt)}
                      />
                      <FieldRow
                        label="Trang thai hien tai"
                        value={statusToBadge(adoption.status)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="space-y-3 rounded-3xl border bg-card p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="size-4 text-primary" />
                    Danh gia kinh nghiem
                  </div>
                  <Separator />
                  <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                    {adoption.experience || "Chua co thong tin kinh nghiem."}
                  </p>
                </section>

                <section className="space-y-3 rounded-3xl border bg-card p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Home className="size-4 text-primary" />
                    Dieu kien song
                  </div>
                  <Separator />
                  <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                    {adoption.liveCondition || "Chua co thong tin dieu kien song."}
                  </p>
                </section>
              </div>

              {adoption.rejectReason ? (
                <section className="space-y-3 rounded-3xl border border-rose-100 bg-rose-50/60 p-5">
                  <div className="text-sm font-semibold text-rose-800">
                    Ly do tu choi
                  </div>
                  <Separator className="bg-rose-100" />
                  <p className="whitespace-pre-wrap text-sm leading-6 text-rose-900">
                    {adoption.rejectReason}
                  </p>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
