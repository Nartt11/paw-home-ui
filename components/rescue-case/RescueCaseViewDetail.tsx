"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  HandHeart,
  Loader2,
  MapPin,
  MessageSquarePlus,
  Phone,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { RescueCaseUpdate as RescueCaseEditForm } from "@/components/rescue-case/RescueCaseUpdate";
import { CompleteRescueDialog } from "@/components/rescue-case/CompleteRescueDialog";
import {
  ClaimCaseDialog,
  PetFromCaseDialog,
  ReasonDialog,
  ReleaseClaimDialog,
} from "@/components/rescue-case/RescueFlowDialogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useRequireLogin } from "@/hooks/use-require-login";
import {
  useApproveRescueCompletion,
  useMyRescueClaims,
  useRescueCompletionDetail,
  useUpdateRescueCaseStatus,
} from "@/hooks/use-rescue-case";
import { useCaseClaims, useCaseUpdates, useDecideCompletion, useExtendClaim, usePostCaseUpdate } from "@/hooks/use-rescue-flow";
import { apiErrorMessage } from "@/lib/api-error";
import { formatDateTime, formatRelativeTime, formatTimeLeft } from "@/lib/datetime";
import { speciesLabel } from "@/lib/pet-display";
import {
  RESCUE_CASE_TYPE_LABEL,
  RESCUE_COMPLETION_STATUS_LABEL,
  RESCUE_OUTCOME_LABEL,
  RESCUE_STATUS_LABEL,
  isOpenRescueStatus,
  rescuePriorityLabel,
  rescueStatusLabel,
} from "@/lib/rescue-case-display";
import type { RescueCase, RescueCaseStatus, RescueCompletion } from "@/types/rescue-case.type";

const MapPicker = dynamic(() => import("@/components/map/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 w-full items-center justify-center rounded-lg border bg-muted/30 text-sm text-muted-foreground">
      Đang tải bản đồ...
    </div>
  ),
});

const STATUS_BADGE: Record<RescueCaseStatus, string> = {
  REPORTED: "border-amber-200 bg-amber-50 text-amber-800",
  IN_PROGRESS: "border-sky-200 bg-sky-50 text-sky-800",
  RESCUED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CLOSED: "border-slate-200 bg-slate-100 text-slate-700",
};

const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL: "border-red-200 bg-red-50 text-red-800",
  HIGH: "border-rose-200 bg-rose-50 text-rose-800",
  NORMAL: "border-slate-200 bg-slate-50 text-slate-700",
  LOW: "border-slate-200 bg-white text-slate-600",
};

const HANDLER_ROLES = ["OWNER", "STAFF"];

