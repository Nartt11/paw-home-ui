"use client";

import * as React from "react";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import RequireAuth from "@/components/auth/RequireAuth";
import TitlePerPage from "@/components/common/admin/TitlePerPage";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ORGANIZATION_ROLES, SYSTEM_ROLES } from "@/constants/roles";
import { useFollowupAlerts, useRecordAdoptionOutcome, useUpdateFollowupAlert } from "@/hooks/use-followup";
import { apiErrorMessage } from "@/lib/api-error";
import { formatDateTime, formatRelativeTime } from "@/lib/datetime";
import {
  FOLLOWUP_ALERT_STATUS_LABEL,
  FOLLOWUP_RESOLUTION_LABEL,
  FOLLOWUP_SEVERITY_BADGE,
  FOLLOWUP_SEVERITY_LABEL,
  followupReasonLabel,
} from "@/lib/followup-display";
import type { FollowupAlert, FollowupAlertResolution, FollowupAlertStatus, ReturnReasonCode } from "@/types/followup.type";

const RETURN_REASONS = new Set<string>([
  "BEHAVIOR",
  "PET_CONFLICT",
  "CHILDREN",
  "HOUSING_MOVING",
  "ALLERGY",
  "FINANCIAL",
  "HEALTH_OWNER",
  "TIME",
  "HEALTH_PET",
  "OTHER",
]);

