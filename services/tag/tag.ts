import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";

import type { ApiEntity, ListParams, PageDto } from "../api-dto";

export type TagDto = ApiEntity;
export type CreateTagPayload = ApiEntity;

const tagService = {
  async getAllTags(params: ListParams): Promise<PageDto<TagDto>> {
    return http.get<PageDto<TagDto>>(apiEndpoints.tags.root, { params });
  },

  async createTag(payload: CreateTagPayload): Promise<TagDto> {
    return http.post<TagDto, CreateTagPayload>(apiEndpoints.tags.root, payload);
  },

  async deleteTag(id: string | number): Promise<void> {
    await http.delete(apiEndpoints.tags.byId(id));
  },
};

export default tagService;
