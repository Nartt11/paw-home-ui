import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity } from "../api-dto";
import type { ApiResponse } from "@/lib/http";

export interface ConfirmUploadParams {
  folder?: string;
}

export type MediaFileDto = ApiEntity;

const mediaService = {
  async getMediaById(id: string): Promise<MediaFileDto> {
    return http.get<MediaFileDto>(apiEndpoints.media.byId(id));
  },

  async uploadTemp(payload: FormData): Promise<MediaFileDto> {
    const response = await http.instance.post<ApiResponse<MediaFileDto>>(
      apiEndpoints.media.uploadTemp,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  },

  async confirmUpload(
    id: string,
    params?: ConfirmUploadParams,
  ): Promise<MediaFileDto> {
    return http.post<MediaFileDto>(
      `${apiEndpoints.media.confirm(id)}${params?.folder ? `?folder=${encodeURIComponent(params.folder)}` : ""}`,
      {},
    );
  },

  async deleteMedia(id: string): Promise<void> {
    await http.delete(apiEndpoints.media.byId(id));
  },
};

export default mediaService;
