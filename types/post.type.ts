import type { RescueCasePriority, RescueCaseStatus } from "./rescue-case.type";

export type PostMediaType = "IMAGE" | "VIDEO" | "UNKNOWN";

export type PostCategory = "RESCUE" | "ADOPTION" | "LOST" | "FOUND" | "GENERAL";

export interface PostMedia {
  mediaId: string;
  uploaderId?: string;
  url: string;
  type: PostMediaType;
  createdAt?: string;
}

/** The rescue case a post is about, with everything a feed card shows. */
export interface PostRescueCase {
  caseId: string;
  caseCode: string;
  status: RescueCaseStatus;
  /** True while the case still needs help (REPORTED or IN_PROGRESS). */
  open: boolean;
  priority?: RescueCasePriority;
  species?: string;
  locationText?: string;
  provinceName?: string;
  imageUrl?: string;
}

/** Labels the author confirmed. Null until confirmed. */
export interface PostFacets {
  category: PostCategory;
  species?: string;
  district?: string;
  province?: string;
  needsRescue: boolean;
}

export interface PostSummary {
  postId: string;
  authorId: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  content: string;
  tags: string[];
  facets?: PostFacets | null;
  rescueCase?: PostRescueCase | null;
  likeCount: number;
  commentCount: number;
  /** Absent for guests. */
  likedByMe?: boolean;
  createdAt: string;
  imageUrls?: string[];
}

export interface Post extends PostSummary {
  rescueCaseId?: string;
  media: PostMedia[];
  updatedAt: string;
}

export interface PostFeedFilters {
  category?: PostCategory;
  species?: string;
  province?: string;
  needsRescue?: boolean;
  tag?: string;
  /** Posts about one rescue case. */
  rescueCaseId?: string;
  /** True: only posts whose case still needs help. */
  hasOpenCase?: boolean;
}

export interface PostFeedParams extends PostFeedFilters {
  pageSize: number;
  /** `nextCursor` of the previous page. */
  cursor?: string;
  /** `nextCursorId` of the previous page; keeps posts with the same timestamp from being skipped. */
  cursorId?: string;
}

export interface PostCreatePayload {
  content: string;
  rescueCaseId?: string;
  mediaIds: string[];
  tagCodes: string[];
}

export interface PostUpdatePayload {
  content: string;
  mediaIds: string[];
  tagCodes: string[];
  /** Link the post to this rescue case, replacing any current link. */
  rescueCaseId?: string;
  /** True removes the link to a rescue case. */
  removeRescueCase?: boolean;
}

// PostAnalysisStatus enum in the backend.
export type PostAnalysisStatus =
  | "PENDING"
  | "ANALYZING"
  | "ANALYZED"
  | "CONFIRMED"
  | "REJECTED"
  | "FAILED";

// PostAnalysisSuggestion
export interface PostAnalysisSuggestion {
  category?: PostCategory | null;
  species?: string | null;
  locationText?: string | null;
  district?: string | null;
  province?: string | null;
  needsRescue: boolean;
  rescueSummary?: string | null;
  urgency?: RescueCasePriority | null;
  tags: string[];
  categoryConfidence?: number | null;
  speciesConfidence?: number | null;
  locationConfidence?: number | null;
}

// PostAnalysisResponseDto
export interface PostAnalysis {
  postId: string;
  status: PostAnalysisStatus;
  model?: string | null;
  analyzedAt?: string | null;
  suggestion?: PostAnalysisSuggestion | null;
  facets?: PostFacets | null;
  rescueCaseId?: string | null;
}

// PostAnalysisMetricsDto: one row per prompt version and model.
export interface PostAnalysisMetrics {
  promptVersion: number;
  model: string;
  runs: number;
  failed: number;
  withValidationErrors: number;
  labelled: number;
  categoryAccuracy?: number | null;
  speciesAccuracy?: number | null;
  districtAccuracy?: number | null;
  needsRescueAccuracy?: number | null;
}

// PostAnalysisModelDto
export interface PostAnalysisModel {
  activeModel: string;
  defaultModel: string;
  overridden: boolean;
  aiEnabled: boolean;
  allowedModels: string[];
}
