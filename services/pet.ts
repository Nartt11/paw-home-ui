import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import {
  Pet,
  PetMedia,
  PetMedicalRecord,
  PetOwnership,
} from "@/types/pet.type";

export interface PetListConfig {
  page?: number;
  size?: number;
  search?: string;
  species?: string;
  breed?: string;
}

export interface PetStatusUpdatePayload {
  status: string;
}

export type CreatePetPayload = Partial<Pet>;

export type UpdatePetPayload = Partial<Pet>;

export interface TransferOwnershipPayload {
  new_owner_id: string;
}

const petService = {
  // GET /api/v1/pets - List all pets (paginated, optional filters)
  getAllPets(params: PetListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Pet>>>("/pets", { params });
  },

  // GET /api/v1/pets/{id} - Get pet by ID (includes organization details)
  getPetById(petId: string) {
    return http.get<BaseResponse<Pet>>(`/pets/${petId}`);
  },

  // GET /api/v1/pets/available - List available pets (paginated, optional filters)
  getAvailablePets(params: PetListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Pet>>>("/pets/available", {
      params,
    });
  },

  // GET /api/v1/pets/by-organization/{organizationId} - List pets by organization (paginated)
  getPetsByOrganization(organizationId: string, params: PetListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Pet>>>(
      `/pets/by-organization/${organizationId}`,
      { params },
    );
  },

  // POST /api/v1/pets - Create a pet as a regular user (user-owned)
  createPet(payload: CreatePetPayload) {
    return http.post<BaseResponse<Pet>>("/pets", payload);
  },

  // POST /api/v1/pets/shelter - Create a pet as a shelter member (organization-owned)
  createShelterPet(payload: CreatePetPayload) {
    return http.post<BaseResponse<Pet>>("/pets/shelter", payload);
  },

  // PUT /api/v1/pets/{id} - Update an existing pet
  updatePet(petId: string, payload: UpdatePetPayload) {
    return http.put<BaseResponse<Pet>>(`/pets/${petId}`, payload);
  },

  // PATCH /api/v1/pets/{id}/status - Change pet status
  updatePetStatus(petId: string, payload: PetStatusUpdatePayload) {
    return http.patch<BaseResponse<Pet>>(`/pets/${petId}/status`, payload);
  },

  // POST /api/v1/pets/{id}/transfer-ownership - Transfer pet ownership
  transferOwnership(petId: string, payload: TransferOwnershipPayload) {
    return http.post<BaseResponse<Pet>>(
      `/pets/${petId}/transfer-ownership`,
      payload,
    );
  },

  // DELETE /api/v1/pets/{id} - Soft-delete a pet
  deletePet(petId: string) {
    return http.delete<BaseResponse<null>>(`/pets/${petId}`);
  },
};

type PetDetailConfig = {
  page?: number;
  size?: number;
};
type CreateMedicalRecordPayload = Pick<
  PetMedicalRecord,
  "description" | "vaccine" | "diagnosis" | "recordDate"
>;

// đã check
export const petDetailsService = {
  // GET /api/v1/pets/{petId}/medical-records - List medical records for a pet
  getMedicalRecords(petId: string, params: PetDetailConfig) {
    return http.get<BaseResponse<PetMedicalRecord[]>>(
      `/pets/${petId}/medical-records`,
      { params },
    );
  },

  // POST /api/v1/pets/{petId}/medical-records - Add a medical record for a pet
  createMedicalRecord(petId: string, payload: CreateMedicalRecordPayload) {
    return http.post<BaseResponse<PetMedicalRecord>>(
      `/pets/${petId}/medical-records`,
      payload,
    );
  },

  // GET /api/v1/pets/{petId}/ownerships - List ownership history for a pet
  getOwnerships(petId: string, params: PetDetailConfig) {
    return http.get<BaseResponse<PaginatedResponse<PetOwnership[]>>>(
      `/pets/${petId}/ownerships`,
      { params },
    );
  },

  // GET /api/v1/pets/{petId}/media - List media attachments for a pet (paginated)
  getMedia(petId: string, params?: PetDetailConfig) {
    return http.get<BaseResponse<PaginatedResponse<PetMedia[]>>>(
      `/pets/${petId}/media`,
      { params },
    );
  },
};

export default petService;
