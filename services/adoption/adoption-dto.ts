export interface AdoptionSummaryDto {
  applicationId: string;
  petName: string;
  applicantUsername: string;
  status: string;
  experience: string;
  liveCondition: string;
  createdAt: string;
}

export interface AdoptionDto extends AdoptionSummaryDto {
  petId: string;
  petName: string;
  applicantId: string;
  organizationId: string;
  status: string;
  experience: string;
  liveCondition: string;
  createdAt: string;
  decidedAt: string;
  decidedBy: string;
}
export interface AdoptionListConfig {
    status?: string;
    page?: number;
    size?: number;
 }

export interface CreateAdoptionPayload {
  petId: string;
  organizationId: string;
  experience: string;
  liveCondition: string;
}