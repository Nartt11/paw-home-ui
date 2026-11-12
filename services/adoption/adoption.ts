import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import {
  Adoption,
  AdoptionListParams,
  AdoptionSummary,
  AdoptionCreatePayload,
  AdoptionApprovePayload,
  AdoptionRejectPayload,
  ReclaimLog,
} from "@/types/adoption.type";
import { PaginatedResponse } from "@/types/api.type";

const adoptionService = {
  // GET /api/v1/adoptions - List all adoption applications
  async getAllAdoptions(
    params: AdoptionListParams,
  ): Promise<PaginatedResponse<AdoptionSummary>> {
    const dto = await http.get<PaginatedResponse<AdoptionSummary>>(
      apiEndpoints.adoptions.root,
      {
        params,
      },
    );
    return dto;
  },

  // GET /api/v1/adoptions/{id} - Get adoption application by ID
  async getAdoptionCaseById(id: string): Promise<Adoption> {
    const adoption = await http.get<Adoption>(apiEndpoints.adoptions.byId(id));
    return adoption;
  },

  // POST /api/v1/adoptions - Submit an adoption application
  async createAdoption(payload: AdoptionCreatePayload): Promise<Adoption> {
    const adoption = await http.post<Adoption, AdoptionCreatePayload>(
      apiEndpoints.adoptions.root,
      payload,
    );
    return adoption;
  },

  // PATCH /api/v1/adoptions/{id}/approve - Approve an adoption application
  async approveAdoption(
    id: string,
    params: AdoptionApprovePayload,
  ): Promise<Adoption> {
    const adoption = await http.patch<Adoption, AdoptionApprovePayload>(
      apiEndpoints.adoptions.approve(id),
      params,
    );
    return adoption;
  },

  // PATCH /api/v1/adoptions/{id}/reject - Reject an adoption application
  async rejectAdoption(id: string, params: AdoptionRejectPayload): Promise<Adoption> {
    const adoption = await http.patch<Adoption, AdoptionRejectPayload>(
      apiEndpoints.adoptions.reject(id),
      params,
    );
    return adoption;
  },

  // PATCH /api/v1/adoptions/{id}/cancel - Cancel an adoption application
  async cancelAdoption(id: string): Promise<Adoption> {
    const adoption = await http.patch<Adoption>(
      apiEndpoints.adoptions.cancel(id),
    );
    return adoption;
  },

  // PATCH /api/v1/adoptions/{id}/complete - Complete an approved adoption
  async completeAdoption(id: string): Promise<Adoption> {
    const adoption = await http.patch<Adoption>(
      apiEndpoints.adoptions.complete(id),
    );
    return adoption;
  },

  // GET /api/v1/adoptions/user/{userId} - List adoptions by user
  async getAdoptionsByUser(
    userId: string,
    params?: AdoptionListParams,
  ): Promise<PaginatedResponse<AdoptionSummary>> {
    return await http.get<PaginatedResponse<AdoptionSummary>>(
      apiEndpoints.adoptions.byUser(userId),
      { params },
    );
  },

  // GET /api/v1/adoptions/reclaims - all for an admin, one organization for its members
  async getReclaimLogs(params: {
    organizationId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<ReclaimLog>> {
    return await http.get<PaginatedResponse<ReclaimLog>>(
      apiEndpoints.adoptions.reclaims,
      { params },
    );
  },
};

export default adoptionService;