/** Who the viewer is for this case; decides which actions the dialog offers. */
function useViewer(rescueCase: RescueCase | null) {
  const { signedIn, currentUser, requireLogin } = useRequireLogin();
  const roles = (currentUser?.roles ?? []).map((role) => role.toUpperCase());
  const isAdmin = roles.includes("ADMIN");
  const isStaff = HANDLER_ROLES.includes((currentUser?.organizationRole ?? "").toUpperCase());
  const caseOrg = rescueCase?.organizationId;
  const ownOrg = currentUser?.organizationId;
  return {
    signedIn,
    requireLogin,
    userId: currentUser?.userId,
    isAdmin,
    isStaff,
    /** May review reports and post notes: admins, and staff of the organization holding the case (or any, while nobody holds it). */
    canHandle: isAdmin || (isStaff && (!caseOrg || caseOrg === ownOrg)),
    /** Staff of the organization that holds the case. */
    holdsCase: !!caseOrg && isStaff && caseOrg === ownOrg,
    isReporter: !!rescueCase?.viewerIsReporter,
    hasClaim: !!rescueCase?.viewerHasActiveClaim,
  };
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

/** The completion report and what the viewer can do with it. */
function CompletionPanel({
  rescueCase,
  completion,
  viewer,
}: {
  rescueCase: RescueCase;
  completion: RescueCompletion;
  viewer: ReturnType<typeof useViewer>;
}) {
  const decideMutation = useDecideCompletion();
  const approveMutation = useApproveRescueCompletion();
  const [reasonFor, setReasonFor] = React.useState<"dispute" | "reject" | null>(null);

  const status = completion.status ?? rescueCase.completionStatus;
  const submittedByMe = !!viewer.userId && completion.submittedBy === viewer.userId;
  const waiting = status === "PENDING" || status === "DISPUTED";
  // The reporter answers "right / not right" for someone else's report.
  const reporterDecides = status === "PENDING" && viewer.isReporter && !submittedByMe;
  // Handlers and admins approve or reject; nobody but an admin reviews their own report.
  const handlerDecides = waiting && viewer.canHandle && !viewer.isReporter && (viewer.isAdmin || !submittedByMe);

  const confirm = async () => {
    try {
      await decideMutation.mutateAsync({ completionId: completion.completionId, decision: "confirm" });
      toast.success("Cảm ơn bạn đã xác nhận. Ca đã chuyển sang Đã cứu.");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const approve = async () => {
    try {
      await approveMutation.mutateAsync(completion.completionId);
      toast.success("Đã duyệt báo cáo. Ca chuyển sang Đã cứu.");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Section title="Báo cáo đã cứu xong" icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />}>
      <div className="space-y-3 rounded-xl border bg-emerald-50/40 p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {status ? (
            <Badge variant="outline">{RESCUE_COMPLETION_STATUS_LABEL[status]}</Badge>
          ) : null}
          {completion.outcome ? (
            <span className="font-medium">{RESCUE_OUTCOME_LABEL[completion.outcome]}</span>
          ) : null}
          <span className="text-muted-foreground">
            · {completion.submittedByName ?? "Người cứu"} · {formatDateTime(completion.rescuedAt)}
          </span>
        </div>
        {completion.rescueNote ? <p className="whitespace-pre-wrap text-sm">{completion.rescueNote}</p> : null}
        {completion.locationNote ? (
          <p className="text-sm text-muted-foreground">Bé đang ở: {completion.locationNote}</p>
        ) : null}
        {completion.verificationImagesUrl?.length ? (
          <div className="flex flex-wrap gap-2">
            {completion.verificationImagesUrl.map((url, index) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="relative block size-20 overflow-hidden rounded-md border">
                <Image src={url} alt={`Ảnh báo cáo ${index + 1}`} fill sizes="80px" className="object-cover" />
              </a>
            ))}
          </div>
        ) : null}
        {completion.rejectReason ? (
          <p className="text-sm text-rose-700">Lý do: {completion.rejectReason}</p>
        ) : null}

        {reporterDecides ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={confirm} disabled={decideMutation.isPending}>
              {decideMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Đúng, bé đã được cứu
            </Button>
            <Button variant="outline" onClick={() => setReasonFor("dispute")}>
              Không đúng
            </Button>
          </div>
        ) : null}

        {handlerDecides ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={approve} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Duyệt báo cáo
            </Button>
            <Button variant="outline" onClick={() => setReasonFor("reject")}>
              Từ chối
            </Button>
          </div>
        ) : null}

        {status === "PENDING" && submittedByMe ? (
          <p className="text-sm text-muted-foreground">Đang chờ người báo ca hoặc tổ chức xác nhận báo cáo của bạn.</p>
        ) : null}
      </div>

      <ReasonDialog
        open={reasonFor !== null}
        onOpenChange={(open) => !open && setReasonFor(null)}
        title={reasonFor === "dispute" ? "Báo cáo không đúng?" : "Từ chối báo cáo"}
        description={
          reasonFor === "dispute"
            ? "Quản trị viên sẽ xem lại. Hãy nói điều bạn thấy khác với báo cáo."
            : "Ca sẽ mở lại để nhận báo cáo khác. Người gửi sẽ thấy lý do."
        }
        placeholder={reasonFor === "dispute" ? "Ví dụ: bé vẫn còn ở chỗ cũ lúc 18h" : "Ví dụ: ảnh không phải bé trong ca"}
        confirmLabel={reasonFor === "dispute" ? "Gửi cho quản trị viên" : "Từ chối báo cáo"}
        destructive={reasonFor === "reject"}
        onConfirm={async (reason) => {
          if (!reasonFor) return;
          await decideMutation.mutateAsync({ completionId: completion.completionId, decision: reasonFor, reason });
          toast.success(reasonFor === "dispute" ? "Đã gửi cho quản trị viên xem lại." : "Đã từ chối báo cáo.");
        }}
      />
    </Section>
  );
}

