import { ListParams } from "./api.type";
import { Organization } from "./organization.type";

/** Mirrors the backend's `PetStatus` enum. */
export type PetStatus =
  | "AVAILABLE"
  | "FOSTERING"
  | "ADOPTED"
  | "LOST"
  | "DECEASED";
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
  speciesVi?: string;
  breed: string;
  breedVi?: string;
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
  /** SELF_REGISTERED, ADOPTED or ORG_INTAKE; only on my pets. */
  acquisitionType?: "SELF_REGISTERED" | "ADOPTED" | "ORG_INTAKE" | "TRANSFERRED";
  /** The adoption this pet came from, when acquisitionType is ADOPTED. */
  adoptionApplicationId?: string;
  /** The organization the pet was adopted from. */
  sourceOrganization?: { organizationId: string; name: string };
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
  /** Province code or name. */
  province?: string;
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
  /** Left out when a person keeps the animal they rescued. */
  shelterId?: string;
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

// PetTraitsDto (GET/PUT /pets/{petId}/traits). Scales are 1-5; absent = nobody recorded it.
export interface PetTraits {
  petId?: string;
  friendlyPeople?: number | null;
  friendlyChildren?: number | null;
  fearStrangers?: number | null;
  fearNoise?: number | null;
  energy?: number | null;
  goodWithDogs?: number | null;
  goodWithCats?: number | null;
  aloneMinutes?: number | null;
  houseTrained?: number | null;
  biteHistory?: "NONE" | "MINOR" | "INJURY" | null;
  biteVerified?: boolean;
  size?: "SMALL" | "MEDIUM" | "LARGE" | null;
  noiseLevel?: number | null;
  monthlyCost?: number | null;
  careLevel?: "LOW" | "MEDIUM" | "HIGH" | null;
  sourceRole?: "FOSTER" | "STAFF" | "PREVIOUS_OWNER" | "OWNER" | null;
  note?: string | null;
  updatedAt?: string | null;
}
