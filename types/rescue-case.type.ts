export type RescueCaseStatus =
  | "REPORTED"
  | "IN_PROGRESS"
  | "RESCUED"
  | "CLOSED";
export type RescueCasePriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
export interface RescueCaseSummary {
  caseId: string;
  species: string;
  priority: RescueCasePriority;
  status: RescueCaseStatus;
  reporterUsername: string;
  locationText: string;
  reportedAt: string;
}

export interface RescueCase extends RescueCaseSummary {
  petId: string;
  petName: string;
  reportedBy: string;
  organizationId: string;
  organizationName: string;
  color: string;
  size: string;
  description: string;
  latitude: number;
  longitude: number;
  wardName: string;
  provinceName: string;
  resolvedAt: string;
  createdAt: string;
}
export interface RescueMedia {
  case_id: string;
  media_id: string;
}
