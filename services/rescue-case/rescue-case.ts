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
  RescueCompletion,
  RescueCompletionQueryParams,
  RescueCaseSearchParams,
  MyRescueCasesParams,
  RescueClaim,
} from "@/types/rescue-case.type";
import { ListParams, PaginatedResponse } from "@/types/api.type";

const rescueService = {
  // GET /api/v1/rescue-cases?status=&priority=&species=&province=&search=&lat=&lng=&distance=
  async searchRescueCases(
    params: RescueCaseSearchParams,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    return await http.get<PaginatedResponse<RescueCaseSummary>>(
      apiEndpoints.rescueCases.root,
      { params },
    );
  },

  // GET /api/v1/users/me/rescue-cases - Cases I reported
  async getMyRescueCases(
    params: MyRescueCasesParams,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    return await http.get<PaginatedResponse<RescueCaseSummary>>(
      apiEndpoints.users.myRescueCases,
      { params },
    );
  },

  // GET /api/v1/users/me/rescue-claims - Cases I am working on
  async getMyRescueClaims(): Promise<RescueClaim[]> {
    return await http.get<RescueClaim[]>(apiEndpoints.users.myRescueClaims);
  },

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

  // GET /api/v1/rescue-cases?lat=&lng=&distance= - Find rescue cases near a location
  async getNearbyRescueCases(
    params: RescueCaseNearByParams,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    return await http.get<PaginatedResponse<RescueCaseSummary>>(
      apiEndpoints.rescueCases.root,
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

  // GET /api/v1/rescue-cases?minLat=&minLng=&maxLat=&maxLng= - Find rescue cases within bounding box
  async getRescueCasesInBoundingBox(
    params: RescueCaseBoundingBoxParams,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    return await http.get<PaginatedResponse<RescueCaseSummary>>(
      apiEndpoints.rescueCases.root,
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

  // GET /api/v1/rescue-cases/completions - List all rescue completions (paginated)
  async getRescueCompletions(
    params: RescueCompletionQueryParams,
  ): Promise<PaginatedResponse<RescueCompletion>> {
    return await http.get<PaginatedResponse<RescueCompletion>>(
      apiEndpoints.rescueCases.completions,
      {
        params,
      },
    );
  },

  // GET /api/v1/rescue-cases/completions/{id} - Get rescue completion details
  async getRescueCompletionById(id: string): Promise<RescueCompletion> {
    return await http.get<RescueCompletion>(
      apiEndpoints.rescueCases.completionById(id),
    );
  },

  // POST /api/v1/rescue-cases/completions/{id}/approve - Approve rescue case completion
  async approveRescueCompletion(id: string): Promise<any> {
    return await http.post<any, void>(
      apiEndpoints.rescueCases.approveCompletion(id),
    );
  },

  // POST /api/v1/rescue-cases/completions/{id}/reject - only an admin settles a DISPUTED one
  async rejectRescueCompletion(id: string, reason: string): Promise<void> {
    await http.post(apiEndpoints.rescueCases.rejectCompletion(id), { reason });
  },

  // GET /api/v1/rescue-cases/completions/review-queue (ADMIN) - disputed or escalated reports
  async getCompletionReviewQueue(
    params: RescueCompletionQueryParams,
  ): Promise<PaginatedResponse<RescueCompletion>> {
    return await http.get<PaginatedResponse<RescueCompletion>>(
      apiEndpoints.rescueCases.completionReviewQueue,
      { params },
    );
  },

  // GET /api/v1/rescue-cases/{id}/claims - who took the case, newest first
  async getRescueCaseClaims(id: string): Promise<RescueClaim[]> {
    return await http.get<RescueClaim[]>(apiEndpoints.rescueCases.claims(id));
  },
};

export default rescueService;