/** Close an alert: how it ended, a note, and, when the pet came back, record that outcome too. */
function ResolveDialog({ alert, open, onOpenChange }: { alert: FollowupAlert; open: boolean; onOpenChange: (open: boolean) => void }) {
  const updateMutation = useUpdateFollowupAlert();
  const outcomeMutation = useRecordAdoptionOutcome();
  const [resolution, setResolution] = React.useState<FollowupAlertResolution>("ADVISED");
  const [note, setNote] = React.useState("");
  const pending = updateMutation.isPending || outcomeMutation.isPending;

  const submit = async () => {
    try {
      if (resolution === "RETURNED") {
        // The adopter's reason travels with the alert; returning never costs them reputation.
        const reasonCode = alert.reasons.find((reason) => RETURN_REASONS.has(reason)) as ReturnReasonCode | undefined;
        await outcomeMutation.mutateAsync({
          applicationId: alert.applicationId,
          outcomeType: "RETURNED_BY_ADOPTER",
          reasonCode: reasonCode ?? "OTHER",
          note: note.trim() || undefined,
        });
        // Recording the outcome already closes every open alert of this adoption.
      } else {
        await updateMutation.mutateAsync({ alertId: alert.alertId, status: "RESOLVED", resolution, note: note.trim() || undefined });
      }
      toast.success(resolution === "RETURNED" ? `Đã ghi nhận ${alert.petName} về lại trung tâm.` : "Đã đóng việc.");
      onOpenChange(false);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đóng việc: {alert.petName}</DialogTitle>
          <DialogDescription>Kết quả được lưu vào lịch sử đơn để lần sau theo dõi tốt hơn.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="alert-resolution">Kết quả</Label>
            <Select value={resolution} onValueChange={(value) => setResolution(value as FollowupAlertResolution)}>
              <SelectTrigger id="alert-resolution" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(FOLLOWUP_RESOLUTION_LABEL) as FollowupAlertResolution[]).map((value) => (
                  <SelectItem key={value} value={value}>
                    {FOLLOWUP_RESOLUTION_LABEL[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {resolution === "RETURNED" ? (
              <p className="text-xs text-muted-foreground">
                Bé sẽ về lại trung tâm ở trạng thái đang chăm sóc, các lần hỏi thăm còn lại bị huỷ. Người nhận không bị trừ điểm.
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alert-note">Ghi chú</Label>
            <Textarea id="alert-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Huỷ
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Đóng việc
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertRow({ alert }: { alert: FollowupAlert }) {
  const updateMutation = useUpdateFollowupAlert();
  const [resolveOpen, setResolveOpen] = React.useState(false);

  const take = async () => {
    try {
      await updateMutation.mutateAsync({ alertId: alert.alertId, status: "IN_PROGRESS" });
      toast.success("Bạn đã nhận việc này.");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <li className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={FOLLOWUP_SEVERITY_BADGE[alert.severity]}>
            {FOLLOWUP_SEVERITY_LABEL[alert.severity]}
          </Badge>
          <span className="font-semibold">{alert.petName}</span>
          <Badge variant="outline">{FOLLOWUP_ALERT_STATUS_LABEL[alert.status]}</Badge>
        </div>
        <p className="text-sm">{alert.reasons.map(followupReasonLabel).join(" · ")}</p>
        {alert.note ? <p className="text-sm text-muted-foreground">“{alert.note}”</p> : null}
        <p className="text-xs text-muted-foreground" title={formatDateTime(alert.createdAt)}>
          Tạo {formatRelativeTime(alert.createdAt)}
          {alert.resolvedAt
            ? ` · xong ${formatRelativeTime(alert.resolvedAt)}${alert.resolution ? `: ${FOLLOWUP_RESOLUTION_LABEL[alert.resolution]}` : ""}`
            : ""}
        </p>
      </div>
      {alert.status !== "RESOLVED" ? (
        <div className="flex shrink-0 gap-2">
          {alert.status === "OPEN" ? (
            <Button variant="outline" onClick={take} disabled={updateMutation.isPending}>
              Nhận việc
            </Button>
          ) : null}
          <Button onClick={() => setResolveOpen(true)}>Đóng việc</Button>
        </div>
      ) : null}
      <ResolveDialog alert={alert} open={resolveOpen} onOpenChange={setResolveOpen} />
    </li>
  );
}

function FollowupAlerts() {
  const [status, setStatus] = React.useState<FollowupAlertStatus | "ACTIVE">("ACTIVE");
  // "ACTIVE" shows open and in-progress work together; the API filters one status at a time.
  const alertsQuery = useFollowupAlerts(status === "ACTIVE" ? undefined : status);
  const alerts = (alertsQuery.data ?? []).filter((alert) => (status === "ACTIVE" ? alert.status !== "RESOLVED" : true));
  const red = alerts.filter((alert) => alert.severity === "RED" && alert.status !== "RESOLVED").length;

  return (
    <div className="space-y-6">
      <TitlePerPage
        title="Việc sau nhận nuôi"
        description="Câu trả lời hỏi thăm đáng lo, yêu cầu tư vấn và yêu cầu trả bé. Việc khẩn lên đầu."
      />

      <Tabs value={status} onValueChange={(value) => setStatus(value as FollowupAlertStatus | "ACTIVE")}>
        <TabsList>
          <TabsTrigger value="ACTIVE">Cần xử lý</TabsTrigger>
          <TabsTrigger value="RESOLVED">Đã xong</TabsTrigger>
        </TabsList>
      </Tabs>

      {red > 0 ? <p className="text-sm font-medium text-red-700">{red} việc khẩn đang chờ.</p> : null}

      {alertsQuery.isPending ? (
        [...Array(3)].map((_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />)
      ) : alertsQuery.isError ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {apiErrorMessage(alertsQuery.error)}
        </p>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center">
          <ClipboardCheck className="h-8 w-8 text-muted-foreground" aria-hidden />
          <div className="font-semibold">{status === "RESOLVED" ? "Chưa có việc nào đã xong" : "Không có việc cần xử lý"}</div>
          <p className="text-sm text-muted-foreground">Việc mới xuất hiện khi người nhận trả lời hỏi thăm đáng lo hoặc xin hỗ trợ.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <AlertRow key={alert.alertId} alert={alert} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FollowupAlertsPage() {
  return (
    <RequireAuth
      allowedSystemRoles={[SYSTEM_ROLES.ADMIN]}
      allowedOrganizationRoles={[ORGANIZATION_ROLES.OWNER, ORGANIZATION_ROLES.STAFF]}
    >
      <FollowupAlerts />
    </RequireAuth>
  );
}
