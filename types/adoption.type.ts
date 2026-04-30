export interface AdoptionSummary {
  applicationId: string;
  petName: string;
  applicantUsername: string;
  status: string;
  experience: string;
  liveCondition: string;
  createdAt: string;
}

export interface Adoption extends AdoptionSummary {
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
