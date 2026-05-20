import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity, ListParams } from "../api-dto";

export interface GeoNearbyParams extends ListParams {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export type GeoLocationPayload = ApiEntity;
export type GeoLocationDto = ApiEntity;

const geoService = {
  async getNearbyUsers(params: GeoNearbyParams): Promise<GeoLocationDto[]> {
    return http.get<GeoLocationDto[]>(apiEndpoints.geo.nearby, { params });
  },

  async updateMyLocation(payload: GeoLocationPayload): Promise<GeoLocationDto> {
    return http.put<GeoLocationDto, GeoLocationPayload>(
      apiEndpoints.geo.me.location,
      payload,
    );
  },
};

export default geoService;
