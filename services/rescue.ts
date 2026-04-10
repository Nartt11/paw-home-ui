import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import { RescueCase } from "@/types/rescue.type";

export interface RescueListConfig {
  page?: number;
  size?: number;
}

const rescueService = {
  getAllRescueCases(params: RescueListConfig) {
    return http.get<BaseResponse<PaginatedResponse<RescueCase>>>(
      "/rescue-cases",
      {
        params,
      },
    );
  },
  getRescueCaseById(id: string) {
    return http.get<BaseResponse<RescueCase>>(`/rescue-cases/${id}`);
  },
};

export default rescueService;
