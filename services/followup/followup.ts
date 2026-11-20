import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { PaginatedResponse } from "@/types/api.type";
import type {
  AdoptionOutcomeType,
  Followup,
  FollowupAlert,
  FollowupAlertResolution,
  FollowupAlertStatus,
  FollowupAnswers,
  FollowupForm,
  ReturnReasonCode,
} from "@/types/followup.type";
import type { PetSummary } from "@/types/pet.type";

/** Life after an adoption: check-ins, support and return requests, and the organization's follow-up work. */
const followupService = {
  // Public: the check-in behind an emailed link. No sign-in.
  getForm(token: string) {
    return http.get<FollowupForm>(apiEndpoints.followups.respond, { params: { token } });
  },

  respond(token: string, answers: FollowupAnswers) {
    return http.post<void, { token: string; answers: FollowupAnswers }>(apiEndpoints.followups.respond, {
      token,
      answers,
    });
  },

  getTimeline(applicationId: string) {
    return http.get<Followup[]>(apiEndpoints.adoptions.followups(applicationId));
  },

  requestSupport(applicationId: string, note?: string) {
    return http.post<void, { note?: string }>(apiEndpoints.adoptions.supportRequest(applicationId), { note });
  },

  // The adopter can no longer keep the pet. This never costs reputation.
  requestReturn(applicationId: string, reasonCode: ReturnReasonCode, note?: string) {
    return http.post<void, { reasonCode: ReturnReasonCode; note?: string }>(
      apiEndpoints.adoptions.returnRequest(applicationId),
      { reasonCode, note },
    );
  },

  getOrganizationAlerts(status?: FollowupAlertStatus) {
    return http.get<FollowupAlert[]>(apiEndpoints.organizations.myFollowupAlerts, {
      params: status ? { status } : undefined,
    });
  },

  updateAlert(alertId: string, body: { status: FollowupAlertStatus; note?: string; resolution?: FollowupAlertResolution }) {
    return http.patch<FollowupAlert, typeof body>(apiEndpoints.followups.alertById(alertId), body);
  },

  // The organization records what finally happened, e.g. the pet came back.
  recordOutcome(applicationId: string, body: { outcomeType: AdoptionOutcomeType; reasonCode?: ReturnReasonCode; note?: string }) {
    return http.post<unknown, typeof body>(apiEndpoints.adoptions.outcome(applicationId), body);
  },

  getMyPets(page = 0, pageSize = 50) {
    return http.get<PaginatedResponse<PetSummary>>(apiEndpoints.users.myPets, { params: { page, pageSize } });
  },
};

export default followupService;
