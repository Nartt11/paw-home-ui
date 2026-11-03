import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import { PaginatedResponse } from "@/types/api.type";
import {
  Pet,
  PetMedia,
  PetMedicalRecord,
  PetOwnership,
  PetStatus,
  PetSummary,
  PetListParams,
  PetCreatePayload,
  PetUpdatePayload,
  PetTransferOwnershipPayload,
  PetMedicalRecordCreatePayload,
  PetDetailParams,
  PetMediaCreatePayload,
  PetTaxonomySpecies,
} from "@/types/pet.type";

const petService = {
  // GET /api/v1/pets - List all pets (paginated, optional filters)
  async getAllPets(
    params: PetListParams,
  ): Promise<PaginatedResponse<PetSummary>> {
    return await http.get<PaginatedResponse<PetSummary>>(
      apiEndpoints.pets.root,
      { params },
    );
  },

  // GET /api/v1/pets/{id} - Get pet by ID (includes organization details)
  async getPetById(petId: string): Promise<Pet> {
    return await http.get<Pet>(apiEndpoints.pets.byId(petId));
  },

  // GET /api/v1/pets?availableOnly=true - List available pets (paginated, optional filters)
  async getAvailablePets(
    params: PetListParams,
  ): Promise<PaginatedResponse<PetSummary>> {
    return await http.get<PaginatedResponse<PetSummary>>(
      apiEndpoints.pets.root,
      { params: { ...params, availableOnly: true } },
    );
  },

  // GET /api/v1/pets?organizationId={organizationId} - List pets by organization (paginated)
  async getPetsByOrganization(
    organizationId: string,
    params: PetListParams,
  ): Promise<PaginatedResponse<PetSummary>> {
    return await http.get<PaginatedResponse<PetSummary>>(
      apiEndpoints.pets.root,
      { params: { ...params, organizationId } },
    );
  },

  // GET /api/v1/pets?userId={userId} - List pets by user (paginated, admin only)
  async getPetsByUser(
    userId: string,
    params: PetListParams,
  ): Promise<PaginatedResponse<PetSummary>> {
    return await http.get<PaginatedResponse<PetSummary>>(
      apiEndpoints.pets.root,
      { params: { ...params, userId } },
    );
  },

  // GET /api/v1/pets/taxonomy - List all species with their breeds
  async getTaxonomy(): Promise<PetTaxonomySpecies[]> {
    return await http.get<PetTaxonomySpecies[]>(apiEndpoints.pets.taxonomy);
  },

  // POST /api/v1/pets - Create a pet (shelter-owned when shelterId is set, otherwise user-owned)
  async createPet(payload: Partial<PetCreatePayload>): Promise<Pet> {
    return await http.post<Pet>(apiEndpoints.pets.root, payload);
  },

  // PUT /api/v1/pets/{id} - Update an existing pet
  async updatePet(
    petId: string,
    payload: Partial<PetUpdatePayload>,
  ): Promise<Pet> {
    return await http.put<Pet>(apiEndpoints.pets.byId(petId), payload);
  },

  // PATCH /api/v1/pets/{id}/status - Change pet status
  async updatePetStatus(petId: string, status: PetStatus): Promise<Pet> {
    return await http.patch<Pet>(apiEndpoints.pets.status(petId), status);
  },

  // POST /api/v1/pets/{id}/transfer-ownership - Transfer pet ownership
  async transferOwnership(
    petId: string,
    payload: PetTransferOwnershipPayload,
  ): Promise<void> {
    await http.post<void>(apiEndpoints.pets.transferOwnership(petId), payload);
  },

  // DELETE /api/v1/pets/{id} - Soft-delete a pet
  async deletePet(petId: string) {
    await http.delete<null>(apiEndpoints.pets.byId(petId));
  },
};

export const petDetailsService = {
  // GET /api/v1/pets/{petId}/medical-records - List medical records for a pet
  async getMedicalRecords(
    petId: string,
    params: PetDetailParams,
  ): Promise<PaginatedResponse<PetMedicalRecord>> {
    return await http.get<PaginatedResponse<PetMedicalRecord>>(
      apiEndpoints.pets.medicalRecords(petId),
      { params },
    );
  },

  // POST /api/v1/pets/{petId}/medical-records - Add a medical record for a pet
  async createMedicalRecord(
    petId: string,
    payload: PetMedicalRecordCreatePayload,
  ): Promise<PetMedicalRecord> {
    return await http.post<PetMedicalRecord>(
      apiEndpoints.pets.createMedicalRecord(petId),
      payload,
    );
  },

  // GET /api/v1/pets/{petId}/ownerships - List ownership history for a pet
  async getOwnerships(
    petId: string,
    params: PetDetailParams,
  ): Promise<PaginatedResponse<PetOwnership>> {
    return await http.get<PaginatedResponse<PetOwnership>>(
      apiEndpoints.pets.ownerships(petId),
      { params },
    );
  },

  // GET /api/v1/pets/{petId}/media - List media attachments for a pet (paginated)
  async getMedia(
    petId: string,
    params?: PetDetailParams,
  ): Promise<PaginatedResponse<PetMedia>> {
    return await http.get<PaginatedResponse<PetMedia>>(
      apiEndpoints.pets.media(petId),
      { params },
    );
  },

  async createMedia(
    petId: string,
    payload: PetMediaCreatePayload,
    primary = false,
  ): Promise<PetMedia> {
    return await http.post<PetMedia>(
      apiEndpoints.pets.createMedia(petId, primary),
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  async updateMediaPrimary(petId: string, mediaId: string): Promise<PetMedia> {
    return await http.patch<PetMedia>(
      apiEndpoints.pets.updateMediaPrimary(petId, mediaId),
    );
  },

  async deleteMedia(petId: string, mediaId: string): Promise<void> {
    await http.delete(apiEndpoints.pets.deleteMedia(petId, mediaId));
  },
};

export default petService;
