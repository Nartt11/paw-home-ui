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

export function UserViewDetail({
  user,
  open,
  onOpenChange,
}: UserViewDetailProps) {
  const rolesText =
    Array.isArray(user.roles) && user.roles.length
      ? user.roles.join(", ")
      : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-base sm:text-lg">
              {user.fullName || user.username || user.userId}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {statusToBadge(user.status)}
              {user.organizationRole ? (
                <Badge variant="secondary">{user.organizationRole}</Badge>
              ) : null}
            </div>
          </div>

          <DialogDescription className="mt-1">
            {user.email || ""}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto px-6 pb-6">
          <Separator />

          {/* Basic */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow label="User ID" value={user.userId} mono />
            <FieldRow label="Username" value={user.username || "—"} />
            <FieldRow label="Email" value={user.email || "—"} />
            <FieldRow
              label="Email verified"
              value={user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
            />
            <FieldRow label="Roles" value={rolesText} />
            <FieldRow label="Phone" value={user.phone || "—"} />
            <FieldRow label="Gender" value={user.gender || "—"} />
          </div>

          <Separator />

          {/* Organization */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow
              label="Organization"
              value={user.organizationName || "—"}
            />
            <FieldRow
              label="Organization ID"
              value={user.organizationId || "—"}
              mono
            />
          </div>

          <Separator />

          {/* Address */}
          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow
              label="Street address"
              value={user.streetAddress || "—"}
            />
            <FieldRow label="Ward" value={user.wardName || "—"} />
            <FieldRow label="Province" value={user.provinceName || "—"} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
