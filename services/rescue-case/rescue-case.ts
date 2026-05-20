import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import { RescueCase, RescueCaseSummary } from "@/types/rescue-case.type";
import {
  BoundingBoxConfigDto,
  RescueCaseDto,
  RescueCaseListConfigDto,
  RescueCaseMapMarkersConfigDto,
  RescueCaseMarkerDto,
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
    const dto = await http.get<PageDto<RescueCaseSummaryDto>>(apiEndpoints.rescueCases.root, {
      params,
    });
    return mapPage(
      dto,
      mapRescueCaseSummary,
    ) as PaginatedResponse<RescueCaseSummary>;
  },

  // GET /api/v1/rescue-cases/{id} - Get rescue case by ID
  async getRescueCaseById(id: string): Promise<RescueCase> {
    const dto = await http.get<RescueCaseDto>(apiEndpoints.rescueCases.byId(id));
    return mapRescueCase(dto);
  },

  // GET /api/v1/rescue-cases/nearby - Find rescue cases near a location
  async getNearbyRescueCases(
    params: RescueCaseListConfigDto & Record<string, string | number | undefined>,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    const dto = await http.get<PageDto<RescueCaseSummaryDto>>(
      apiEndpoints.rescueCases.nearby,
      { params },
    );
    return mapPage(dto, mapRescueCaseSummary) as PaginatedResponse<RescueCaseSummary>;
  },

  // GET /api/v1/rescue-cases/map/markers - Get map markers in bounding box
  async getRescueMapMarkers(params: RescueCaseMapMarkersConfigDto) : Promise<RescueCaseMarkerDto[]> {
    const dto = await http.get<RescueCaseMarkerDto[]>(
      apiEndpoints.rescueCases.map.markers,
      {
        params,
      },
    );
    return dto;
  },

  // GET /api/v1/rescue-cases/bounding-box - Find rescue cases within bounding box
  async getRescueCasesInBoundingBox(
    params: BoundingBoxConfigDto,
  ): Promise<PaginatedResponse<RescueCaseSummary>> {
    const dto = await http.get<PageDto<RescueCaseSummaryDto>>(
      apiEndpoints.rescueCases.map.boundingBox,
      { params },
    );
    return mapPage(dto, mapRescueCaseSummary) as PaginatedResponse<RescueCaseSummary>;
  },

  // POST /api/v1/rescue-cases - Report a new rescue case
  async createRescueCase(
    payload: UpdateRescueCasePayloadDto,
  ): Promise<RescueCase> {
    const dto = await http.post<RescueCase, UpdateRescueCasePayloadDto>(
      apiEndpoints.rescueCases.root,
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
      apiEndpoints.rescueCases.byId(id),
      payload,
    );
    return mapRescueCase(dto);
  },

  // PATCH /api/v1/rescue-cases/{id}/status - Change rescue case status
  async updateRescueCaseStatus(id: string): Promise<RescueCase> {
    const dto = await http.patch<RescueCase>(apiEndpoints.rescueCases.status(id));
    return mapRescueCase(dto);
  },
};

export default rescueService;
