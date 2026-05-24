import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TagCreatePayload, TagListParams } from "@/types/tag.type";
import tagService from "@/services/tag";

export const tagKeys = {
  all: ["tags"] as const,

  lists: () => [...tagKeys.all, "list"] as const,

  list: (params: TagListParams) => [...tagKeys.lists(), params] as const,
};

export function useTags(params: TagListParams) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () => tagService.getAllTags(params),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TagCreatePayload) => tagService.createTag(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tagKeys.lists(),
      });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tagKeys.lists(),
      });
    },
  });
}
