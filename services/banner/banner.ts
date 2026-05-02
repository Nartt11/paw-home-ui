import http from "@/lib/http";
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
    const dto = await http.get<PageDto<BannerDto>>("/banners", {
      params,
    });

    return mapPage(dto, mapBanner) as PaginatedResponse<Banner>;
  },

  // GET /api/v1/banners/{id} - Get banner by ID (Admin only)
  async getBannerById(id: string): Promise<Banner> {
    const dto = await http.get<BannerDto>(`/banners/${id}`);

    return mapBanner(dto);
  },

  // GET /api/v1/banners/by-target-page/{targetPage} - List banners by target page (Admin only, paginated)
  // getBannersByTargetPage(targetPage: string, params: BannerListConfig) {
  //   const dto = await http.get<BaseResponse<PaginatedResponse<Banner>>>(
  //     `/banners/by-target-page/${targetPage}`,
  //     { params },
  //   );
  // },

  // // GET /api/v1/banners/active/{targetPage} - Get active banners for a target page (public)
  // getActiveBanners(targetPage: string) {
  //   const dto = await http.get<BaseResponse<Banner[]>>(`/banners/active/${targetPage}`);
  // },

  // POST /api/v1/banners - Create a new banner (Admin only)
  async createBanner(payload: CreateBannerPayloadDto): Promise<Banner> {
    const dto = await http.post<BannerDto>("/banners", payload);
    return mapBanner(dto);
  },

  // PUT /api/v1/banners/{id} - Update an existing banner (Admin only)
  async updateBanner(
    id: string,
    payload: UpdateBannerPayloadDto,
  ): Promise<Banner> {
    const dto = await http.put<BannerDto>(`/banners/${id}`, payload);
    return mapBanner(dto);
  },

  // PATCH /api/v1/banners/{id}/toggle-active - Toggle banner active status (Admin only)
  async toggleBannerActive(id: string): Promise<Banner> {
    const dto = await http.patch<BannerDto>(`/banners/${id}/toggle-active`, {});
    return mapBanner(dto);
  },

  // PATCH /api/v1/banners/{id}/display-order - Update banner display order (Admin only)
  async updateBannerDisplayOrder(id: string, order: number): Promise<Banner> {
    const dto = await http.patch<BannerDto>(
      `/banners/${id}/display-order`,
      order,
    );
    return mapBanner(dto);
  },

  // DELETE /api/v1/banners/{id} - Delete a banner (Admin only)
  async deleteBanner(id: string): Promise<void> {
    const dto = await http.delete(`/banners/${id}`);
  },
};

export default bannerService;
