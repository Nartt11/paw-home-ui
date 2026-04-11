import { baseEntity } from "./core.type";

export interface Pet extends baseEntity {
  petId: string;
  name: string;

  species: string;
  breed?: string;
  age?: number;
  gender?: string;

  color?: string;
  weight?: number;

  description?: string;

  status: "AVAILABLE" | "ADOPTED" | "RESCUED" | string;
  health_status?: string;

  is_vaccinated: boolean;
  is_neutered: boolean;

  rescue_date?: string;
  rescue_location?: string;

  shelter_id?: string;
  rescue_case_id?: string;
  image: string;
}

export interface PetMedia {
  mediaId: string;
  uploaderId: string;
  url: string;
  type: string;
  created_at: Date;
}
export interface PetMedicalRecord extends baseEntity {
  recordId: string;
  petId: string;
  description: string;
  vaccine: string;
  diagnosis: string;
  recordDate: string;
}

export interface PetOwnership {
  petId: string;
  ownerType?: "USER" | "ORG";
  ownerId?: string;

  fromTime: Date;
  toTime?: Date;
}

export interface PetCurrentOwner {
  petId: string;
  owner_type?: string;
  owner_id?: string;
}

export interface PetListConfig {
  page?: number;
  size?: number;
  search?: string;
  species?: string;
  breed?: string;
}
