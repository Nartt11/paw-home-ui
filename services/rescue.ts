import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import { RescueCase } from "@/types/rescue.type";

export interface RescueListConfig {
  page?: number;
  size?: number;
}

export interface NearbyRescueCasesConfig {
  lat: number;
  lng: number;
  radius?: number; // meters or km depending on backend
}

export interface RescueBoundingBoxConfig {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface RescueMapMarkersConfig extends RescueBoundingBoxConfig {}

export interface RescueStatusUpdatePayload {
  status: RescueCase["status"] | string;
}

export type CreateRescueCasePayload = Partial<RescueCase>;
export type UpdateRescueCasePayload = Partial<RescueCase>;

const rescueService = {
  // GET /api/v1/rescue-cases - List all rescue cases
  getAllRescueCases(params: RescueListConfig) {
    return http.get<BaseResponse<PaginatedResponse<RescueCase>>>(
      "/rescue-cases",
      {
        params,
      },
    );
  },

  // GET /api/v1/rescue-cases/{id} - Get rescue case by ID
  getRescueCaseById(id: string) {
    return http.get<BaseResponse<RescueCase>>(`/rescue-cases/${id}`);
  },

  // GET /api/v1/rescue-cases/nearby - Find rescue cases near a location
  getNearbyRescueCases(params: NearbyRescueCasesConfig & RescueListConfig) {
    return http.get<BaseResponse<PaginatedResponse<RescueCase>>>(
      "/rescue-cases/nearby",
      { params },
    );
  },

  // GET /api/v1/rescue-cases/map/markers - Get map markers in bounding box
  getRescueMapMarkers(params: RescueMapMarkersConfig) {
    return http.get<BaseResponse<RescueCase[]>>("/rescue-cases/map/markers", {
      params,
    });
  },

  // GET /api/v1/rescue-cases/bounding-box - Find rescue cases within bounding box
  getRescueCasesInBoundingBox(
    params: RescueBoundingBoxConfig & RescueListConfig,
  ) {
    return http.get<BaseResponse<PaginatedResponse<RescueCase>>>(
      "/rescue-cases/bounding-box",
      { params },
    );
  },

  // POST /api/v1/rescue-cases - Report a new rescue case
  createRescueCase(payload: CreateRescueCasePayload) {
    return http.post<BaseResponse<RescueCase>>("/rescue-cases", payload);
  },

  // PUT /api/v1/rescue-cases/{id} - Update a rescue case
  updateRescueCase(id: string, payload: UpdateRescueCasePayload) {
    return http.put<BaseResponse<RescueCase>>(`/rescue-cases/${id}`, payload);
  },

  // PATCH /api/v1/rescue-cases/{id}/status - Change rescue case status
  updateRescueCaseStatus(id: string, payload: RescueStatusUpdatePayload) {
    return http.patch<BaseResponse<RescueCase>>(
      `/rescue-cases/${id}/status`,
      payload,
    );
  },
};

export default rescueService;
