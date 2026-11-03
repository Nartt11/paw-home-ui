import axios from "axios";

import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import { PaginatedResponse } from "@/types/api.type";
import type {
  ProvinceDetail,
  ProvinceListParams,
  ProvinceSummary,
  ReverseGeocodeResult,
} from "@/types/location.type";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

interface NominatimAddress {
  suburb?: string;
  quarter?: string;
  town?: string;
  village?: string;
  ward?: string;
  city?: string;
  state?: string;
  province?: string;
}

interface NominatimReverseResponse {
  display_name?: string;
  address?: NominatimAddress;
}

const locationService = {
  // GET /api/v1/locations/p - List provinces
  async getProvinces(
    params: ProvinceListParams,
  ): Promise<PaginatedResponse<ProvinceSummary>> {
    return await http.get<PaginatedResponse<ProvinceSummary>>(
      apiEndpoints.locations.provinces,
      { params },
    );
  },

  // GET /api/v1/locations/p/{code} - Get a province with its wards
  async getProvinceDetail(code: string | number): Promise<ProvinceDetail> {
    return await http.get<ProvinceDetail>(
      apiEndpoints.locations.provinceByCode(code),
    );
  },

  // Dùng axios gốc (như cloudinary) để không gửi JWT của hệ thống sang bên thứ ba
  async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult> {
    const { data } = await axios.get<NominatimReverseResponse>(
      NOMINATIM_REVERSE_URL,
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          "accept-language": "vi",
        },
      },
    );
    const address = data.address ?? {};

    return {
      displayName: data.display_name ?? "",
      wardName:
        address.suburb ||
        address.quarter ||
        address.town ||
        address.village ||
        address.ward ||
        "",
      provinceName: address.city || address.state || address.province || "",
    };
  },
};

export default locationService;
