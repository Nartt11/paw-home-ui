import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BannerListParams, BannerPayload } from "@/types/banner.type";
import bannerService from "@/services/banner";

export const bannerKeys = {
  all: ["banners"] as const,

  lists: () => [...bannerKeys.all, "list"] as const,
  list: (params: BannerListParams) => [...bannerKeys.lists(), params] as const,

  details: () => [...bannerKeys.all, "detail"] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,

  activeLists: () => [...bannerKeys.all, "active"] as const,
  activeList: (targetPage: string) =>
    [...bannerKeys.activeLists(), targetPage] as const,
};

export function useBanners(params: BannerListParams) {
  return useQuery({
    queryKey: bannerKeys.list(params),
    queryFn: () => bannerService.getAllBanners(params),
  });
}

export function useBannerDetail(id?: string) {
  return useQuery({
    queryKey: bannerKeys.detail(id ?? ""),
    queryFn: () => bannerService.getBannerById(id as string),
    enabled: !!id,
  });
}

export function useActiveBanners(targetPage?: string) {
  return useQuery({
    queryKey: bannerKeys.activeList(targetPage ?? ""),
    queryFn: () => bannerService.getActiveBanners(targetPage as string),
    enabled: !!targetPage,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BannerPayload) => bannerService.createBanner(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.activeLists(),
      });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BannerPayload }) =>
      bannerService.updateBanner(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.activeLists(),
      });
    },
  });
}

export function useToggleBannerActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannerService.toggleBannerActive(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.activeLists(),
      });
    },
  });
}

export function useUpdateBannerDisplayOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, order }: { id: string; order: number }) =>
      bannerService.updateBannerDisplayOrder(id, order),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.activeLists(),
      });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannerService.deleteBanner(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: bannerKeys.activeLists(),
      });
    },
  });
}
