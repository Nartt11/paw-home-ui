import http from "@/lib/http";
import { AdoptionApplication } from "@/types/adoption.type";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";

export interface AdoptionListConfig {
  page?: number;
  size?: number;
}

export type CreateAdoptionPayload = Partial<AdoptionApplication>;

const adoptionService = {
  // GET /api/v1/adoptions - List all adoption applications
  getAllAdoptions(params: AdoptionListConfig) {
    return http.get<BaseResponse<PaginatedResponse<AdoptionApplication>>>(
      "/adoptions",
      {
        params,
      },
    );
  },

  // GET /api/v1/adoptions/{id} - Get adoption application by ID
  getAdoptionCaseById(id: string) {
    return http.get<BaseResponse<AdoptionApplication>>(`/adoptions/${id}`);
  },

  // POST /api/v1/adoptions - Submit an adoption application
  createAdoption(payload: CreateAdoptionPayload) {
    return http.post<BaseResponse<AdoptionApplication>>("/adoptions", payload);
  },

  // PATCH /api/v1/adoptions/{id}/approve - Approve an adoption application
  approveAdoption(id: string) {
    return http.patch<BaseResponse<AdoptionApplication>>(
      `/adoptions/${id}/approve`,
      {},
    );
  },

  // PATCH /api/v1/adoptions/{id}/reject - Reject an adoption application
  rejectAdoption(id: string) {
    return http.patch<BaseResponse<AdoptionApplication>>(
      `/adoptions/${id}/reject`,
      {},
    );
  },

  // PATCH /api/v1/adoptions/{id}/cancel - Cancel an adoption application
  cancelAdoption(id: string) {
    return http.patch<BaseResponse<AdoptionApplication>>(
      `/adoptions/${id}/cancel`,
      {},
    );
  },

  // PATCH /api/v1/adoptions/{id}/complete - Complete an approved adoption
  completeAdoption(id: string) {
    return http.patch<BaseResponse<AdoptionApplication>>(
      `/adoptions/${id}/complete`,
      {},
    );
  },
};

export default adoptionService;
