import http from "@/lib/http";
import { AdoptionApplication } from "@/types/adoption.type";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";

export interface AdoptionListConfig {
  page?: number;
  size?: number;
}

const adoptionService = {
  getAllAdoptions(params: AdoptionListConfig) {
    return http.get<BaseResponse<PaginatedResponse<AdoptionApplication>>>(
      "/adoptions",
      {
        params,
      },
    );
  },
  getAdoptionCaseById(id: string) {
    return http.get<BaseResponse<AdoptionApplication>>(`/adoptions/${id}`);
  },
};

export default adoptionService;
