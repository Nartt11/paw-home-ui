import { Organization } from "@/types/organization.type,";
import {
  Pet,
  PetGender,
  PetHealthStatus,
  PetMediaType,
  PetOwnershipType,
  PetStatus,
} from "@/types/pet.type";

export interface PetSummaryDto {
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
  owner: OwnerDto;
  organization: Organization;
  province: string;
  provinceCode: number;
  ward: string;
  wardCode: string;
  imageUrl: string;
}

export interface PetDto extends Omit<PetSummaryDto, "imageUrl"> {
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
export interface OwnerDto {
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

export interface PetMedicalRecordDto {
  recordId: string;
  petId: string;
  description: string;
  vaccine: string;
  diagnosis: string;
  recordDate: string;
  createdBy: string;
}

export interface PetOwnershipDto {
  petId: string;
  ownerType: PetOwnershipType;
  ownerId: string;
  ownerName: string;
  fromTime: string;
  toTime: string;
}

export interface PetMediaDto {
  mediaId: string;
  uploaderId: string;
  url: string;
  type: PetMediaType;
  createdAt: string;
}

export type PetOrganizationDto = Pick<Organization, "organizationId" | "name">;

export interface PetListConfig {
  page?: number;
  size?: number;
  species?: string;
  breed?: string;
  gender?: PetGender;
  status?: PetStatus[];
  healthStatus?: PetHealthStatus;
  userId?: string;
  organizationId?: string;
}

export interface UpdatePetPayload {
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
}

export interface CreatePetPayload {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: PetGender;
  color: string;
  weight: number;
  description: string;
  vaccinated: boolean;
  neutered: boolean;
  rescueDate: string;
  rescueLocation: string;
  imageUrls: string[];
  shelterId: string;
  rescueCaseId: string;
}

export interface TransferOwnershipPayload {
  newOwnerType: string;
  newOwnerId: string;
}

export interface PetDetailConfig {
  page?: number;
  size?: number;
  petId: string;
}

export interface CreatePetMedicalRecordPayload {
  description: string;
  vaccine: string;
  diagnosis: string;
  recordDate: string;
}
