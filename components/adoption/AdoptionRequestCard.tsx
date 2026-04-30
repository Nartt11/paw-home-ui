"use client";

import * as React from "react";
import {
  CalendarDays,
  Check,
  Clock,
  MapPin,
  MoreVertical,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Adoption, AdoptionSummary } from "@/types/adoption.type";

export interface AdoptionRequestCardProps {
  adoption: AdoptionSummary;
  onViewDetail?: (applicationId: string) => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  className?: string;
}

function initials(text: string) {
  const v = (text || "").trim();
  if (!v) return "?";
  const parts = v.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?";
}

function formatDateVi(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function statusMeta(status?: string) {
  const s = status ?? "PENDING";
  const labelMap: Record<string, string> = {
    PENDING: "Chờ xét duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    CANCELED: "Đã huỷ",
  };
  const classMap: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    CANCELED: "bg-muted text-muted-foreground border-border",
  };

  return {
    label: labelMap[s] ?? s,
    className: classMap[s] ?? "bg-muted text-muted-foreground border-border",
    key: s,
  };
}

export default function AdoptionRequestCard({
  adoption,
  onViewDetail,
  onApprove,
  onReject,
  className,
}: AdoptionRequestCardProps) {
  const applicationId = adoption.applicationId;
  const applicantName = adoption.applicantUsername || "—";
  const petName = adoption.petName || "—";

  const status = adoption.status;
  const createdAt = adoption.createdAt; // fallback: API might not provide updatedAt; decidedAt still useful

  // These fields are not in `Adoption` type currently; keep graceful fallbacks.
  const avatarUrl = undefined as string | undefined;
  const centerName = undefined as string | undefined;
  const message = undefined as string | undefined;

  const st = statusMeta(status);
  const canDecide = (status ?? "PENDING") === "PENDING";

  return (
    <article
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 shrink-0 ring-1 ring-border">
          <AvatarImage src={avatarUrl || ""} alt={applicantName} />
          <AvatarFallback className="bg-muted text-foreground">
            {initials(applicantName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-foreground">
                {applicantName}{" "}
                <span className="font-normal">đăng ký nhận</span>{" "}
                <span className="font-semibold">{petName}</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {applicationId}
                </Badge>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                    st.className,
                  )}
                >
                  {st.label}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem
                  onClick={() => onViewDetail?.(applicationId)}
                  disabled={!onViewDetail}
                >
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onApprove?.(applicationId)}
                  disabled={!onApprove || !canDecide}
                >
                  Duyệt
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReject?.(applicationId)}
                  disabled={!onReject || !canDecide}
                >
                  Từ chối
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{formatDateVi(createdAt)}</span>
              </div>

              {centerName ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="truncate">{centerName}</span>
                </div>
              ) : null}
            </div>
          </div>

          {message ? (
            <>
              <Separator className="my-4" />
              <div className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-foreground">
                <span className="text-muted-foreground">“</span>
                {message}
                <span className="text-muted-foreground">”</span>
              </div>
            </>
          ) : null}

          <div className="mt-5 flex items-center gap-3">
            <Button
              className="h-11 flex-1 rounded-full"
              variant="outline"
              onClick={() => onViewDetail?.(applicationId)}
              disabled={!onViewDetail}
            >
              Xem chi tiết
            </Button>

            <Button
              className="h-11 w-11 rounded-full"
              variant="default"
              onClick={() => onApprove?.(applicationId)}
              disabled={!onApprove || !canDecide}
            >
              <Check className="h-5 w-5" />
            </Button>

            <Button
              className="h-11 w-11 rounded-full"
              variant="destructive"
              onClick={() => onReject?.(applicationId)}
              disabled={!onReject || !canDecide}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
