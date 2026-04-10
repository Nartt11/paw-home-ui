import { baseEntity } from "./core.type";

export interface Pet extends baseEntity {
  pet_id: string;
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
  media_id: string;
  pet_id: string;
  type?: string;
  media_file_id?: string;
  created_at: Date;
}
export interface PetMedicalRecord extends baseEntity {
  record_id: string;
  pet_id: string;

  description?: string;
  vaccine?: string;
  diagnosis?: string;

  record_date?: Date;
}

export interface PetOwnership {
  pet_id: string;
  owner_type?: "USER" | "ORG";
  owner_id?: string;

  from_time: Date;
  to_time?: Date;
}

export interface PetCurrentOwner {
  pet_id: string;
  owner_type?: string;
  owner_id?: string;
}
