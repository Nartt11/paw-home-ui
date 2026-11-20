"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HandHeart, MapPin, Megaphone, PawPrint } from "lucide-react";

import RequireAuth from "@/components/auth/RequireAuth";
import { RescueCaseViewDetail } from "@/components/rescue-case/RescueCaseViewDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_ROUTES } from "@/constants/routes";
import { useMyRescueCases, useMyRescueClaims, useRescueCaseDetail } from "@/hooks/use-rescue-case";
import { formatRelativeTime, formatTimeLeft } from "@/lib/datetime";
import { speciesLabel } from "@/lib/pet-display";
import { RESCUE_STATUS_LABEL, rescuePriorityLabel } from "@/lib/rescue-case-display";
import type { RescueCaseStatus } from "@/types/rescue-case.type";

const STATUS_TONE: Record<RescueCaseStatus, string> = {
  REPORTED: "border-amber-200 bg-amber-50 text-amber-800",
  IN_PROGRESS: "border-sky-200 bg-sky-50 text-sky-800",
  RESCUED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CLOSED: "border-slate-200 bg-slate-100 text-slate-700",
};

function EmptyState({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center">
      <div className="text-muted-foreground">{icon}</div>
      <div className="font-semibold">{title}</div>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}

function MyCases() {
  // ?case=<id> opens that case, e.g. from a notification.
  const searchParams = useSearchParams();
  const [tab, setTab] = React.useState("helping");
  const [selectedId, setSelectedId] = React.useState<string | null>(searchParams.get("case"));
  const claimsQuery = useMyRescueClaims();
  const reportedQuery = useMyRescueCases({ page: 0, pageSize: 50 });
  const detailQuery = useRescueCaseDetail(selectedId ?? undefined);

  const claims = claimsQuery.data ?? [];
  const reported = reportedQuery.data?.content ?? [];

  // Land on the reports tab when I am not helping with anything.
  const [chosen, setChosen] = React.useState(false);
  if (!chosen && claimsQuery.isSuccess && reportedQuery.isSuccess) {
    setChosen(true);
    if (claims.length === 0 && reported.length > 0) setTab("reported");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">Ca của tôi</h1>
      <p className="mt-1 text-muted-foreground">Theo dõi ca bạn đã báo và ca bạn đang đến giúp.</p>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="helping">Đang giúp ({claims.length})</TabsTrigger>
          <TabsTrigger value="reported">Tôi đã báo ({reportedQuery.data?.totalElements ?? reported.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="helping" className="mt-4 space-y-3">
          {claimsQuery.isPending ? (
            <div className="h-24 animate-pulse rounded-xl bg-muted" />
          ) : claims.length === 0 ? (
            <EmptyState
              icon={<HandHeart className="h-8 w-8" aria-hidden />}
              title="Bạn chưa nhận ca nào"
              text="Mở bản đồ cứu hộ, chọn một ca gần bạn và bấm “Tôi đang đến giúp”."
              action={
                <Button asChild>
                  <Link href={APP_ROUTES.MAP}>Mở bản đồ cứu hộ</Link>
                </Button>
              }
            />
          ) : (
            claims.map((claim) => (
              <button
                key={claim.claimId}
                type="button"
                onClick={() => setSelectedId(claim.caseId)}
                className="flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition hover:border-primary hover:bg-muted/40"
              >
                <div>
                  <div className="font-semibold">Ca {claim.caseCode}</div>
                  <div className="text-sm text-muted-foreground">
                    Nhận {formatRelativeTime(claim.claimedAt)}
                    {claim.expiresAt ? ` · ${formatTimeLeft(claim.expiresAt)}` : " · trung tâm phụ trách"}
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">Mở ca</span>
              </button>
            ))
          )}
        </TabsContent>

        <TabsContent value="reported" className="mt-4 space-y-3">
          {reportedQuery.isPending ? (
            <div className="h-24 animate-pulse rounded-xl bg-muted" />
          ) : reported.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="h-8 w-8" aria-hidden />}
              title="Bạn chưa báo ca nào"
              text="Thấy thú bị thương, bị bỏ rơi hay mắc kẹt? Báo ca trên bản đồ để người gần đó đến giúp."
              action={
                <Button asChild>
                  <Link href={APP_ROUTES.MAP}>Báo ca cứu hộ</Link>
                </Button>
              }
            />
          ) : (
            reported.map((item) => (
              <button
                key={item.caseId}
                type="button"
                onClick={() => setSelectedId(item.caseId)}
                className="flex w-full gap-4 rounded-xl border p-3 text-left transition hover:border-primary hover:bg-muted/40"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.firstImageUrl ? (
                    <Image src={item.firstImageUrl} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <PawPrint className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{speciesLabel({ species: item.species })}</span>
                    <Badge variant="outline" className={STATUS_TONE[item.status]}>
                      {RESCUE_STATUS_LABEL[item.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{rescuePriorityLabel(item.priority)}</span>
                  </div>
                  <div className="flex items-start gap-1 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="line-clamp-1">{item.locationText}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mã ca {item.caseCode} · báo {formatRelativeTime(item.reportedAt)}
                  </div>
                </div>
              </button>
            ))
          )}
        </TabsContent>
      </Tabs>

      <RescueCaseViewDetail
        rescueCase={detailQuery.data ?? null}
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}

export default function MyCasesPage() {
  return (
    <RequireAuth>
      <React.Suspense fallback={null}>
        <MyCases />
      </React.Suspense>
    </RequireAuth>
  );
}
