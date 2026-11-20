import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adoptionKeys } from "@/hooks/use-adoption";
import { petKeys } from "@/hooks/use-pet";
import followupService from "@/services/followup/followup";
import type {
  AdoptionOutcomeType,
  FollowupAlertResolution,
  FollowupAlertStatus,
  FollowupAnswers,
  ReturnReasonCode,
} from "@/types/followup.type";

export const followupKeys = {
  all: ["followups"] as const,
  form: (token: string) => [...followupKeys.all, "form", token] as const,
  timeline: (applicationId: string) => [...followupKeys.all, "timeline", applicationId] as const,
  alerts: (status?: FollowupAlertStatus) => [...followupKeys.all, "alerts", status ?? "all"] as const,
  myPets: () => ["pets", "mine"] as const,
};

export function useFollowupForm(token?: string) {
  return useQuery({
    queryKey: followupKeys.form(token ?? ""),
    queryFn: () => followupService.getForm(token as string),
    enabled: !!token,
    retry: false,
  });
}

export function useRespondFollowup() {
  return useMutation({
    mutationFn: ({ token, answers }: { token: string; answers: FollowupAnswers }) =>
      followupService.respond(token, answers),
  });
}

export function useFollowupTimeline(applicationId?: string, enabled = true) {
  return useQuery({
    queryKey: followupKeys.timeline(applicationId ?? ""),
    queryFn: () => followupService.getTimeline(applicationId as string),
    enabled: !!applicationId && enabled,
  });
}

export function useSupportRequest() {
  return useMutation({
    mutationFn: ({ applicationId, note }: { applicationId: string; note?: string }) =>
      followupService.requestSupport(applicationId, note),
  });
}

export function useReturnRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, reasonCode, note }: { applicationId: string; reasonCode: ReturnReasonCode; note?: string }) =>
      followupService.requestReturn(applicationId, reasonCode, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adoptionKeys.all }),
  });
}

export function useFollowupAlerts(status?: FollowupAlertStatus, enabled = true) {
  return useQuery({
    queryKey: followupKeys.alerts(status),
    queryFn: () => followupService.getOrganizationAlerts(status),
    enabled,
  });
}

export function useUpdateFollowupAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      ...body
    }: {
      alertId: string;
      status: FollowupAlertStatus;
      note?: string;
      resolution?: FollowupAlertResolution;
    }) => followupService.updateAlert(alertId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: followupKeys.all }),
  });
}

export function useRecordAdoptionOutcome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      ...body
    }: {
      applicationId: string;
      outcomeType: AdoptionOutcomeType;
      reasonCode?: ReturnReasonCode;
      note?: string;
    }) => followupService.recordOutcome(applicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followupKeys.all });
      queryClient.invalidateQueries({ queryKey: adoptionKeys.all });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}

export function useMyPets(enabled = true) {
  return useQuery({
    queryKey: followupKeys.myPets(),
    queryFn: () => followupService.getMyPets(),
    enabled,
  });
}
