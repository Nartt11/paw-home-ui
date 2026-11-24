import { ListParams } from "./api.type";

export type OrganizationType = "SHELTER" | "VET_CENTER";
export type OrganizationStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "REJECTED";
export interface OrganizationSummary {
  organizationId: string;
  name: string;
  type: OrganizationType;
  status: OrganizationStatus;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
  organizationCode: string;
  imageUrl: string;
}

export interface OrganizationListParams {
  status?: string[];
  page?: number;
  pageSize?: number;
}
export interface Organization extends OrganizationSummary {
  description: string;
  streetAddress: string;
  wardCode: string;
  wardName: string;
  provinceCode: string;
  provinceName: string;
  phone: string;
  email: string;
  imageUrl: string;
  officialLink: string;
  latitude: number;
  longitude: number;
  requestedByUserId: string;
  requestedByUsername: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /organizations/{id}/overview. `operations` only for admins and the centre's members. */
export interface OrganizationOverview {
  organizationId: string;
  availablePets: number;
  petsInCare: number;
  adoptedPets: number;
  rescuedCases: number;
  operations?: {
    organizationCode?: string | null;
    /** Display name of whoever registered the centre; null when an admin created it. */
    requestedByName?: string | null;
    createdAt?: string | null;
    pendingAdoptions: number;
    awaitingPickup: number;
    activeRescueClaims: number;
    petsUnderTreatment: number;
    openFollowupAlerts: number;
    activeMembers: number;
  } | null;
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role?: string;
  joined_at?: Date;
  status?: string;
}

export interface OrganizationCreatePayload {
  name: string;
  description: string;
  type: OrganizationType;
  streetAddress: string;
  wardCode: string;
  wardName: string;
  provinceCode: string;
  provinceName: string;
  phone: string;
  email: string;
  imageUrl?: string;
  officialLink: string;
  latitude: number;
  longitude: number;
}
export interface OrganizationUpdatePayload {
  name: string;
  description: string;
  type: OrganizationType;
  streetAddress: string;
  wardCode: string;
  wardName: string;
  provinceCode: string;
  provinceName: string;
  phone: string;
  email: string;
  imageUrl?: string;
  officialLink: string;
  latitude: number;
  longitude: number;
}
export interface OrganizationMarkerParams { 
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  status?: OrganizationStatus[];
  type?: OrganizationType[];
}

export interface OrganizationBoundingBoxParams extends ListParams {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  status?: OrganizationStatus[];
}

export interface MyOrganizationResponse {
  organization: Organization;
  role: string;
}

