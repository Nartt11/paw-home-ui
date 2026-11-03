import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { findLocationByName } from "@/lib/location";
import locationService from "@/services/location";
import type {
  ProvinceListParams,
  ResolvedLocation,
} from "@/types/location.type";

const LOCATION_STALE_TIME = 60 * 60 * 1000;
const ALL_PROVINCES_PARAMS: ProvinceListParams = { page: 0, size: 100 };

export const locationKeys = {
  all: ["locations"] as const,

  provinces: (params: ProvinceListParams) =>
    [...locationKeys.all, "provinces", params] as const,

  province: (code: string | number) =>
    [...locationKeys.all, "province", String(code)] as const,

  reverse: (latitude: number, longitude: number) =>
    [...locationKeys.all, "reverse", latitude, longitude] as const,
};

export function useProvinces() {
  return useQuery({
    queryKey: locationKeys.provinces(ALL_PROVINCES_PARAMS),
    queryFn: () => locationService.getProvinces(ALL_PROVINCES_PARAMS),
    staleTime: LOCATION_STALE_TIME,
  });
}

export function useProvinceDetail(code?: string) {
  return useQuery({
    queryKey: locationKeys.province(code ?? ""),
    queryFn: () => locationService.getProvinceDetail(code as string),
    enabled: !!code,
    staleTime: LOCATION_STALE_TIME,
  });
}

/**
 * Đổi tọa độ trên bản đồ thành địa chỉ kèm mã tỉnh/phường của hệ thống.
 * Mã để trống khi không đối chiếu được, không bao giờ dùng giá trị đoán.
 */
export function useResolveLocation() {
  const queryClient = useQueryClient();

  return useCallback(
    async (latitude: number, longitude: number): Promise<ResolvedLocation> => {
      const address = await queryClient.fetchQuery({
        queryKey: locationKeys.reverse(latitude, longitude),
        queryFn: () => locationService.reverseGeocode(latitude, longitude),
        staleTime: LOCATION_STALE_TIME,
      });

      try {
        const provinces = await queryClient.fetchQuery({
          queryKey: locationKeys.provinces(ALL_PROVINCES_PARAMS),
          queryFn: () => locationService.getProvinces(ALL_PROVINCES_PARAMS),
          staleTime: LOCATION_STALE_TIME,
        });
        const province = findLocationByName(
          provinces.content,
          address.provinceName,
        );
        if (!province) {
          return { ...address, provinceCode: "", wardCode: "" };
        }

        const detail = await queryClient.fetchQuery({
          queryKey: locationKeys.province(province.code),
          queryFn: () => locationService.getProvinceDetail(province.code),
          staleTime: LOCATION_STALE_TIME,
        });
        const ward = findLocationByName(detail.wards, address.wardName);

        return {
          ...address,
          provinceCode: String(province.code),
          wardCode: ward ? String(ward.code) : "",
        };
      } catch {
        return { ...address, provinceCode: "", wardCode: "" };
      }
    },
    [queryClient],
  );
}
