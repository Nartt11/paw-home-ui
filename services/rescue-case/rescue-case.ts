import http from "@/lib/http";

import { RescueCase, RescueCaseSummary } from "@/types/rescue-case.type";
import {
  RescueCaseDto,
  RescueCaseListConfigDto,
  RescueCaseSummaryDto,
  UpdateRescueCasePayloadDto,
} from "./rescue-case-dto";
import { PageDto } from "../api-dto";
import { PaginatedResponse } from "@/types/api.type";
import { mapPage } from "@/mappers/common";
import { mapRescueCase, mapRescueCaseSummary } from "@/mappers/rescue-case";

const rescueService = {
  // GET /api/v1/rescue-cases - List all rescue cases
  async getAllRescueCases(
    params: RescueCaseListConfigDto,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    const dto = await http.get<PageDto<RescueCaseSummaryDto>>("/rescue-cases", {
      params,
    });
    return mapPage(
      dto,
      mapRescueCaseSummary,
    ) as PaginatedResponse<RescueCaseSummary>;
  },

  // GET /api/v1/rescue-cases/{id} - Get rescue case by ID
  async getRescueCaseById(id: string): Promise<RescueCase> {
    const dto = await http.get<RescueCaseDto>(`/rescue-cases/${id}`);
    return mapRescueCase(dto);
  },

  // GET /api/v1/rescue-cases/nearby - Find rescue cases near a location
  // async getNearbyRescueCases(
  //   params: NearbyRescueCasesConfig & RescueListConfig,
  // ) {
  //   const dto = await http.get<BaseResponse<PaginatedResponse<RescueCase>>>(
  //     "/rescue-cases/nearby",
  //     { params },
  //   );
  // },

  // // GET /api/v1/rescue-cases/map/markers - Get map markers in bounding box
  // async getRescueMapMarkers(params: RescueMapMarkersConfig) {
  //   const dto = await http.get<BaseResponse<RescueCase[]>>("/rescue-cases/map/markers", {
  //     params,
  //   });
  // },

  // // GET /api/v1/rescue-cases/bounding-box - Find rescue cases within bounding box
  // async getRescueCasesInBoundingBox(
  //   params: RescueBoundingBoxConfig & RescueListConfig,
  // ) {
  //   const dto = await http.get<BaseResponse<PaginatedResponse<RescueCase>>>(
  //     "/rescue-cases/bounding-box",
  //     { params },
  //   );
  // },

  // POST /api/v1/rescue-cases - Report a new rescue case
  async createRescueCase(
    payload: UpdateRescueCasePayloadDto,
  ): Promise<RescueCase> {
    const dto = await http.post<RescueCase, UpdateRescueCasePayloadDto>(
      "/rescue-cases",
      payload,
    );
    return mapRescueCase(dto);
  },

  // PUT /api/v1/rescue-cases/{id} - Update a rescue case
  async updateRescueCase(
    id: string,
    payload: UpdateRescueCasePayloadDto,
  ): Promise<RescueCase> {
    const dto = await http.put<RescueCase, UpdateRescueCasePayloadDto>(
      `/rescue-cases/${id}`,
      payload,
    );
    return mapRescueCase(dto);
  },

  // PATCH /api/v1/rescue-cases/{id}/status - Change rescue case status
  async updateRescueCaseStatus(id: string): Promise<RescueCase> {
    const dto = await http.patch<RescueCase>(`/rescue-cases/${id}/status`);
    return mapRescueCase(dto);
  },
};

export default rescueService;
