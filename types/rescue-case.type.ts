import { ListParams } from "./api.type";

export type RescueCaseStatus =
  | "REPORTED"
  | "IN_PROGRESS"
  | "RESCUED"
  | "CLOSED";

export type RescueStatus = RescueCaseStatus;
export type RescueCasePriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
export interface RescueCaseSummary {
  caseId: string;
  caseCode: string;
  species: string;
  priority: RescueCasePriority;
  status: RescueCaseStatus;
  reporterUsername: string;
  locationText: string;
  reportedAt: string;
  firstImageUrl: string;
  /** Only in nearby results. */
  distanceMeters?: number;
}

export interface RescueCase extends RescueCaseSummary {
  petId: string;
  petName: string;
  reportedBy: string;
  reporterUsername: string;
  organizationId: string;
  organizationName: string;
  color: string;
  size: string;
  description: string;
  latitude: number;
  longitude: number;
  locationText: string;
  wardName: string;
  provinceName: string;
  reportedAt: string;
  resolvedAt: string;
  createdAt: string;
  imageUrls: string[];
  contactPhone: string;
  /** Only in the response to a report sent with shareAsPost: the post that was published. */
  sharedPostId?: string;
  /** Only in that response: true when the case was saved but the post could not be published. */
  postShareFailed?: boolean;
}

/** One of my active claims on a rescue case. */
// RescueClaimResponseDto
export interface RescueClaim {
  claimId: string;
  caseId: string;
  caseCode?: string;
  userId?: string;
  username?: string;
  /** Set when the claim was made for an organization (locks the case). */
  organizationId?: string | null;
  status: "ACTIVE" | "RELEASED" | "EXPIRED" | "COMPLETED" | string;
  releaseReason?: "GAVE_UP" | "NEED_HELP" | "NOT_FOUND" | "CASE_ENDED" | null;
  claimedAt?: string;
  expiresAt?: string;
}

/** Filters of GET /rescue-cases. lat and lng together switch it to "nearest first". */
export interface RescueCaseSearchParams extends ListParams {
  search?: string;
  status?: RescueCaseStatus[];
  priority?: RescueCasePriority[];
  species?: string;
  province?: string;
  lat?: number;
  lng?: number;
  distance?: number;
}

export interface MyRescueCasesParams extends ListParams {
  status?: RescueCaseStatus[];
}

export interface RescueMedia {
  case_id: string;
  media_id: string;
}

export interface RescueCaseNearByParams extends ListParams {
  distance?: number;
  lat: number;
  lng: number;
}

export interface RescueCaseMarkers {
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  status?: RescueCaseStatus[];
  priority?: RescueCasePriority[];
  species?: string;
  organizationId?: string;
}
export interface RescueCaseBoundingBoxParams extends ListParams {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  organizationId?: string;
}

export interface RescueCasePayload {
  petId?: string;
  organizationId?: string;
  species: string;
  color: string;
  size: string;
  priority: RescueCasePriority;
  description: string;
  latitude: number;
  longitude: number;
  locationText: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  imageUrls: string[];
  mediaIds: string[];
  contactPhone: string;
  /** True also publishes a community post about the case. */
  shareAsPost?: boolean;
  /** Text of that post. Empty lets the backend write one from the report. */
  postContent?: string;
}

export interface CompleteRescuePayload {
  caseId: string;
  verificationImageIds: string[];
  rescueNote?: string;
  rescuedAt: string;
  locationNote?: string;
  confirmRescued: boolean;
}

export interface RescueCompletion {
  completionId: string;
  caseId: string;
  rescuedAt: string;
  rescueNote: string;
  locationNote: string;
  verifiedBy: string;
  verifiedByName: string;
  verifiedAt: string;
  verificationImagesUrl: string[];
  caseCode?: string;
  submittedBy?: string;
  submittedByName?: string;
  outcome?: RescueOutcome;
  status?: RescueCompletionStatus;
  rejectReason?: string | null;
}

// RescueOutcome / RescueCompletionStatus enums in the backend.
export type RescueOutcome =
  | "HANDED_TO_ORG"
  | "TEMP_HOLDING"
  | "KEPT_BY_RESCUER"
  | "RELEASED"
  | "DECEASED";
export type RescueCompletionStatus = "PENDING" | "APPROVED" | "REJECTED" | "DISPUTED";

export interface RescueCompletionQueryParams extends ListParams {
  isResolved?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}