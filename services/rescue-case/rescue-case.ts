import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import type { RescueCaseMarkerDto } from "@/services/rescue-case/rescue-case-dto";
import {
  RescueCase,
  RescueCaseSummary,
  RescueCaseNearByParams,
  RescueCaseMarkers,
  RescueCaseBoundingBoxParams,
  RescueCasePayload,
  CompleteRescuePayload,
} from "@/types/rescue-case.type";
import { ListParams, PaginatedResponse } from "@/types/api.type";

const rescueService = {
  // GET /api/v1/rescue-cases - List all rescue cases
  async getAllRescueCases(
    params: ListParams,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    return await http.get<PaginatedResponse<RescueCaseSummary>>(
      apiEndpoints.rescueCases.root,
      {
        params,
      },
    );
  },

  // GET /api/v1/rescue-cases/{id} - Get rescue case by ID
  async getRescueCaseById(id: string): Promise<RescueCase> {
    return await http.get<RescueCase>(apiEndpoints.rescueCases.byId(id));
  },

  // GET /api/v1/rescue-cases/nearby - Find rescue cases near a location
  async getNearbyRescueCases(
    params: RescueCaseNearByParams,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    return await http.get<PaginatedResponse<RescueCaseSummary>>(
      apiEndpoints.rescueCases.nearby,
      { params },
    );
  },

  // GET /api/v1/rescue-cases/map/markers - Get map markers in bounding box
  async getRescueMapMarkers(
    params: RescueCaseMarkers,
  ): Promise<RescueCaseMarkerDto[]> {
    return await http.get<RescueCaseMarkerDto[]>(
      apiEndpoints.rescueCases.map.markers,
      {
        params,
      },
    );
  },

  // GET /api/v1/rescue-cases/bounding-box - Find rescue cases within bounding box
  async getRescueCasesInBoundingBox(
    params: RescueCaseBoundingBoxParams,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    return await http.get<PaginatedResponse<RescueCaseSummary>>(
      apiEndpoints.rescueCases.map.boundingBox,
      { params },
    );
  },

  // POST /api/v1/rescue-cases - Report a new rescue case
  async createRescueCase(payload: RescueCasePayload): Promise<RescueCase> {
    return await http.post<RescueCase, RescueCasePayload>(
      apiEndpoints.rescueCases.root,
      payload,
    );
  },

  // PUT /api/v1/rescue-cases/{id} - Update a rescue case
  async updateRescueCase(
    id: string,
    payload: Partial<RescueCasePayload>,
  ): Promise<RescueCase> {
    return await http.put<RescueCase, Partial<RescueCasePayload>>(
      apiEndpoints.rescueCases.byId(id),
      payload,
    );
  },

  // PATCH /api/v1/rescue-cases/{id}/status - Change rescue case status
  async updateRescueCaseStatus(id: string, status: string): Promise<RescueCase> {
    return await http.patch<RescueCase, string>(apiEndpoints.rescueCases.status(id), status);
  },

  // POST /api/v1/rescue-cases/{id}/complete - Complete rescue case
  async completeRescue(
    id: string,
    payload: CompleteRescuePayload,
  ): Promise<RescueCase> {
    return await http.post<RescueCase, CompleteRescuePayload>(
      apiEndpoints.rescueCases.complete(id),
      payload,
    );
  },
};

export default rescueService;
