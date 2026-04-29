export interface OrganizationPageModel {
  content: OrganizationSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
export interface OrganizationSummary {
  organizationId: string;
  name: string;
  type: "SHELTER" | "VET_CENTER";
  status: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
}

export interface Organization {
  organizationId: string;
  name: string;
  description: string;
  type: "SHELTER" | "VET_CENTER";
  streetAddress: string;
  wardName: string;
  provinceName: string;
  phone: string;
  email: string;
  officialLink: string;
  latitude: number;
  longitude: number;
  status: string;
  createdBy: string;
}

export interface OrganizationMember {
  organization_id: string;
  user_id: string;
  role?: string;
  joined_at?: Date;
  status?: string;
}
