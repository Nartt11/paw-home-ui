import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { rescueCaseKeys } from "@/hooks/use-rescue-case";
import { petKeys } from "@/hooks/use-pet";
import rescueFlowService from "@/services/rescue-case/rescue-flow";
import type { PetCreatePayload } from "@/types/pet.type";
import type { RescueClaimReleaseReason } from "@/types/rescue-case.type";

export const rescueFlowKeys = {
  claims: (caseId: string) => [...rescueCaseKeys.all, "claims", caseId] as const,
  updates: (caseId: string) => [...rescueCaseKeys.all, "updates", caseId] as const,
  orgQueue: (page: number) => [...rescueCaseKeys.all, "org-queue", page] as const,
  duplicates: (lat?: number, lng?: number, species?: string) =>
    [...rescueCaseKeys.all, "duplicates", lat, lng, species] as const,
  firstAid: ["rescue-first-aid"] as const,
};

/** Every step changes the case, the lists and the map, so refresh everything about rescue cases. */
function useRefreshRescue() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: rescueCaseKeys.all });
}

export function useCaseClaims(caseId?: string, enabled = true) {
  return useQuery({
    queryKey: rescueFlowKeys.claims(caseId ?? ""),
    queryFn: () => rescueFlowService.getClaims(caseId as string),
    enabled: !!caseId && enabled,
  });
}

export function useCaseUpdates(caseId?: string) {
  return useQuery({
    queryKey: rescueFlowKeys.updates(caseId ?? ""),
    queryFn: () => rescueFlowService.getUpdates(caseId as string),
    enabled: !!caseId,
  });
}

export function useClaimCase() {
  const refresh = useRefreshRescue();
  return useMutation({
    mutationFn: ({ caseId, safetyAcknowledged }: { caseId: string; safetyAcknowledged?: boolean }) =>
      rescueFlowService.claim(caseId, safetyAcknowledged),
    onSuccess: refresh,
  });
}

export function useExtendClaim() {
  const refresh = useRefreshRescue();
  return useMutation({ mutationFn: (caseId: string) => rescueFlowService.extendClaim(caseId), onSuccess: refresh });
}

export function useReleaseClaim() {
  const refresh = useRefreshRescue();
  return useMutation({
    mutationFn: ({ caseId, reason }: { caseId: string; reason: RescueClaimReleaseReason }) =>
      rescueFlowService.releaseClaim(caseId, reason),
    onSuccess: refresh,
  });
}

export function usePostCaseUpdate() {
  const refresh = useRefreshRescue();
  return useMutation({
    mutationFn: ({ caseId, note, mediaIds }: { caseId: string; note: string; mediaIds?: string[] }) =>
      rescueFlowService.postUpdate(caseId, note, mediaIds),
    onSuccess: refresh,
  });
}

/** Confirm, dispute (reporter) or reject (handler, admin) a completion report. */
export function useDecideCompletion() {
  const refresh = useRefreshRescue();
  return useMutation({
    mutationFn: ({
      completionId,
      decision,
      reason = "",
    }: {
      completionId: string;
      decision: "confirm" | "dispute" | "reject";
      reason?: string;
    }) => {
      if (decision === "confirm") return rescueFlowService.confirmCompletion(completionId);
      if (decision === "dispute") return rescueFlowService.disputeCompletion(completionId, reason);
      return rescueFlowService.rejectCompletion(completionId, reason);
    },
    onSuccess: refresh,
  });
}

export function useOrganizationRescueQueue(page = 0, enabled = true) {
  return useQuery({
    queryKey: rescueFlowKeys.orgQueue(page),
    queryFn: () => rescueFlowService.getOrganizationQueue(page),
    enabled,
  });
}

/** Turn a rescued animal into a pet record: intake by an organization, or keep-pet by the rescuer. */
export function useCreatePetFromCase() {
  const queryClient = useQueryClient();
  const refresh = useRefreshRescue();
  return useMutation({
    mutationFn: ({
      caseId,
      mode,
      payload,
    }: {
      caseId: string;
      mode: "intake" | "keep";
      payload: Partial<PetCreatePayload>;
    }) => (mode === "intake" ? rescueFlowService.intake(caseId, payload) : rescueFlowService.keepPet(caseId, payload)),
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({ queryKey: petKeys.all });
    },
  });
}

export function usePossibleDuplicates(lat?: number, lng?: number, species?: string) {
  return useQuery({
    queryKey: rescueFlowKeys.duplicates(lat, lng, species),
    queryFn: () => rescueFlowService.getPossibleDuplicates({ lat: lat as number, lng: lng as number, species }),
    enabled: typeof lat === "number" && typeof lng === "number",
    staleTime: 60_000,
  });
}

export function useFirstAidGuides(enabled = true) {
  return useQuery({
    queryKey: rescueFlowKeys.firstAid,
    queryFn: () => rescueFlowService.getFirstAid(),
    enabled,
    staleTime: Infinity,
  });
}
