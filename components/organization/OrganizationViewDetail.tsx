"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import type { Organization } from "@/types/organization.type";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const LocationPickerMap = dynamic(
  () => import("@/components/map/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 w-full items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground">
        Đang tải bản đồ...
      </div>
    ),
  },
);

function hasValidCoordinates(latitude: unknown, longitude: unknown) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

function typeLabel(type?: string) {
  switch (type) {
    case "SHELTER":
      return "Mái ấm";
    case "VET_CENTER":
      return "Cơ sở thú y";
    default:
      return type || "-";
  }
}

function statusToBadge(status?: string) {
  const s = (status ?? "").toUpperCase();

  if (s === "ACTIVE") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
        Đang hoạt động
      </Badge>
    );
  }

  if (s === "PENDING") {
    return (
      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">
        Chờ duyệt
      </Badge>
    );
  }

  if (s === "INACTIVE") {
    return <Badge variant="secondary">Ngừng hoạt động</Badge>;
  }

  if (s === "REJECTED") {
    return <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50">Bị từ chối</Badge>;
  }

  return <Badge variant="secondary">{status || "-"}</Badge>;
}

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

export interface OrganizationViewDetailProps {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrganizationViewDetail({
  organization,
  open,
  onOpenChange,
}: OrganizationViewDetailProps) {
  const canShowMap = hasValidCoordinates(
    organization.latitude,
    organization.longitude,
  );

  const title = organization.name
    ? `Trung tâm - ${organization.name}`
    : `Trung tâm - ${organization.organizationId}`;

  const addressLine = [
    organization.streetAddress,
    organization.wardName,
    organization.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
            {statusToBadge(organization.status)}
            <Badge variant="secondary">{typeLabel(organization.type)}</Badge>
          </div>

          <DialogDescription className="mt-1">
            {organization.description || ""}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto px-6 pb-6">
          <Separator />

          <div className="grid gap-4 md:grid-cols-[240px_1fr]">
            <div className="overflow-hidden rounded-xl border border-border bg-muted">
              {canShowMap ? (
                <div className="h-40 w-full">
                  <LocationPickerMap
                    latitude={organization.latitude}
                    longitude={organization.longitude}
                    disabled
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  Chưa có tọa độ
                </div>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FieldRow
                label="Organization ID"
                value={organization.organizationId}
                mono
              />
              <FieldRow
                label="Người tạo"
                value={organization.createdBy || "-"}
                mono
              />
              <FieldRow label="Email" value={organization.email || "-"} />
              <FieldRow label="Điện thoại" value={organization.phone || "-"} />
              <FieldRow
                label="Official link"
                value={
                  organization.officialLink ? (
                    <a
                      href={organization.officialLink}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-primary underline-offset-4 hover:underline"
                    >
                      {organization.officialLink}
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
              <FieldRow label="Địa chỉ" value={addressLine || "-"} />
              <FieldRow
                label="Latitude"
                value={canShowMap ? String(organization.latitude) : "-"}
                mono
              />
              <FieldRow
                label="Longitude"
                value={canShowMap ? String(organization.longitude) : "-"}
                mono
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-5 md:grid-cols-2">
            <FieldRow label="Loại" value={typeLabel(organization.type)} />
            <FieldRow
              label="Trạng thái"
              value={(organization.status ?? "-").toString()}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
