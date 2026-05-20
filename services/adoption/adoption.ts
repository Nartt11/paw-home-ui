import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import {
  AdoptionDto,
  AdoptionListConfig,
  AdoptionSummaryDto,
  CreateAdoptionPayload,
} from "./adoption-dto";
import { Adoption, AdoptionSummary } from "@/types/adoption.type";
import { PaginatedResponse } from "@/types/api.type";
import { mapAdoption, mapAdoptionSummary } from "@/mappers/adoption";
import { PageDto } from "../api-dto";
import { mapPage } from "@/mappers/common";

const adoptionService = {
  // GET /api/v1/adoptions - List all adoption applications
  async getAllAdoptions(
    params: AdoptionListConfig,
  ): Promise<PaginatedResponse<AdoptionSummary>> {
    const dto = await http.get<PageDto<AdoptionSummaryDto>>(apiEndpoints.adoptions.root, {
      params,
    });
    return mapPage(
      dto,
      mapAdoptionSummary,
    ) as PaginatedResponse<AdoptionSummary>;
  },

  // GET /api/v1/adoptions/{id} - Get adoption application by ID
  async getAdoptionCaseById(id: string): Promise<Adoption> {
    const dto = await http.get<AdoptionDto>(apiEndpoints.adoptions.byId(id));
    return mapAdoption(dto) as Adoption;
  },

  // GET /api/v1/adoptions/user/{userId} - List adoption applications by user
  async getAdoptionsByUser(
    userId: string,
    params: AdoptionListConfig,
  ): Promise<PaginatedResponse<AdoptionSummary>> {
    const dto = await http.get<PageDto<AdoptionSummaryDto>>(
      apiEndpoints.adoptions.byUser(userId),
      { params },
    );
    return mapPage(
      dto,
      mapAdoptionSummary,
    ) as PaginatedResponse<AdoptionSummary>;
  },

  // POST /api/v1/adoptions - Submit an adoption application
  async createAdoption(payload: CreateAdoptionPayload): Promise<Adoption> {
    const dto = await http.post<AdoptionDto, CreateAdoptionPayload>(
      apiEndpoints.adoptions.root,
      payload,
    );
    return mapAdoption(dto) as Adoption;
  },

  // PATCH /api/v1/adoptions/{id}/approve - Approve an adoption application
  async approveAdoption(id: string, note: string): Promise<Adoption> {
    const dto = await http.patch<AdoptionDto, string>(
      apiEndpoints.adoptions.approve(id),
      note,
    );
    return mapAdoption(dto) as Adoption;
  },

  // PATCH /api/v1/adoptions/{id}/reject - Reject an adoption application
  async rejectAdoption(id: string, note: string): Promise<Adoption> {
    const dto = await http.patch<AdoptionDto, string>(
      apiEndpoints.adoptions.reject(id),
      note,
    );
    return mapAdoption(dto) as Adoption;
  },

  // PATCH /api/v1/adoptions/{id}/cancel - Cancel an adoption application
  async cancelAdoption(id: string): Promise<Adoption> {
    const dto = await http.patch<AdoptionDto>(apiEndpoints.adoptions.cancel(id));
    return mapAdoption(dto) as Adoption;
  },

  // PATCH /api/v1/adoptions/{id}/complete - Complete an approved adoption
  async completeAdoption(id: string): Promise<Adoption> {
    const dto = await http.patch<AdoptionDto>(apiEndpoints.adoptions.complete(id));
    return mapAdoption(dto) as Adoption;
  },
};

export default adoptionService;