/** Progress notes: who did what, newest first, with a box to add one. */
function ProgressNotes({ caseId, canPost, closed }: { caseId: string; canPost: boolean; closed: boolean }) {
  const updatesQuery = useCaseUpdates(caseId);
  const postMutation = usePostCaseUpdate();
  const [note, setNote] = React.useState("");
  const updates = updatesQuery.data?.content ?? [];

  const submit = async () => {
    try {
      await postMutation.mutateAsync({ caseId, note: note.trim() });
      setNote("");
      toast.success("Đã cập nhật. Người báo ca và người đang giúp sẽ được báo.");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Section title="Tiến độ" icon={<Clock className="h-4 w-4 text-muted-foreground" aria-hidden />}>
      {canPost && !closed ? (
        <div className="space-y-2">
          <Textarea
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ví dụ: đã tới nơi, bé trốn dưới gầm xe, đang dụ ra"
            aria-label="Cập nhật tiến độ"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={submit} disabled={!note.trim() || postMutation.isPending}>
              <MessageSquarePlus className="mr-1.5 h-4 w-4" aria-hidden />
              Cập nhật
            </Button>
          </div>
        </div>
      ) : null}
      {updatesQuery.isPending ? (
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      ) : updates.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có cập nhật nào.</p>
      ) : (
        <ol className="space-y-3 border-l pl-4">
          {updates.map((update) => (
            <li key={update.updateId} className="relative">
              <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-primary" aria-hidden />
              <div className="text-xs text-muted-foreground">
                {update.authorName} · {formatRelativeTime(update.createdAt)}
              </div>
              <p className="whitespace-pre-wrap text-sm">{update.note}</p>
              {update.imageUrls?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {update.imageUrls.map((url, index) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="relative block size-16 overflow-hidden rounded-md border">
                      <Image src={url} alt={`Ảnh cập nhật ${index + 1}`} fill sizes="64px" className="object-cover" />
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

export interface RescueCaseViewDetailProps {
  rescueCase: RescueCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * One rescue case, for everyone who can open it. What it offers depends on who looks:
 * a guest is asked to sign in; a helper claims, extends, gives back or reports the rescue done;
 * the reporter follows progress, answers the report and may close the case; staff take the case
 * for their organization, review reports and take the animal in; admins can also edit and move it.
 */
export function RescueCaseViewDetail({ rescueCase, open, onOpenChange }: RescueCaseViewDetailProps) {
  const viewer = useViewer(rescueCase);
  const statusMutation = useUpdateRescueCaseStatus();
  const extendMutation = useExtendClaim();
  const myClaimsQuery = useMyRescueClaims(open && viewer.hasClaim);
  const completionQuery = useRescueCompletionDetail(open ? rescueCase?.completionId : undefined);
  const canSeeClaims = open && !!rescueCase && (viewer.isReporter || viewer.canHandle);
  const claimsQuery = useCaseClaims(rescueCase?.caseId, canSeeClaims);

  const [dialog, setDialog] = React.useState<
    null | "claim" | "release" | "complete" | "close" | "edit" | "intake" | "keep"
  >(null);

  if (!rescueCase) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ca cứu hộ</DialogTitle>
            <DialogDescription>Đang tải chi tiết...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const status = rescueCase.status ?? "REPORTED";
  const isOpen = isOpenRescueStatus(status);
  const completion = completionQuery.data;
  const reportWaiting = rescueCase.completionStatus === "PENDING" || rescueCase.completionStatus === "DISPUTED";
  const myClaim = myClaimsQuery.data?.find((claim) => claim.caseId === rescueCase.caseId);
  const activeClaims = (claimsQuery.data ?? []).filter((claim) => claim.status === "ACTIVE");
  const submittedByMe = !!completion && completion.submittedBy === viewer.userId;
  const keptByMe = submittedByMe && completion?.outcome === "KEPT_BY_RESCUER" && completion?.status === "APPROVED";
  const hasCoordinates = Number.isFinite(rescueCase.latitude) && Number.isFinite(rescueCase.longitude);

  // Claiming: staff claim for their organization while nobody holds the case; anyone else makes a personal claim.
  // Nobody new is asked to come while a report says the animal is already rescued.
  const canClaimForOrg = isOpen && !reportWaiting && viewer.isStaff && !rescueCase.organizationId && !viewer.hasClaim;
  const canClaimPersonally =
    isOpen && !reportWaiting && !viewer.isStaff && !viewer.isAdmin && !viewer.isReporter && !viewer.hasClaim;
  const canReportDone = isOpen && !reportWaiting && (viewer.hasClaim || viewer.holdsCase || viewer.isAdmin);
  const canIntake = status === "RESCUED" && !rescueCase.petId && (viewer.holdsCase || (viewer.isAdmin && !!rescueCase.organizationId));

  const askClaim = () => {
    if (!viewer.requireLogin("Đăng nhập để nhận giúp ca này")) return;
    setDialog("claim");
  };

  const extend = async () => {
    try {
      await extendMutation.mutateAsync(rescueCase.caseId);
      toast.success("Đã gia hạn thêm thời gian cho ca.");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full gap-0 p-0 sm:max-w-3xl">
          <DialogHeader className="space-y-2 border-b px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-lg">
                {speciesLabel({ species: rescueCase.species })} cần giúp
              </DialogTitle>
              <Badge variant="outline" className={STATUS_BADGE[status]}>
                {RESCUE_STATUS_LABEL[status]}
              </Badge>
              <Badge variant="outline" className={PRIORITY_BADGE[rescueCase.priority] ?? ""}>
                {rescuePriorityLabel(rescueCase.priority)}
              </Badge>
              {rescueCase.caseType && rescueCase.caseType !== "RESCUE" ? (
                <Badge variant="outline">{RESCUE_CASE_TYPE_LABEL[rescueCase.caseType]}</Badge>
              ) : null}
            </div>
            <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="tabular-nums">Mã ca {rescueCase.caseCode}</span>
              <span>Báo {formatRelativeTime(rescueCase.reportedAt)}</span>
              {rescueCase.activeClaimCount ? (
                <span className="inline-flex items-center gap-1 text-sky-700">
                  <Users className="h-3.5 w-3.5" aria-hidden /> {rescueCase.activeClaimCount} người đang giúp
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[calc(100vh-14rem)] space-y-6 overflow-y-auto px-6 py-5">
            {viewer.hasClaim ? (
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                <div className="font-semibold">Bạn đang nhận ca này</div>
                {myClaim?.expiresAt ? (
                  <div>
                    Thời gian giữ ca {formatTimeLeft(myClaim.expiresAt)} (đến {formatDateTime(myClaim.expiresAt)}). Cần thêm thời gian thì bấm Gia hạn.
                  </div>
                ) : null}
                {rescueCase.contactPhone ? (
                  <a href={`tel:${rescueCase.contactPhone}`} className="mt-1 inline-flex items-center gap-1 font-medium underline">
                    <Phone className="h-3.5 w-3.5" aria-hidden /> Gọi người báo: {rescueCase.contactPhone}
                  </a>
                ) : null}
              </div>
            ) : null}

            {rescueCase.imageUrls?.length ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {rescueCase.imageUrls.map((url, index) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer" className="relative block aspect-square overflow-hidden rounded-lg border bg-muted">
                    <Image src={url} alt={`Ảnh ca ${rescueCase.caseCode} số ${index + 1}`} fill sizes="200px" className="object-cover" />
                  </a>
                ))}
              </div>
            ) : null}

            {rescueCase.description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{rescueCase.description}</p>
            ) : null}

            <dl className="grid gap-4 sm:grid-cols-2">
              <Info
                label="Địa điểm"
                value={
                  <span className="inline-flex items-start gap-1">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {[rescueCase.locationText, rescueCase.wardName, rescueCase.provinceName].filter(Boolean).join(", ")}
                  </span>
                }
              />
              <Info label="Người báo" value={rescueCase.reporterName} />
              <Info label="Tổ chức phụ trách" value={rescueCase.organizationName || "Chưa có"} />
              <Info label="Thời điểm báo" value={formatDateTime(rescueCase.reportedAt)} />
              {rescueCase.color ? <Info label="Màu lông" value={rescueCase.color} /> : null}
              {rescueCase.contactPhone && !viewer.hasClaim ? (
                <Info label="Số liên hệ" value={<a className="underline" href={`tel:${rescueCase.contactPhone}`}>{rescueCase.contactPhone}</a>} />
              ) : null}
              {rescueCase.petId ? (
                <Info
                  label="Hồ sơ thú"
                  value={
                    viewer.canHandle ? (
                      <Link className="text-primary underline" href={`/quan-ly-thu-cung/${rescueCase.petId}`}>
                        {rescueCase.petName || "Xem hồ sơ"}
                      </Link>
                    ) : (
                      rescueCase.petName || "Đã có hồ sơ"
                    )
                  }
                />
              ) : null}
            </dl>

            {hasCoordinates ? (
              <div className="overflow-hidden rounded-lg border">
                <MapPicker title={rescueCase.caseCode} latitude={rescueCase.latitude} longitude={rescueCase.longitude} />
              </div>
            ) : null}

            {activeClaims.length > 0 ? (
              <Section title="Đang giúp ca này" icon={<HandHeart className="h-4 w-4 text-sky-600" aria-hidden />}>
                <ul className="space-y-1 text-sm">
                  {activeClaims.map((claim) => (
                    <li key={claim.claimId} className="flex flex-wrap justify-between gap-2">
                      <span>{claim.organizationId ? "Trung tâm phụ trách" : claim.name ?? "Người giúp"}</span>
                      <span className="text-muted-foreground">
                        nhận {formatRelativeTime(claim.claimedAt)}
                        {claim.expiresAt ? ` · ${formatTimeLeft(claim.expiresAt)}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {completion ? <CompletionPanel rescueCase={rescueCase} completion={completion} viewer={viewer} /> : null}

            <Separator />

            <ProgressNotes
              caseId={rescueCase.caseId}
              canPost={viewer.isReporter || viewer.hasClaim || viewer.canHandle}
              closed={status === "CLOSED"}
            />

            {viewer.isAdmin ? (
              <Section title="Quản trị">
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={status}
                    onValueChange={async (value) => {
                      if (value === status) return;
                      try {
                        await statusMutation.mutateAsync({ id: rescueCase.caseId, status: value });
                        toast.success(`Đã chuyển ca sang ${rescueStatusLabel(value)}.`);
                      } catch (error) {
                        toast.error(apiErrorMessage(error));
                      }
                    }}
                    disabled={statusMutation.isPending}
                  >
                    <SelectTrigger className="w-52" aria-label="Đổi trạng thái ca">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(RESCUE_STATUS_LABEL) as RescueCaseStatus[]).map((value) => (
                        <SelectItem key={value} value={value}>
                          {RESCUE_STATUS_LABEL[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setDialog("edit")}>
                    Sửa thông tin ca
                  </Button>
                </div>
              </Section>
            ) : null}
          </div>

          {/* One primary action, chosen by who is looking and where the case is. */}
          <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30 px-6 py-4">
            {viewer.isReporter && isOpen ? (
              <Button variant="ghost" className="mr-auto text-muted-foreground" onClick={() => setDialog("close")}>
                Đóng ca
              </Button>
            ) : null}

            {viewer.hasClaim ? (
              <>
                {myClaim?.expiresAt ? (
                  <Button variant="outline" onClick={extend} disabled={extendMutation.isPending}>
                    Gia hạn
                  </Button>
                ) : null}
                <Button variant="outline" onClick={() => setDialog("release")}>
                  Trả ca
                </Button>
              </>
            ) : null}

            {canClaimForOrg ? <Button onClick={() => setDialog("claim")}>Nhận ca cho trung tâm</Button> : null}
            {canClaimPersonally ? (
              <Button onClick={askClaim}>{viewer.signedIn ? "Tôi đang đến giúp" : "Đăng nhập để giúp"}</Button>
            ) : null}
            {canReportDone ? (
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setDialog("complete")}>
                Báo đã cứu xong
              </Button>
            ) : null}
            {canIntake ? <Button onClick={() => setDialog("intake")}>Tiếp nhận bé về trung tâm</Button> : null}
            {keptByMe && !rescueCase.petId ? (
              <Button onClick={() => setDialog("keep")}>Thêm bé vào thú của tôi</Button>
            ) : null}
            {(!isOpen || reportWaiting) && !canIntake && !(keptByMe && !rescueCase.petId) ? (
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {dialog === "claim" ? (
        <ClaimCaseDialog rescueCase={rescueCase} asOrganization={canClaimForOrg} open onOpenChange={() => setDialog(null)} />
      ) : null}
      {dialog === "release" ? (
        <ReleaseClaimDialog caseId={rescueCase.caseId} open onOpenChange={() => setDialog(null)} />
      ) : null}
      {dialog === "complete" ? (
        <CompleteRescueDialog rescueId={rescueCase.caseId} open onOpenChange={() => setDialog(null)} />
      ) : null}
      {dialog === "intake" || dialog === "keep" ? (
        <PetFromCaseDialog rescueCase={rescueCase} mode={dialog} open onOpenChange={() => setDialog(null)} />
      ) : null}
      {dialog === "edit" ? (
        <RescueCaseEditForm key={rescueCase.caseId} rescueCase={rescueCase} open onOpenChange={() => setDialog(null)} />
      ) : null}
      <ReasonDialog
        open={dialog === "close"}
        onOpenChange={(next) => !next && setDialog(null)}
        title="Đóng ca"
        description="Người đang giúp sẽ được báo. Ca đã đóng không nhận thêm người giúp."
        placeholder="Ví dụ: bé đã được người nhà đón về"
        confirmLabel="Đóng ca"
        destructive
        onConfirm={async (reason) => {
          await statusMutation.mutateAsync({ id: rescueCase.caseId, status: "CLOSED", reason });
          toast.success("Đã đóng ca.");
        }}
      />
    </>
  );
}
