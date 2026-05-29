import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AdoptionListParams,
  AdoptionCreatePayload,
  AdoptionApprovePayload,
  AdoptionRejectPayload,
} from "@/types/adoption.type";
import adoptionService from "@/services/adoption";

export const adoptionKeys = {
  all: ["adoptions"] as const,
  lists: () => [...adoptionKeys.all, "list"] as const,
  list: (params: AdoptionListParams) =>
    [...adoptionKeys.lists(), params] as const,
  details: () => [...adoptionKeys.all, "detail"] as const,
  detail: (id: string) => [...adoptionKeys.details(), id] as const,
};

export function useAdoptions(params: AdoptionListParams) {
  return useQuery({
    queryKey: adoptionKeys.list(params),
    queryFn: () => adoptionService.getAllAdoptions(params),
  });
}

export function useAdoptionsByUser(userId?: string, params?: AdoptionListParams) {
  return useQuery({
    queryKey: [...adoptionKeys.all, "by-user", userId, params] as const,
    queryFn: async () => {
      if (!userId) {
        return {
          content: [],
          page: 0,
          size: 0,
          totalElements: 0,
          totalPages: 0,
          last: true,
        };
      }
      return await adoptionService.getAdoptionsByUser(userId, params);
    },
    enabled: !!userId,
  });
}

export function useAdoptionDetail(id?: string) {
  return useQuery({
    queryKey: adoptionKeys.detail(id ?? ""),
    queryFn: () => adoptionService.getAdoptionCaseById(id as string),
    enabled: !!id,
  });
}

export function useCreateAdoption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdoptionCreatePayload) =>
      adoptionService.createAdoption(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adoptionKeys.lists(),
      });
    },
  });
}

export function useApproveAdoption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdoptionApprovePayload;
    }) => adoptionService.approveAdoption(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adoptionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adoptionKeys.detail(variables.id),
      });
    },
  });
}

export function useRejectAdoption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdoptionRejectPayload;
    }) => adoptionService.rejectAdoption(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adoptionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adoptionKeys.detail(variables.id),
      });
    },
  });
}

export function useCancelAdoption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adoptionService.cancelAdoption(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: adoptionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adoptionKeys.detail(id),
      });
    },
  });
}

export function useCompleteAdoption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adoptionService.completeAdoption(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: adoptionKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: adoptionKeys.detail(id),
      });
    },
  });
}
