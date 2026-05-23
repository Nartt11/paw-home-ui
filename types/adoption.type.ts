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
}

export type AdoptionStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export interface AdoptionRejectPayload {
  note: string;
  rejectReason: string;
  readyAt: string;
}

export interface AdoptionApprovePayload {
  note: string;
  rejectReason: string;
  readyAt: string;
}

export interface AdoptionCreatePayload {
  petId: string;
  organizationId: string;
  experience: string;
  liveCondition: string;
}

export interface AdoptionListParams {
  page?: number;
  size?: number;
  status?: AdoptionStatus[];
}