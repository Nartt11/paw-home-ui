import { RescueCasePriority, RescueCaseStatus } from "@/types/rescue-case.type";

export interface RescueCaseSummaryDto {
  caseId: string;
  species: string;
  priority: RescueCasePriority;
  status: RescueCaseStatus;
  reporterUsername: string;
  locationText: string;
  reportedAt: string;
}

export interface RescueCaseDto extends RescueCaseSummaryDto {
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

export interface RescueCaseListConfigDto {
  page?: number;
  size?: number;
}

export interface CreateRescueCasePayloadDto {
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
  // image
}

export interface UpdateRescueCasePayloadDto {
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
  // image
}
