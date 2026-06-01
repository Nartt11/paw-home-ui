"use client";

import * as React from "react";
import Image from "next/image";
import { CalendarDays, Home, PawPrint, ShieldCheck, UserRound, Loader2 } from "lucide-react";

import type { Adoption, AdoptionStatus } from "@/types/adoption.type";
import { toast } from "sonner";
import {
  useApproveAdoption,
  useRejectAdoption,
  useCancelAdoption,
  useCompleteAdoption,
} from "@/hooks/use-adoption";
import { getAuthErrorMessage } from "@/hooks/use-auth";

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
      label: "Chờ xét duyệt",
      className: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    },
    APPROVED: {
      label: "Đã duyệt",
      className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    },
    REJECTED: {
      label: "Từ chối",
      className: "bg-rose-50 text-rose-700 hover:bg-rose-50",
    },
    CANCELLED: {
      label: "Đã hủy",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    },
    COMPLETED: {
      label: "Hoàn thành",
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
  canManage?: boolean;
}

export function AdoptionViewDetail({
  adoption,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onCancel,
  onComplete,
  canManage = false,
}: AdoptionViewDetailProps) {
  const title = adoption
    ? `Đơn nhận nuôi • ${adoption.adoptionCode || adoption.applicationId}`
    : "Đơn nhận nuôi";
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


          </div>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 pb-6">
          {!adoption ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Đang tải chi tiết...
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
                        Chưa có hình ảnh
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                      icon={<PawPrint className="size-4 text-orange-600" />}
                      label="Thú cưng"
                      value={adoption.petName || "—"}
                    />
                    <SummaryCard
                      icon={<UserRound className="size-4 text-sky-600" />}
                      label="Người nộp đơn"
                      value={adoption.applicantUsername || "—"}
                    />
                    <SummaryCard
                      icon={<Home className="size-4 text-emerald-600" />}
                      label="Trung tâm"
                      value={adoption.organizationName || "—"}
                    />
                    <SummaryCard
                      icon={<CalendarDays className="size-4 text-violet-600" />}
                      label="Ngày tạo"
                      value={formatDateTimeVi(adoption.createdAt)}
                    />
                  </div>

                  <div className="space-y-3 rounded-3xl border bg-card p-5">
                    <div className="text-sm font-semibold">Thông tin xử lý</div>
                    <Separator />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldRow
                        label="Người quyết định"
                        value={adoption.decidedByUsername || "Chưa quyết định"}
                      />
                      <FieldRow
                        label="Thời điểm quyết định"
                        value={formatDateTimeVi(adoption.decidedAt)}
                      />
                      <FieldRow
                        label="Thời điểm sẵn sàng bàn giao"
                        value={formatDateTimeVi(adoption.readyAt)}
                      />
                      <FieldRow
                        label="Trạng thái hiện tại"
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
                    Đánh giá kinh nghiệm
                  </div>
                  <Separator />
                  <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                    {adoption.experience || "Chưa có thông tin kinh nghiệm."}
                  </p>
                </section>

                <section className="space-y-3 rounded-3xl border bg-card p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Home className="size-4 text-primary" />
                    Điều kiện sống
                  </div>
                  <Separator />
                  <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                    {adoption.liveCondition || "Chưa có thông tin điều kiện sống."}
                  </p>
                </section>
              </div>

              {adoption.rejectReason ? (
                <section className="space-y-3 rounded-3xl border border-rose-100 bg-rose-50/60 p-5">
                  <div className="text-sm font-semibold text-rose-800">
                    Lý do từ chối
                  </div>
                  <Separator className="bg-rose-100" />
                  <p className="whitespace-pre-wrap text-sm leading-6 text-rose-900">
                    {adoption.rejectReason}
                  </p>
                </section>
              ) : null}

              <AdoptionActionSection
                adoptionId={adoption.applicationId}
                status={adoption.status}
                disabled={!canManage}
              />
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

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  disabled?: boolean;
}

function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = "Hủy",
  variant = "default",
  onConfirm,
  disabled = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={disabled}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AdoptionActionSectionProps {
  adoptionId: string;
  status: AdoptionStatus;
  disabled?: boolean;
}

interface ActionConfig {
  label: string;
  loadingLabel: string;
  variant: "default" | "destructive";
  actionType: "APPROVE" | "REJECT" | "CANCEL" | "COMPLETE";
}

const STATUS_ACTIONS: Record<AdoptionStatus, ActionConfig[]> = {
  PENDING: [
    {
      label: "Từ chối",
      loadingLabel: "Rejecting...",
      variant: "destructive",
      actionType: "REJECT",
    },
    {
      label: "Duyệt đơn",
      loadingLabel: "Approving...",
      variant: "default",
      actionType: "APPROVE",
    },
  ],
  APPROVED: [
    {
      label: "Hủy đơn",
      loadingLabel: "Cancelling...",
      variant: "destructive",
      actionType: "CANCEL",
    },
    {
      label: "Hoàn thành",
      loadingLabel: "Completing...",
      variant: "default",
      actionType: "COMPLETE",
    },
  ],
  REJECTED: [],
  CANCELLED: [],
};

const CONFIRM_DETAILS = {
  APPROVE: {
    title: "Xác nhận duyệt đơn nhận nuôi",
    description: "Bạn có chắc chắn muốn duyệt đơn nhận nuôi này không? Sau khi duyệt, đơn sẽ chuyển sang trạng thái APPROVED.",
    confirmText: "Duyệt đơn",
    variant: "default" as const,
  },
  REJECT: {
    title: "Xác nhận từ chối đơn nhận nuôi",
    description: "Bạn có chắc chắn muốn từ chối đơn nhận nuôi này không? Thao tác này sẽ chuyển trạng thái đơn sang REJECTED.",
    confirmText: "Từ chối",
    variant: "destructive" as const,
  },
  CANCEL: {
    title: "Xác nhận hủy đơn nhận nuôi",
    description: "Bạn có chắc chắn muốn hủy đơn nhận nuôi này không? Thao tác này không thể hoàn tác.",
    confirmText: "Hủy đơn",
    variant: "destructive" as const,
  },
  COMPLETE: {
    title: "Xác nhận hoàn thành nhận nuôi",
    description: "Bạn có chắc chắn muốn hoàn thành quy trình nhận nuôi này? Thao tác này sẽ xác nhận thú cưng đã được nhận nuôi thành công.",
    confirmText: "Hoàn thành",
    variant: "default" as const,
  },
};

function AdoptionActionSection({
  adoptionId,
  status,
  disabled = false,
}: AdoptionActionSectionProps) {
  const approveMutation = useApproveAdoption();
  const rejectMutation = useRejectAdoption();
  const cancelMutation = useCancelAdoption();
  const completeMutation = useCompleteAdoption();

  const [confirmingAction, setConfirmingAction] = React.useState<
    "APPROVE" | "REJECT" | "CANCEL" | "COMPLETE" | null
  >(null);

  const isSubmitting =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    cancelMutation.isPending ||
    completeMutation.isPending;

  const actions = STATUS_ACTIONS[status] || [];

  if (actions.length === 0) {
    return null;
  }

  const handleConfirm = async () => {
    if (!confirmingAction) return;

    const action = confirmingAction;
    setConfirmingAction(null);

    try {
      switch (action) {
        case "APPROVE":
          await approveMutation.mutateAsync({
            id: adoptionId,
            payload: {
              note: "Đồng ý nhận nuôi",
              rejectReason: "",
              readyAt: new Date().toISOString(),
            },
          });
          toast.success("Duyệt đơn nhận nuôi thành công!");
          break;
        case "REJECT":
          await rejectMutation.mutateAsync({
            id: adoptionId,
            payload: {
              note: "",
              rejectReason: "Không đủ điều kiện nhận nuôi",
              readyAt: "",
            },
          });
          toast.success("Từ chối đơn nhận nuôi thành công!");
          break;
        case "CANCEL":
          await cancelMutation.mutateAsync(adoptionId);
          toast.success("Hủy đơn nhận nuôi thành công!");
          break;
        case "COMPLETE":
          await completeMutation.mutateAsync(adoptionId);
          toast.success("Hoàn thành đơn nhận nuôi thành công!");
          break;
      }
    } catch (error) {
      const errMsg = getAuthErrorMessage(error, "Thực hiện thao tác thất bại.");
      toast.error(errMsg);
    }
  };

  const getMutationState = (actionType: string) => {
    switch (actionType) {
      case "APPROVE":
        return approveMutation.isPending;
      case "REJECT":
        return rejectMutation.isPending;
      case "CANCEL":
        return cancelMutation.isPending;
      case "COMPLETE":
        return completeMutation.isPending;
      default:
        return false;
    }
  };

  const confirmInfo = confirmingAction ? CONFIRM_DETAILS[confirmingAction] : null;

  return (
    <>
      <section className="flex flex-wrap items-center justify-end gap-3 rounded-3xl border bg-muted/20 p-5 mt-6">
        {actions.map((act) => {
          const isCurrentLoading = getMutationState(act.actionType);
          return (
            <Button
              key={act.actionType}
              type="button"
              variant={act.variant}
              disabled={disabled || isSubmitting}
              onClick={() => setConfirmingAction(act.actionType)}
              className="min-w-28 font-medium cursor-pointer transition-all duration-200"
            >
              {isCurrentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {act.loadingLabel}
                </>
              ) : (
                act.label
              )}
            </Button>
          );
        })}
      </section>

      {confirmInfo && (
        <ConfirmationDialog
          open={!!confirmingAction}
          onOpenChange={(open) => !open && setConfirmingAction(null)}
          title={confirmInfo.title}
          description={confirmInfo.description}
          confirmText={confirmInfo.confirmText}
          variant={confirmInfo.variant}
          onConfirm={handleConfirm}
          disabled={isSubmitting}
        />
      )}
    </>
  );
}
