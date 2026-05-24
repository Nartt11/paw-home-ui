import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import { Banner, BannerListParams, BannerPayload } from "@/types/banner.type";
import { PaginatedResponse } from "@/types/api.type";

export const bannerService = {
  // GET /api/v1/banners - List all banners (Admin only, paginated)
  async getAllBanners(
    params: BannerListParams,
  ): Promise<PaginatedResponse<Banner>> {
    return await http.get<PaginatedResponse<Banner>>(
      apiEndpoints.banners.root,
      {
        params,
      },
    );
  },

  // GET /api/v1/banners/{id} - Get banner by ID (Admin only)
  async getBannerById(id: string): Promise<Banner> {
    return await http.get<Banner>(apiEndpoints.banners.byId(id));
  },

  // GET /api/v1/banners/active - Get active banners (public)
  async getActiveBanners(targetPage:string): Promise<Banner[]> {
    return await http.get<Banner[]>(apiEndpoints.banners.active, {
      params: { targetPage }
    });
  },

  // POST /api/v1/banners - Create a new banner (Admin only)
  async createBanner(payload: BannerPayload): Promise<Banner> {
    return await http.post<Banner>(apiEndpoints.banners.root, payload);
  },

  // PUT /api/v1/banners/{id} - Update an existing banner (Admin only)
  async updateBanner(id: string, payload: BannerPayload): Promise<Banner> {
    return await http.put<Banner>(apiEndpoints.banners.byId(id), payload);
  },

  // PATCH /api/v1/banners/{id}/toggle-active - Toggle banner active status (Admin only)
  async toggleBannerActive(id: string): Promise<Banner> {
    return await http.patch<Banner>(apiEndpoints.banners.toggleActive(id), {});
  },

  // PATCH /api/v1/banners/{id}/display-order - Update banner display order (Admin only)
  async updateBannerDisplayOrder(id: string, order: number): Promise<Banner> {
    return await http.patch<Banner>(
      apiEndpoints.banners.displayOrder(id),
      order,
    );
  },

  // DELETE /api/v1/banners/{id} - Delete a banner (Admin only)
  async deleteBanner(id: string): Promise<void> {
    await http.delete(apiEndpoints.banners.byId(id));
  },
};

export default bannerService;
