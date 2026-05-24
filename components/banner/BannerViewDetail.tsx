"use client";

import * as React from "react";
import Image from "next/image";

import type { Banner } from "@/types/banner.type";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("vi-VN", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function activeToBadge(active?: boolean) {
  return active ? (
    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
      Dang bat
    </Badge>
  ) : (
    <Badge variant="secondary">Tat</Badge>
  );
}

export interface BannerViewDetailProps {
  banner: Banner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BannerViewDetail({
  banner,
  open,
  onOpenChange,
}: BannerViewDetailProps) {
  const title = banner
    ? `Banner - ${banner.title || banner.bannerId}`
    : "Banner";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
            {banner ? (
              <>
                {activeToBadge(banner.active)}
                <Badge variant="secondary">{banner.targetPage || "-"}</Badge>
              </>
            ) : null}
          </div>

          <DialogDescription className="mt-1">
            {banner ? banner.subtitle || "" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] space-y-6 overflow-y-auto px-6 pb-6">
          {!banner ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Dang tai chi tiet...
            </div>
          ) : (
            <>
              <Separator />

              <div className="grid gap-4 md:grid-cols-[240px_1fr]">
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                  {banner.mediaUrl ? (
                    <div className="relative h-40 w-full">
                      <Image
                        src={banner.mediaUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                      Khong co anh
                    </div>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FieldRow label="Banner ID" value={banner.bannerId} mono />
                  <FieldRow label="Media ID" value={banner.mediaId} mono />
                  <FieldRow label="Link type" value={banner.linkType || "-"} />
                  <FieldRow
                    label="Link URL"
                    value={
                      banner.linkUrl ? (
                        <a
                          href={banner.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-primary underline-offset-4 hover:underline"
                        >
                          {banner.linkUrl}
                        </a>
                      ) : (
                        "-"
                      )
                    }
                  />
                  <FieldRow
                    label="Thu tu hien thi"
                    value={
                      <span className="font-mono text-xs">
                        {banner.displayOrder}
                      </span>
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow
                  label="Bat dau"
                  value={formatDateTimeVi(banner.startDate)}
                />
                <FieldRow
                  label="Ket thuc"
                  value={formatDateTimeVi(banner.endDate)}
                />
              </div>

              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <FieldRow
                  label="Tao luc"
                  value={formatDateTimeVi(banner.createdAt)}
                />
                <FieldRow
                  label="Cap nhat luc"
                  value={formatDateTimeVi(banner.updatedAt)}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
