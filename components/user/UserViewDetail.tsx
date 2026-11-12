"use client";

import * as React from "react";

import type { User } from "@/types/user.type";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { parseApiDate, VN_TIME_ZONE } from "@/lib/datetime";

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

export interface UserViewDetailProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusToBadge(status?: User["status"] | string) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          Hoạt động
        </Badge>
      );
    case "DISABLED":
      return (
        <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50">
          Vô hiệu
        </Badge>
      );
    case "PENDING_VERIFICATION":
      return (
        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
          Chờ xác minh
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status || "Không rõ"}</Badge>;
  }
}

function formatDateTimeVi(value?: string) {
  if (!value) return "—";
  const d = parseApiDate(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    timeZone: VN_TIME_ZONE,
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UserViewDetail({
  user,
  open,
  onOpenChange,
}: UserViewDetailProps) {
  const rolesText =
    Array.isArray(user.roles) && user.roles.length
      ? user.roles.join(", ")
      : "—";

  const title = user.fullName || user.username || "Người dùng";
  const subtitle = user.email || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
            <div className="flex items-center gap-2">
              {statusToBadge(user.status)}
              {user.organizationRole ? (
                <Badge variant="secondary">{user.organizationRole}</Badge>
              ) : null}
            </div>
          </div>

          <DialogDescription className="mt-1">{subtitle}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto px-6 pb-6">
          <Separator />

          {/* Thông tin */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow label="Họ tên" value={user.fullName || "—"} />
            <FieldRow label="Username" value={user.username || "—"} />
            <FieldRow label="Email" value={user.email || "—"} />
            <FieldRow
              label="Xác minh email"
              value={user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
            />
            <FieldRow label="Số điện thoại" value={user.phone || "—"} />
            <FieldRow label="Giới tính" value={user.gender || "—"} />
            <FieldRow label="Vai trò hệ thống" value={rolesText} />
          </div>

          <Separator />

          {/* Tổ chức */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow label="Tổ chức" value={user.organizationName || "—"} />
            <FieldRow
              label="Vai trò trong tổ chức"
              value={user.organizationRole || "—"}
            />
          </div>

          <Separator />

          {/* Địa chỉ */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow label="Địa chỉ" value={user.streetAddress || "—"} />
            <FieldRow label="Phường / Xã" value={user.wardName || "—"} />
            <FieldRow
              label="Tỉnh / Thành phố"
              value={user.provinceName || "—"}
            />
          </div>

          <Separator />

          {/* Metadata (ID chỉ làm index, hiển thị phụ) */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow label="User ID" value={user.userId} mono />
            <FieldRow label="User code" value={user.userCode || "—"} mono />
            <FieldRow
              label="Organization ID"
              value={user.organizationId || "—"}
              mono
            />
            <FieldRow
              label="Tạo lúc"
              value={formatDateTimeVi(user.createdAt)}
            />
            <FieldRow
              label="Cập nhật lúc"
              value={formatDateTimeVi(user.updatedAt)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
