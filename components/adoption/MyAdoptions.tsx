"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, HeartHandshake, LifeBuoy, Loader2, PawPrint } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { APP_ROUTES } from "@/constants/routes";
import { useAdoptionsByUser, useCancelAdoption } from "@/hooks/use-adoption";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useFollowupTimeline, useReturnRequest, useSupportRequest } from "@/hooks/use-followup";
import { adoptionStatusBadge, adoptionStatusLabel } from "@/lib/adoption-display";
import { apiErrorMessage } from "@/lib/api-error";
import { formatDate, formatDateTime } from "@/lib/datetime";
import { FOLLOWUP_MILESTONE_LABEL, RETURN_REASON_LABEL } from "@/lib/followup-display";
import type { AdoptionStatus, AdoptionSummary } from "@/types/adoption.type";
import type { ReturnReasonCode } from "@/types/followup.type";

const FILTERS: Array<{ value: "ALL" | AdoptionStatus; label: string }> = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Chờ đón" },
  { value: "COMPLETED", label: "Đã đón về" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "CANCELED", label: "Đã huỷ" },
];

/** Check-ins of a completed adoption: which ones are done and which one is next. */
function FollowupTimeline({ applicationId }: { applicationId: string }) {
  const query = useFollowupTimeline(applicationId);
  const followups = query.data ?? [];
  if (query.isPending) return <p className="text-xs text-muted-foreground">Đang tải lịch hỏi thăm...</p>;
  if (followups.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground">Lịch hỏi thăm sau nhận nuôi</p>
      <ol className="flex flex-wrap gap-2">
        {followups.map((followup) => {
          const answered = !!followup.respondedAt;
          return (
            <li
              key={followup.followupId}
              className={`rounded-full border px-3 py-1 text-xs ${
                answered ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700"
              }`}
              title={answered ? `Đã trả lời ${formatDateTime(followup.respondedAt)}` : `Đến hạn ${formatDate(followup.dueAt)}`}
            >
              {FOLLOWUP_MILESTONE_LABEL[followup.milestone] ?? followup.milestone} ·{" "}
              {answered ? "đã trả lời" : `hạn ${formatDate(followup.dueAt)}`}
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-muted-foreground">Đến hạn, chúng tôi gửi email kèm đường dẫn; trả lời chưa tới 1 phút.</p>
    </div>
  );
}

function SupportDialog({ adoption, open, onOpenChange }: { adoption: AdoptionSummary; open: boolean; onOpenChange: (open: boolean) => void }) {
  const supportMutation = useSupportRequest();
  const [note, setNote] = React.useState("");

  const submit = async () => {
    try {
      await supportMutation.mutateAsync({ applicationId: adoption.applicationId, note: note.trim() || undefined });
      toast.success(`Đã gửi. ${adoption.organizationName ?? "Trung tâm"} sẽ liên hệ với bạn sớm.`);
      setNote("");
      onOpenChange(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !supportMutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nhờ trung tâm tư vấn</DialogTitle>
          <DialogDescription>
            Bé ăn ít, sợ người, đi vệ sinh bừa? Kể ngắn gọn, nhân viên của {adoption.organizationName ?? "trung tâm"} sẽ gọi lại.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="support-note">Điều bạn cần hỗ trợ</Label>
          <Textarea id="support-note" rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={supportMutation.isPending}>
            Huỷ
          </Button>
          <Button onClick={submit} disabled={supportMutation.isPending}>
            {supportMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReturnDialog({ adoption, open, onOpenChange }: { adoption: AdoptionSummary; open: boolean; onOpenChange: (open: boolean) => void }) {
  const returnMutation = useReturnRequest();
  const [reason, setReason] = React.useState<ReturnReasonCode | null>(null);
  const [note, setNote] = React.useState("");

  const submit = async () => {
    if (!reason) return;
    try {
      await returnMutation.mutateAsync({ applicationId: adoption.applicationId, reasonCode: reason, note: note.trim() || undefined });
      toast.success("Đã gửi. Trung tâm sẽ liên hệ để sắp xếp đón bé về.");
      onOpenChange(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !returnMutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Không nuôi được {adoption.petName} nữa?</DialogTitle>
          <DialogDescription>
            Chuyện này vẫn xảy ra và bạn không bị trừ điểm uy tín. Báo sớm giúp bé được đón về an toàn thay vì bị bỏ rơi.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2" role="radiogroup" aria-label="Lý do">
          <Label>Lý do chính</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(RETURN_REASON_LABEL) as ReturnReasonCode[]).map((code) => (
              <label
                key={code}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="return-reason"
                  checked={reason === code}
                  onChange={() => setReason(code)}
                  className="accent-primary"
                />
                {RETURN_REASON_LABEL[code]}
              </label>
            ))}
          </div>
          <Label htmlFor="return-note" className="mt-2">
            Ghi chú (không bắt buộc)
          </Label>
          <Textarea id="return-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={returnMutation.isPending}>
            Để tôi suy nghĩ thêm
          </Button>
          <Button variant="destructive" onClick={submit} disabled={!reason || returnMutation.isPending}>
            {returnMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Gửi yêu cầu trả bé
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdoptionCard({ adoption }: { adoption: AdoptionSummary }) {
  const cancelMutation = useCancelAdoption();
  const [dialog, setDialog] = React.useState<null | "support" | "return">(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const status = adoption.status;

  const cancel = async () => {
    try {
      await cancelMutation.mutateAsync(adoption.applicationId);
      toast.success("Đã huỷ đơn.");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <li className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border bg-muted">
            {adoption.petPrimaryImageUrl ? (
              <Image src={adoption.petPrimaryImageUrl} alt={adoption.petName} fill sizes="56px" className="object-cover" />
            ) : (
              <PawPrint className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground" aria-hidden />
            )}
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">
              {adoption.petId ? (
                <Link href={APP_ROUTES.adoptionDetail(adoption.petId)} className="hover:underline">
                  {adoption.petName}
                </Link>
              ) : (
                adoption.petName
              )}
            </h4>
            <p className="text-xs text-muted-foreground">
              {adoption.organizationName ? `${adoption.organizationName} · ` : ""}
              Mã đơn {adoption.adoptionCode} · gửi {formatDate(adoption.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={adoptionStatusBadge(status)}>
          {adoptionStatusLabel(status)}
        </Badge>
      </div>

      {status === "APPROVED" ? (
        <p className="flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900">
          <CalendarCheck className="h-4 w-4 shrink-0" aria-hidden />
          {adoption.readyAt
            ? `Đơn đã được duyệt. Hẹn đón bé từ ${formatDateTime(adoption.readyAt)}.`
            : "Đơn đã được duyệt. Trung tâm sẽ liên hệ hẹn ngày đón bé."}
        </p>
      ) : null}

      {status === "COMPLETED" ? <FollowupTimeline applicationId={adoption.applicationId} /> : null}

      <div className="flex flex-wrap items-center gap-2 border-t pt-3">
        <button
          type="button"
          onClick={() => setShowDetails((value) => !value)}
          className="mr-auto text-xs font-semibold text-primary hover:underline"
          aria-expanded={showDetails}
        >
          {showDetails ? "Ẩn nội dung đơn" : "Xem nội dung đơn"}
        </button>
        {status === "PENDING" || status === "APPROVED" ? (
          <Button variant="outline" size="sm" onClick={cancel} disabled={cancelMutation.isPending} className="text-destructive">
            Huỷ đơn
          </Button>
        ) : null}
        {status === "COMPLETED" ? (
          <>
            <Button variant="outline" size="sm" onClick={() => setDialog("support")}>
              <LifeBuoy className="mr-1.5 h-4 w-4" aria-hidden /> Tôi cần hỗ trợ
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDialog("return")} className="text-muted-foreground">
              Tôi không nuôi được nữa
            </Button>
          </>
        ) : null}
      </div>

      {showDetails ? (
        <dl className="space-y-3 rounded-xl bg-muted/40 p-4 text-sm">
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Kinh nghiệm chăm sóc</dt>
            <dd className="mt-1">{adoption.experience || "Chưa ghi."}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">Điều kiện sống</dt>
            <dd className="mt-1">{adoption.liveCondition || "Chưa ghi."}</dd>
          </div>
        </dl>
      ) : null}

      <SupportDialog adoption={adoption} open={dialog === "support"} onOpenChange={(open) => !open && setDialog(null)} />
      <ReturnDialog adoption={adoption} open={dialog === "return"} onOpenChange={(open) => !open && setDialog(null)} />
    </li>
  );
}

/** The adoption requests I sent, what happened to each, and the help available after taking a pet home. */
export function MyAdoptions() {
  const currentUser = useCurrentUser().data;
  const adoptionsQuery = useAdoptionsByUser(currentUser?.userId, { page: 0, pageSize: 50 });
  const [filter, setFilter] = React.useState<"ALL" | AdoptionStatus>("ALL");
  const adoptions = React.useMemo(() => adoptionsQuery.data?.content ?? [], [adoptionsQuery.data]);
  const shown = filter === "ALL" ? adoptions : adoptions.filter((item) => item.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Hồ sơ nhận nuôi của tôi</h3>
        <p className="text-sm text-muted-foreground">Đơn bạn đã gửi, kết quả, và hỗ trợ sau khi đón bé về.</p>
      </div>

      {adoptionsQuery.isPending ? (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Đang tải...
        </div>
      ) : adoptionsQuery.isError ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Không tải được danh sách đơn. {apiErrorMessage(adoptionsQuery.error)}
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => adoptionsQuery.refetch()}>
              Thử lại
            </Button>
          </div>
        </div>
      ) : adoptions.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <HeartHandshake className="mx-auto mb-4 h-10 w-10 text-muted-foreground opacity-50" aria-hidden />
          <p className="text-sm font-medium text-muted-foreground">Bạn chưa gửi đơn nhận nuôi nào.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href={APP_ROUTES.ADOPTION}>Xem các bé đang chờ nhà</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lọc theo trạng thái">
            {FILTERS.map((item) => {
              const count = item.value === "ALL" ? adoptions.length : adoptions.filter((a) => a.status === item.value).length;
              if (item.value !== "ALL" && count === 0) return null;
              const active = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {item.label} ({count})
                </button>
              );
            })}
          </div>
          <ul className="space-y-4">
            {shown.map((adoption) => (
              <AdoptionCard key={adoption.applicationId} adoption={adoption} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
