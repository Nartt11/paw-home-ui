import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiResponse } from "@/lib/http";
import type { ApiEntity } from "../api-dto";

export interface ConfirmUploadParams {
  folder?: string;
}

export interface TempUploadParams {
  file: File;
  folder?: string;
}

export interface MediaFileDto extends ApiEntity {
  mediaId: string;
  publicId: string;
  url: string;
  resourceType: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  status: string;
  createdAt: string;
}

const mediaService = {
  async getMediaById(id: string): Promise<MediaFileDto> {
    return http.get<MediaFileDto>(apiEndpoints.media.byId(id));
  },

  async uploadTemp({
    file,
    folder,
  }: TempUploadParams): Promise<MediaFileDto> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await http.instance.post<ApiResponse<MediaFileDto>>(
      apiEndpoints.media.uploadTemp,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: folder ? { folder } : undefined,
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
