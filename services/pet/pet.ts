import http from "@/lib/http";
import { CreatePetMedicalRecordPayload, CreatePetPayload, PetDetailConfig, PetDto, PetListConfig, PetMediaDto, PetMedicalRecordDto, PetOwnershipDto, PetSummaryDto, TransferOwnershipPayload, UpdatePetPayload } from "./pet-dto";
import { PaginatedResponse } from "@/types/api.type";
import { Pet, PetMedia, PetMedicalRecord, PetOwnership, PetStatus, PetSummary } from "@/types/pet.type";
import { mapPage } from "@/mappers/common";
import { PageDto } from "../api-dto";
import { mapPet, mapPetMedia, mapPetMedicalRecord, mapPetOwnership, mapPetSummary } from "@/mappers/pet";

const petService = {
  // GET /api/v1/pets - List all pets (paginated, optional filters)
  async getAllPets(params: PetListConfig) : Promise<PaginatedResponse<PetSummary>> {
    const dto = await http.get<PageDto<PetSummaryDto>>("/pets", { params });
    return mapPage(dto, mapPetSummary);
  },

  // GET /api/v1/pets/{id} - Get pet by ID (includes organization details)
  async getPetById(petId: string) : Promise<Pet>{
    const dto = await http.get<PetDto>(`/pets/${petId}`);
    return mapPet(dto)
  },

  // GET /api/v1/pets/available - List available pets (paginated, optional filters)
  async getAvailablePets(params: PetListConfig) : Promise<PaginatedResponse<PetSummary>> {
    const dto = await http.get<PageDto<PetSummaryDto>>("/pets/available", { params });
    return mapPage(dto, mapPetSummary);
  },

  // sai config
  // GET /api/v1/pets/by-organization/{organizationId} - List pets by organization (paginated)
  async getPetsByOrganization(organizationId: string, params: PetListConfig) : Promise<PaginatedResponse<PetSummary>> {
    const dto = await http.get<PageDto<PetSummaryDto>>(
      `/pets/by-organization/${organizationId}`,
      { params },
    );
    return mapPage(dto, mapPetSummary);
  },

  // POST /api/v1/pets - Create a pet as a regular user (user-owned)
  async createPet(payload: CreatePetPayload) : Promise<Pet> {
    const dto = await http.post<Pet>("/pets", payload);
    return mapPet(dto);
  },

  // sai payload
  // POST /api/v1/pets/shelter - Create a pet as a shelter member (organization-owned)
  async createShelterPet(payload: CreatePetPayload) : Promise<Pet> {
    const dto = await http.post<Pet>("/pets/shelter", payload);
    return mapPet(dto);
  },

  // PUT /api/v1/pets/{id} - Update an existing pet
  async updatePet(petId: string, payload: UpdatePetPayload) : Promise<Pet> {
    const dto = await http.put<Pet>(`/pets/${petId}`, payload);
    return mapPet(dto);
  },

  // PATCH /api/v1/pets/{id}/status - Change pet status
  async updatePetStatus(petId: string, status: PetStatus) : Promise<Pet> {
    const dto = await http.patch<Pet>(`/pets/${petId}/status`, status);
    return mapPet(dto);
  },

  // POST /api/v1/pets/{id}/transfer-ownership - Transfer pet ownership
  async transferOwnership(petId: string, payload: TransferOwnershipPayload) : Promise<""> {
    const dto = await http.post<"">(
      `/pets/${petId}/transfer-ownership`,
      payload,
    );
    return ""
  },

  // DELETE /api/v1/pets/{id} - Soft-delete a pet
  async deletePet(petId: string) {
    const dto = await http.delete<null>(`/pets/${petId}`);
  },
};


// đã check
export const petDetailsService = {
  // GET /api/v1/pets/{petId}/medical-records - List medical records for a pet
  async getMedicalRecords(
    petId: string,
    params: PetDetailConfig,
  ): Promise<PaginatedResponse<PetMedicalRecord>> {
    const dto = await http.get<PageDto<PetMedicalRecordDto>>(
      `/pets/${petId}/medical-records`,
      { params },
    );
    return mapPage(dto, mapPetMedicalRecord);
  },

  // POST /api/v1/pets/{petId}/medical-records - Add a medical record for a pet
  async createMedicalRecord(
    petId: string,
    payload: CreatePetMedicalRecordPayload,
  ): Promise<PetMedicalRecord> {
    const dto = await http.post<PetMedicalRecordDto>(
      `/pets/${petId}/medical-records`,
      payload,
    );
    return mapPetMedicalRecord(dto);
  },

  // GET /api/v1/pets/{petId}/ownerships - List ownership history for a pet
  async getOwnerships(petId: string, params: PetDetailConfig) : Promise<PaginatedResponse<PetOwnership>> {
    const dto = await http.get<PageDto<PetOwnershipDto>>(
      `/pets/${petId}/ownerships`,
      { params },
    );
    return mapPage(dto, mapPetOwnership);
  },

  // GET /api/v1/pets/{petId}/media - List media attachments for a pet (paginated)
  async getMedia(petId: string, params?: PetDetailConfig) : Promise<PaginatedResponse<PetMedia>> {
    const dto = await http.get<PageDto<PetMediaDto>>(
      `/pets/${petId}/media`,
      { params },
    );
    return mapPage(dto, mapPetMedia);
  },
};

export default petService;
