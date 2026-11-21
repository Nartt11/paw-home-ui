import { ListParams } from "./api.type";

export type RescueCaseStatus =
  | "REPORTED"
  | "IN_PROGRESS"
  | "RESCUED"
  | "CLOSED";

export type RescueStatus = RescueCaseStatus;
export type RescueCasePriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
/** RESCUE: an animal needs help. LOST: an owner looks for a pet. FOUND: someone found one. */
export type RescueCaseType = "RESCUE" | "LOST" | "FOUND";
export interface RescueCaseSummary {
  caseId: string;
  caseCode: string;
  caseType?: RescueCaseType;
  species: string;
  priority: RescueCasePriority;
  status: RescueCaseStatus;
  /** The reporter's display name. */
  reporterName: string;
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
  /** The reporter's display name. */
  reporterName: string;
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
  /** How many people or organizations are working on the case right now. */
  activeClaimCount?: number;
  /** True when the viewer reported this case. */
  viewerIsReporter?: boolean;
  /** True when the viewer holds an active claim on this case. */
  viewerHasActiveClaim?: boolean;
  /** The latest completion report, if any. */
  completionId?: string;
  /** PENDING, APPROVED, REJECTED or DISPUTED. */
  completionStatus?: RescueCompletionStatus;
  /** Only in the response to a report sent with shareAsPost: the post that was published. */
  sharedPostId?: string;
  /** Only in that response: true when the case was saved but the post could not be published. */
  postShareFailed?: boolean;
}

export type RescueCompletionStatus = "PENDING" | "APPROVED" | "REJECTED" | "DISPUTED";
export type RescueClaimStatus = "ACTIVE" | "RELEASED" | "EXPIRED" | "COMPLETED";
export type RescueClaimReleaseReason = "GAVE_UP" | "NEED_HELP" | "NOT_FOUND" | "CASE_ENDED";
/** What happened to the animal, chosen when reporting a rescue as done. */
export type RescueOutcome = "HANDED_TO_ORG" | "TEMP_HOLDING" | "KEPT_BY_RESCUER" | "RELEASED" | "DECEASED";

/** A claim on a rescue case: a person on the way, or an organization that took the case. */
export interface RescueClaim {
  claimId: string;
  caseId: string;
  caseCode?: string;
  userId?: string;
  /** The helper's display name. */
  name?: string;
  /** Set when an organization holds the claim. */
  organizationId?: string;
  status: RescueClaimStatus;
  releaseReason?: RescueClaimReleaseReason;
  claimedAt?: string;
  /** Personal claims expire; organization claims do not. */
  expiresAt?: string;
}

/** A progress note on a case, newest first. */
export interface RescueCaseUpdate {
  updateId: string;
  caseId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  note: string;
  imageUrls: string[];
  createdAt: string;
}

/** One row of an organization's rescue queue. */
export interface RescueQueueItem {
  caseId: string;
  caseCode: string;
  species?: string;
  priority: RescueCasePriority;
  status: RescueCaseStatus;
  description?: string;
  locationText?: string;
  firstImageUrl?: string;
  provinceName?: string;
  wardName?: string;
  latitude?: number;
  longitude?: number;
  reportedAt: string;
  needsHelp: boolean;
  /** A person rescued the animal and is waiting to hand it to an organization. */
  awaitingHandover: boolean;
  activeClaimCount: number;
  /** The higher of the reporter's priority and the AI's. */
  effectivePriority?: RescueCasePriority;
  aiUrgency?: RescueCasePriority;
  aiSummary?: string;
  triageStatus?: string;
  missingFields?: string[];
}

export interface FirstAidGuide {
  code: string;
  title: string;
  urgentSigns?: string[];
  steps?: string[];
  doNot?: string[];
}

export interface FirstAidGuides {
  disclaimer: string;
  guides: FirstAidGuide[];
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
  outcome?: RescueOutcome;
}

export interface RescueCompletion {
  completionId: string;
  caseId: string;
  caseCode?: string;
  submittedBy?: string;
  submittedByName?: string;
  outcome?: RescueOutcome;
  status?: RescueCompletionStatus;
  rejectReason?: string | null;
  rescuedAt: string;
  rescueNote: string;
  locationNote: string;
  verifiedBy: string;
  verifiedByName: string;
  verifiedAt: string;
  verificationImagesUrl: string[];
}

export interface RescueCompletionQueryParams extends ListParams {
  isResolved?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}