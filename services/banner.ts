import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import { Banner } from "@/types/banner.type";

export interface BannerListConfig {
  page?: number;
  size?: number;
}

export type CreateBannerPayload = Partial<Banner>;
export type UpdateBannerPayload = Partial<Banner>;

export interface UpdateBannerDisplayOrderPayload {
  display_order: number;
}

export const bannerService = {
  // GET /api/v1/banners - List all banners (Admin only, paginated)
  getAllBanners(params: BannerListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Banner>>>("/banners", {
      params,
    });
  },

  // GET /api/v1/banners/{id} - Get banner by ID (Admin only)
  getBannerById(id: string) {
    return http.get<BaseResponse<Banner>>(`/banners/${id}`);
  },

  // GET /api/v1/banners/by-target-page/{targetPage} - List banners by target page (Admin only, paginated)
  getBannersByTargetPage(targetPage: string, params: BannerListConfig) {
    return http.get<BaseResponse<PaginatedResponse<Banner>>>(
      `/banners/by-target-page/${targetPage}`,
      { params },
    );
  },

  // GET /api/v1/banners/active/{targetPage} - Get active banners for a target page (public)
  getActiveBanners(targetPage: string) {
    return http.get<BaseResponse<Banner[]>>(`/banners/active/${targetPage}`);
  },

  // POST /api/v1/banners - Create a new banner (Admin only)
  createBanner(payload: CreateBannerPayload) {
    return http.post<BaseResponse<Banner>>("/banners", payload);
  },

  // PUT /api/v1/banners/{id} - Update an existing banner (Admin only)
  updateBanner(id: string, payload: UpdateBannerPayload) {
    return http.put<BaseResponse<Banner>>(`/banners/${id}`, payload);
  },

  // PATCH /api/v1/banners/{id}/toggle-active - Toggle banner active status (Admin only)
  toggleBannerActive(id: string) {
    return http.patch<BaseResponse<Banner>>(`/banners/${id}/toggle-active`, {});
  },

  // PATCH /api/v1/banners/{id}/display-order - Update banner display order (Admin only)
  updateBannerDisplayOrder(
    id: string,
    payload: UpdateBannerDisplayOrderPayload,
  ) {
    return http.patch<BaseResponse<Banner>>(
      `/banners/${id}/display-order`,
      payload,
    );
  },

  // DELETE /api/v1/banners/{id} - Delete a banner (Admin only)
  deleteBanner(id: string) {
    return http.delete<BaseResponse<null>>(`/banners/${id}`);
  },
};

export default bannerService;
