import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import { Banner } from "@/types/banner.type";
import {
  BannerDto,
  BannerListConfig,
  CreateBannerPayloadDto,
  UpdateBannerPayloadDto,
} from "./banner-dto";
import { PaginatedResponse } from "@/types/api.type";
import { PageDto } from "../api-dto";
import { mapPage } from "@/mappers/common";
import { mapBanner } from "@/mappers/banner";

export const bannerService = {
  // GET /api/v1/banners - List all banners (Admin only, paginated)
  async getAllBanners(
    params: BannerListConfig,
  ): Promise<PaginatedResponse<Banner>> {
    const dto = await http.get<PageDto<BannerDto>>(apiEndpoints.banners.root, {
      params,
    });

    return mapPage(dto, mapBanner) as PaginatedResponse<Banner>;
  },

  // GET /api/v1/banners/{id} - Get banner by ID (Admin only)
  async getBannerById(id: string): Promise<Banner> {
    const dto = await http.get<BannerDto>(apiEndpoints.banners.byId(id));

    return mapBanner(dto);
  },

  // GET /api/v1/banners/by-target-page/{targetPage} - List banners by target page (Admin only, paginated)
  // getBannersByTargetPage(targetPage: string, params: BannerListConfig) {
  //   const dto = await http.get<BaseResponse<PaginatedResponse<Banner>>>(
  //     `/banners/by-target-page/${targetPage}`,
  //     { params },
  //   );
  // },

  // GET /api/v1/banners/active - Get active banners (public)
  async getActiveBanners(): Promise<Banner[]> {
    const dto = await http.get<BannerDto[]>(apiEndpoints.banners.active);
    return dto.map(mapBanner);
  },

  // POST /api/v1/banners - Create a new banner (Admin only)
  async createBanner(payload: CreateBannerPayloadDto): Promise<Banner> {
    const dto = await http.post<BannerDto>(apiEndpoints.banners.root, payload);
    return mapBanner(dto);
  },

  // PUT /api/v1/banners/{id} - Update an existing banner (Admin only)
  async updateBanner(
    id: string,
    payload: UpdateBannerPayloadDto,
  ): Promise<Banner> {
    const dto = await http.put<BannerDto>(apiEndpoints.banners.byId(id), payload);
    return mapBanner(dto);
  },

  // PATCH /api/v1/banners/{id}/toggle-active - Toggle banner active status (Admin only)
  async toggleBannerActive(id: string): Promise<Banner> {
    const dto = await http.patch<BannerDto>(apiEndpoints.banners.toggleActive(id), {});
    return mapBanner(dto);
  },

  // PATCH /api/v1/banners/{id}/display-order - Update banner display order (Admin only)
  async updateBannerDisplayOrder(id: string, order: number): Promise<Banner> {
    const dto = await http.patch<BannerDto>(
      apiEndpoints.banners.displayOrder(id),
      order,
    );
    return mapBanner(dto);
  },

  // DELETE /api/v1/banners/{id} - Delete a banner (Admin only)
  async deleteBanner(id: string): Promise<void> {
    await http.delete(apiEndpoints.banners.byId(id));
  },
};

export default bannerService;
