import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import mediaService, {
  type ConfirmUploadParams,
  type TempUploadParams,
} from "@/services/media";

export const mediaKeys = {
  all: ["media"] as const,

  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (id: string) => [...mediaKeys.details(), id] as const,
};

export function useMediaDetail(id?: string) {
  return useQuery({
    queryKey: mediaKeys.detail(id ?? ""),
    queryFn: () => mediaService.getMediaById(id as string),
    enabled: !!id,
  });
}

export function useUploadTempMedia() {
  return useMutation({
    mutationFn: (params: TempUploadParams) => mediaService.uploadTemp(params),
  });
}

export function useConfirmMediaUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: string;
      params?: ConfirmUploadParams;
    }) => mediaService.confirmUpload(id, params),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: mediaKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaService.deleteMedia(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: mediaKeys.detail(id),
      });
    },
  });
}
