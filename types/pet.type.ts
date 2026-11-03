import { ListParams } from "./api.type";
import { Organization } from "./organization.type";

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
  ownerType: PetOwnershipType;
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
export type PetOwnershipType = "USER" | "ORGANIZATION";
export interface PetMedicalRecord {
  recordId: string;
  petId: string;
  description: string;
  vaccine: string;
  diagnosis: string;
  recordDate: string;
  createdBy: string;
}
export interface PetOwnership {
  petId: string;
  ownerType: PetOwnershipType;
  ownerId: string;
  ownerName: string;
  fromTime: string;
  toTime: string;
}
export interface PetMedia {
  mediaId: string;
  petId: string;
  mediaFileId: string;
  url: string;
  type: string;
  primaryMedia: boolean;
  createdAt: string;
}

export interface PetListParams extends ListParams {
  species?: string;
  breed?: string;
  gender?: PetGender;
  search?: string;
  status?: PetStatus[];
  userId?: string;
  organizationId?: string;
}

export interface PetBreed {
  breedId: string;
  speciesId: string;
  name: string;
  nameVi: string;
}

export interface PetTaxonomySpecies {
  speciesId: string;
  name: string;
  nameVi: string;
  breeds: PetBreed[];
}

export interface PetCreatePayload {
  name: string;
  speciesId: string;
  breedId?: string;
  age: number;
  gender: PetGender;
  color: string;
  weight: number;
  description: string;
  vaccinated: boolean;
  neutered: boolean;
  healthStatus: PetHealthStatus;
  mediaIds: string[];
  shelterId: string;
  rescueCaseId?: string;
}

export interface PetTransferOwnershipPayload {
  newOwnerType: PetOwnershipType;
  newOwnerId: string;
}
export interface PetUpdatePayload {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: PetGender;
  color: string;
  weight: number;
  description: string;
  status: PetStatus;
  healthStatus: PetHealthStatus;
  vaccinated: boolean;
  neutered: boolean;
  imageUrls: string[];
  mediaIds: string[];
}
export interface PetMediaPatchParams {
  petId: string;
  mediaId: string;
}
export interface PetMedicalRecordCreatePayload {
  description: string;
  vaccine: string;
  diagnosis: string;
  recordDate: string;
}

export interface PetMediaCreateParams {
  petId: string;
  primary?: boolean;
}
export interface PetMediaCreatePayload {
  file: File;
}

export interface PetDetailParams extends ListParams {
  petId?: string;
}
