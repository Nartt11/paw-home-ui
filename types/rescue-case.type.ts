import { ListParams } from "./api.type";

export type RescueCaseStatus =
  | "REPORTED"
  | "IN_PROGRESS"
  | "RESCUED"
  | "CLOSED";
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
  petId: string;
  organizationId: string;
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
}