import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse } from "@/types/api.type";
import type { Pet, PetCreatePayload } from "@/types/pet.type";
import type {
  FirstAidGuides,
  RescueCaseSummary,
  RescueCaseUpdate,
  RescueClaim,
  RescueClaimReleaseReason,
  RescueCompletion,
  RescueQueueItem,
} from "@/types/rescue-case.type";

/**
 * The steps of a rescue after it is reported: claiming, progress notes, the completion report and
 * its review, and turning the rescued animal into a pet record.
 */
const rescueFlowService = {
  // POST /rescue-cases/{id}/claim — staff claim for their organization; anyone else must acknowledge the safety notes.
  claim(caseId: string, safetyAcknowledged = false) {
    return http.post<RescueClaim, { safetyAcknowledged: boolean }>(apiEndpoints.rescueCases.claim(caseId), {
      safetyAcknowledged,
    });
  },

  extendClaim(caseId: string) {
    return http.post<RescueClaim>(apiEndpoints.rescueCases.extendClaim(caseId));
  },

  releaseClaim(caseId: string, reason: RescueClaimReleaseReason) {
    return http.post<RescueClaim, { reason: RescueClaimReleaseReason }>(
      apiEndpoints.rescueCases.releaseClaim(caseId),
      { reason },
    );
  },

  // Who is working on the case; for the reporter, the handling organization and admins.
  getClaims(caseId: string) {
    return http.get<RescueClaim[]>(apiEndpoints.rescueCases.claims(caseId));
  },

  getUpdates(caseId: string, page = 0, pageSize = 20) {
    return http.get<PaginatedResponse<RescueCaseUpdate>>(apiEndpoints.rescueCases.updates(caseId), {
      params: { page, pageSize },
    });
  },

  postUpdate(caseId: string, note: string, mediaIds: string[] = []) {
    return http.post<RescueCaseUpdate, { note: string; mediaIds: string[] }>(
      apiEndpoints.rescueCases.updates(caseId),
      { note, mediaIds },
    );
  },

  confirmCompletion(completionId: string) {
    return http.post<RescueCompletion>(apiEndpoints.rescueCases.confirmCompletion(completionId));
  },

  disputeCompletion(completionId: string, reason: string) {
    return http.post<RescueCompletion, { reason: string }>(
      apiEndpoints.rescueCases.disputeCompletion(completionId),
      { reason },
    );
  },

  rejectCompletion(completionId: string, reason: string) {
    return http.post<RescueCompletion, { reason: string }>(
      apiEndpoints.rescueCases.rejectCompletion(completionId),
      { reason },
    );
  },

  // The organization creates the pet record for a rescued animal it holds; the pet starts in FOSTERING.
  intake(caseId: string, payload: Partial<PetCreatePayload>) {
    return http.post<Pet, Partial<PetCreatePayload>>(apiEndpoints.rescueCases.intake(caseId), payload);
  },

  // The rescuer adds the animal to their own pets, after a confirmed KEPT_BY_RESCUER report.
  keepPet(caseId: string, payload: Partial<PetCreatePayload>) {
    return http.post<Pet, Partial<PetCreatePayload>>(apiEndpoints.rescueCases.keepPet(caseId), payload);
  },

  // Open cases near a point that may be the same animal; advisory only.
  getPossibleDuplicates(params: { lat: number; lng: number; species?: string }) {
    return http.get<RescueCaseSummary[]>(apiEndpoints.rescueCases.possibleDuplicates, { params });
  },

  getFirstAid() {
    return http.get<FirstAidGuides>(apiEndpoints.rescueCases.firstAid);
  },

  // Cases in my organization's province nobody has taken yet, most urgent first.
  getOrganizationQueue(page = 0, pageSize = 20) {
    return http.get<PaginatedResponse<RescueQueueItem>>(apiEndpoints.organizations.myRescueQueue, {
      params: { page, pageSize },
    });
  },
};

export default rescueFlowService;
