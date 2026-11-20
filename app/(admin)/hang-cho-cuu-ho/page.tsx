"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Inbox, MapPin, PawPrint, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";

import RequireAuth from "@/components/auth/RequireAuth";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
import { RescueCaseViewDetail } from "@/components/rescue-case/RescueCaseViewDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORGANIZATION_ROLES, SYSTEM_ROLES } from "@/constants/roles";
import { APP_ROUTES } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRescueCaseDetail } from "@/hooks/use-rescue-case";
import { useClaimCase, useOrganizationRescueQueue } from "@/hooks/use-rescue-flow";
import { apiErrorMessage } from "@/lib/api-error";
import { formatDateTime, formatRelativeTime } from "@/lib/datetime";
import { speciesLabel } from "@/lib/pet-display";
import { rescuePriorityLabel } from "@/lib/rescue-case-display";
import type { RescueCasePriority, RescueQueueItem } from "@/types/rescue-case.type";

const PRIORITY_RANK: Record<RescueCasePriority, number> = { LOW: 0, NORMAL: 1, HIGH: 2, CRITICAL: 3 };

const PRIORITY_TONE: Record<RescueCasePriority, string> = {
  CRITICAL: "border-red-200 bg-red-50 text-red-800",
  HIGH: "border-rose-200 bg-rose-50 text-rose-800",
  NORMAL: "border-slate-200 bg-slate-50 text-slate-700",
  LOW: "border-slate-200 bg-white text-slate-600",
};

/** Reported facts the AI found missing, in plain words. */
const MISSING_LABEL: Record<string, string> = {
  PHOTO: "Thiếu ảnh",
  DESCRIPTION: "Mô tả quá ngắn",
  SPECIES: "Chưa rõ loài",
  LOCATION: "Vị trí chưa rõ",
};

function QueueRow({
  item,
  canClaim,
  onOpen,
}: {
  item: RescueQueueItem;
  canClaim: boolean;
  onOpen: () => void;
}) {
  const claimMutation = useClaimCase();
  const effective = item.effectivePriority ?? item.priority;
  const raisedByAi = PRIORITY_RANK[effective] > PRIORITY_RANK[item.priority];

  const claim = async () => {
    try {
      await claimMutation.mutateAsync({ caseId: item.caseId, safetyAcknowledged: true });
      toast.success(
        item.awaitingHandover
          ? `Trung tâm đã nhận bàn giao bé ở ca ${item.caseCode}.`
          : `Trung tâm đã nhận ca ${item.caseCode}. Người báo ca sẽ được báo.`,
      );
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <li className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 gap-4 text-left">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {item.firstImageUrl ? (
            <Image src={item.firstImageUrl} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <PawPrint className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" aria-hidden />
          )}
        </div>
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={PRIORITY_TONE[effective]}>
              {rescuePriorityLabel(effective)}
              {raisedByAi ? <span className="ml-1 font-semibold">· AI ↑</span> : null}
            </Badge>
            <span className="font-semibold">{speciesLabel({ species: item.species })}</span>
            {item.awaitingHandover ? (
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
                Đã cứu, chờ trung tâm nhận
              </Badge>
            ) : null}
            <span className="text-xs text-muted-foreground tabular-nums">Mã ca {item.caseCode}</span>
          </div>
          {item.aiSummary ? (
            <p className="flex items-start gap-1.5 text-sm">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" aria-label="AI gợi ý" />
              <span>{item.aiSummary}</span>
            </p>
          ) : item.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          ) : null}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {[item.locationText, item.wardName, item.provinceName].filter(Boolean).join(", ")}
            </span>
            <span className="inline-flex items-center gap-1" title={formatDateTime(item.reportedAt)}>
              <Clock className="h-3.5 w-3.5" aria-hidden /> báo {formatRelativeTime(item.reportedAt)}
            </span>
            {item.activeClaimCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-sky-700">
                <Users className="h-3.5 w-3.5" aria-hidden /> {item.activeClaimCount} người đang giúp
              </span>
            ) : null}
          </div>
          {item.missingFields?.length ? (
            <div className="flex flex-wrap gap-1">
              {item.missingFields.map((field) => (
                <Badge key={field} variant="outline" className="text-xs font-normal">
                  {MISSING_LABEL[field] ?? field}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </button>
      <div className="flex shrink-0 items-start gap-2 sm:flex-col sm:items-end">
        {canClaim ? (
          <Button onClick={claim} disabled={claimMutation.isPending}>
            {item.awaitingHandover ? "Nhận bàn giao" : "Nhận ca"}
          </Button>
        ) : null}
        <Button variant="outline" onClick={onOpen}>
          Xem ca
        </Button>
      </div>
    </li>
  );
}

function RescueQueue() {
  const currentUser = useCurrentUser().data;
  const isAdmin = (currentUser?.roles ?? []).some((role) => role.toUpperCase() === "ADMIN");
  const isStaff = ["OWNER", "STAFF"].includes((currentUser?.organizationRole ?? "").toUpperCase());
  const [selectedCaseId, setSelectedCaseId] = React.useState<string | null>(null);

  const queueQuery = useOrganizationRescueQueue(0, !!currentUser);
  const detailQuery = useRescueCaseDetail(selectedCaseId ?? undefined);

  const items = queueQuery.data?.content ?? [];
  const urgent = items.filter((item) => (item.effectivePriority ?? item.priority) === "CRITICAL").length;

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Hàng chờ cứu hộ"
        description={
          isAdmin
            ? "Ca chưa ai nhận ở mọi tỉnh, ca nguy cấp lên đầu."
            : "Ca chưa ai nhận trong tỉnh của trung tâm, ca nguy cấp lên đầu. Nhận ca để người báo biết đã có người lo."
        }
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="font-medium">Ca chờ nhận: {queueQuery.data?.totalElements ?? items.length}</span>
        {urgent > 0 ? <span className="font-medium text-red-700">{urgent} ca nguy cấp</span> : null}
        {isAdmin ? (
          <Link href={APP_ROUTES.RESCUE_CASE_MANAGEMENT} className="ml-auto text-primary hover:underline">
            Báo cáo hoàn tất cần duyệt nằm ở Quản lý cứu trợ
          </Link>
        ) : null}
      </div>

      {queueQuery.isPending ? (
        [...Array(3)].map((_, index) => <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />)
      ) : queueQuery.isError ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {apiErrorMessage(queueQuery.error)}
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden />
          <div className="font-semibold">Không có ca đang chờ trong tỉnh</div>
          <p className="text-sm text-muted-foreground">Ca mới sẽ hiện ở đây ngay khi có người báo.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <QueueRow key={item.caseId} item={item} canClaim={isStaff} onOpen={() => setSelectedCaseId(item.caseId)} />
          ))}
        </ul>
      )}

      <RescueCaseViewDetail
        rescueCase={detailQuery.data ?? null}
        open={!!selectedCaseId}
        onOpenChange={(open) => !open && setSelectedCaseId(null)}
      />
    </div>
  );
}

export default function RescueQueuePage() {
  return (
    <RequireAuth
      allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}
      allowedOrganizationRoles={[ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.STAFF]}
    >
      <RescueQueue />
    </RequireAuth>
  );
}
