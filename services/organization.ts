import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import { Organization } from "@/types/organization.type,";

export interface OrganizationListConfig {
  page?: number;
  size?: number;
}

const organizationService = {
  getAllOrganizations(params: OrganizationListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Organization>>>(
      "/organizations",
      { params },
    );
  },
  getPetById(petId: string) {
    return http.get<BaseResponse<Organization>>(`/pets/${petId}`);
  },
};

export default organizationService;
