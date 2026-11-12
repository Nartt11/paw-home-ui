export interface AdoptionSummary {
  applicationId: string;
  adoptionCode: string;
  petName: string;
  petPrimaryImageUrl: string;
  applicantUsername: string;
  status: AdoptionStatus;
  experience: string;
  liveCondition: string;
  createdAt: string;
}

export interface Adoption extends AdoptionSummary {
  petId: string;
  applicantId: string;
  organizationId: string;
  organizationName: string;
  decidedAt: string;
  decidedBy: string;
  decidedByUsername: string;
  rejectReason: string;
  readyAt: string;
  decisionReasonCode?: string | null;
  match?: MatchResult | null;
}

export type AdoptionStatus = "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED" | "CANCELED";
export interface AdoptionRejectPayload {
  note: string;
  rejectReason: string;
  readyAt: string;
  decisionReasonCode?: string | null;
  match?: MatchResult | null;
}

export interface AdoptionApprovePayload {
  note: string;
  rejectReason: string;
  readyAt: string;
  decisionReasonCode?: string | null;
  match?: MatchResult | null;
}

export interface AdoptionCreatePayload {
  petId: string;
  organizationId: string;
  experience: string;
  liveCondition: string;
}

export interface AdoptionListParams {
  page?: number;
  pageSize?: number;
  status?: AdoptionStatus[];
  organizationId?: string;
}
// MatchResultDto (MatchResult.Reason / Warning) on an application, staff view.
export type MatchLevel = "HIGH" | "MEDIUM" | "LOW" | "NOT_SUITABLE";
export type MatchCertainty = "HIGH" | "MEDIUM" | "LOW" | "NONE";

export interface MatchReason {
  code: "LIFESTYLE" | "HOUSING" | "FAMILY" | "EXISTING_PETS" | "READINESS";
  weight: number;
  status: "OK" | "WARN" | "UNKNOWN";
  certainty: MatchCertainty;
  text: string;
}

export interface MatchWarning {
  code: string;
  text: string;
}

export interface MatchResult {
  level: MatchLevel;
  /** 0-100, staff only; null when a warning fired. */
  score?: number | null;
  certainty: MatchCertainty;
  weightsVersion?: number;
  reasons?: MatchReason[];
  warnings?: MatchWarning[];
  preparation?: string[];
  /** The applicant confirmed they read the warnings. */
  warningsAcknowledged?: boolean | null;
}
