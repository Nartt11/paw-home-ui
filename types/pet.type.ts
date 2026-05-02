import { Organization } from "./organization.type,";

export type PetStatus =
  | "UNOWNED"
  | "ADOPTED"
  | "PENDING"
  | "FOSTERED"
  | "UNAVAILABLE";
export type PetGender = "MALE" | "FEMALE" | "UNKNOWN";
export type PetHealthStatus =
  | "HEALTHY"
  | "UNDER_TREATMENT"
  | "RECOVERING"
  | "SPECIAL_NEEDS";
export interface PetSummary {
  petId: string;
  petCode: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  ageDisplay: string;
  vaccinated: boolean;
  gender: PetGender;
  status: PetStatus;
  healthStatus: PetHealthStatus;
  owner: Owner;
  organization: Organization;
  province: string;
  provinceCode: number;
  ward: string;
  wardCode: string;
  imageUrl: string;
}

export interface Pet extends Omit<PetSummary, "imageUrl"> {
  color: string;
  weight: number;
  description: string;
  neutered: boolean;
  rescueDate: string;
  rescueLocation: string;
  imageUrls: string[];
  shelterId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Owner {
  ownerType: string;
  ownerId: string;
  name: string;
  avatarUrl: string;
  phone: string;
  caretakerUserId: string;
  caretakerName: string;
  caretakerAvatarUrl: string;
  caretakerPhone: string;
}

export type PetOrganization = Pick<Organization, "organizationId" | "name">;
export interface PetMedicalRecord {
  recordId: string;
  petId: string;
  description: string;
  vaccine: string;
  diagnosis: string;
  recordDate: string;
  createdBy: string;
}

export type PetOwnershipType = "USER" | "ORGANIZATION";
export interface PetOwnership {
  petId: string;
  ownerType: PetOwnershipType;
  ownerId: string;
  ownerName: string;
  fromTime: string;
  toTime: string;
}
export type PetMediaType = "IMAGE" | "VIDEO";
export interface PetMedia {
  mediaId: string;
  uploaderId: string;
  url: string;
  type: PetMediaType;
  createdAt: string;
}