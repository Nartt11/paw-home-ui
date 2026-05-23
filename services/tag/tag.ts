import http from "@/lib/http";
import apiEndpoints from "@/services/endpoint";
import { PaginatedResponse } from "@/types/api.type";
import { Tag, TagCreatePayload, TagListParams } from "@/types/tag.type";

const tagService = {
  async getAllTags(params: TagListParams): Promise<PaginatedResponse<Tag>> {
    return http.get<PaginatedResponse<Tag>>(apiEndpoints.tags.root, { params });
  },

  async createTag(payload: TagCreatePayload): Promise<Tag> {
    return http.post<Tag, TagCreatePayload>(apiEndpoints.tags.root, payload);
  },

  async deleteTag(id: string): Promise<void> {
    await http.delete(apiEndpoints.tags.byId(id));
  },
};

export default tagService;
