"use client";

import * as React from "react";

import type { Adoption } from "@/types/adoption.type";

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
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[200px_1fr] sm:gap-3">
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

function statusToBadge(status?: string) {
  const s = status ?? "PENDING";
  switch (s) {
    case "PENDING":
      return (
        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
          Chờ xét duyệt
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          Đã duyệt
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50">
          Từ chối
        </Badge>
      );
    case "CANCELED":
      return (
        <Badge variant="secondary" className="bg-muted hover:bg-muted">
          Đã huỷ
        </Badge>
      );
    default:
      return <Badge variant="secondary">{s}</Badge>;
  }
}

export interface AdoptionViewDetailProps {
  adoption: Adoption | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdoptionViewDetail({
  adoption,
  open,
  onOpenChange,
}: AdoptionViewDetailProps) {
  const title = adoption
    ? `Đơn nhận nuôi • ${adoption.applicationId}`
    : "Đơn nhận nuôi";

  const subtitle = adoption
    ? `${adoption.applicantUsername || "—"} → ${adoption.petName || "—"}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
            {adoption ? statusToBadge(adoption.status) : null}
          </div>
          <DialogDescription className="mt-1">{subtitle}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 pb-6">
          {!adoption ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Đang tải chi tiết...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-foreground">
                    Thông tin đơn
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <FieldRow
                      label="Mã đơn"
                      value={adoption.applicationId}
                      mono
                    />
                    <FieldRow
                      label="Trạng thái"
                      value={statusToBadge(adoption.status)}
                    />
                    <FieldRow
                      label="Ngày tạo"
                      value={formatDateTimeVi(adoption.createdAt)}
                    />
                    <FieldRow
                      label="Ngày quyết định"
                      value={formatDateTimeVi(adoption.decidedAt)}
                    />
                    <FieldRow
                      label="Người quyết định"
                      value={adoption.decidedBy || "—"}
                      mono
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-foreground">
                    Đối tượng liên quan
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <FieldRow
                      label="Thú cưng"
                      value={adoption.petName || "—"}
                    />
                    <FieldRow label="Pet ID" value={adoption.petId} mono />
                    <FieldRow
                      label="Người nộp đơn"
                      value={adoption.applicantUsername || "—"}
                    />
                    <FieldRow
                      label="Applicant ID"
                      value={adoption.applicantId}
                      mono
                    />
                    <FieldRow
                      label="Organization ID"
                      value={adoption.organizationId}
                      mono
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-foreground">
                  Thông tin bổ sung
                </div>
                <Separator />
                <div className="grid gap-6 sm:grid-cols-2">
                  <FieldRow
                    label="Kinh nghiệm"
                    value={
                      <p className="whitespace-pre-wrap text-sm text-foreground">
                        {adoption.experience || "—"}
                      </p>
                    }
                  />
                  <FieldRow
                    label="Điều kiện sống"
                    value={
                      <p className="whitespace-pre-wrap text-sm text-foreground">
                        {adoption.liveCondition || "—"}
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
