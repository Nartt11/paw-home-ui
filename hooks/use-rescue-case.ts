import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  RescueCaseBoundingBoxParams,
  RescueCaseMarkers,
  RescueCaseNearByParams,
  RescueCasePayload,
  CompleteRescuePayload,
  RescueCompletion,
  RescueCompletionQueryParams,
} from "@/types/rescue-case.type";

import { ListParams } from "@/types/api.type";
import rescueService from "@/services/rescue";

export const rescueCaseKeys = {
  all: ["rescue-cases"] as const,

  lists: () => [...rescueCaseKeys.all, "list"] as const,

  list: (params: ListParams) => [...rescueCaseKeys.lists(), params] as const,

  details: () => [...rescueCaseKeys.all, "detail"] as const,

  detail: (id: string) => [...rescueCaseKeys.details(), id] as const,

  nearbyLists: () => [...rescueCaseKeys.all, "nearby"] as const,

  nearbyList: (params: RescueCaseNearByParams) =>
    [...rescueCaseKeys.nearbyLists(), params] as const,

  markers: () => [...rescueCaseKeys.all, "markers"] as const,

  markerList: (params: RescueCaseMarkers) =>
    [...rescueCaseKeys.markers(), params] as const,

  boundingBoxes: () => [...rescueCaseKeys.all, "bounding-box"] as const,

  boundingBox: (params: RescueCaseBoundingBoxParams) =>
    [...rescueCaseKeys.boundingBoxes(), params] as const,

  completionsLists: () => [...rescueCaseKeys.all, "completions"] as const,

  completionsList: (params: RescueCompletionQueryParams) =>
    [...rescueCaseKeys.completionsLists(), params] as const,

  completionDetails: () => [...rescueCaseKeys.all, "completion-detail"] as const,

  completionDetail: (id: string) => [...rescueCaseKeys.completionDetails(), id] as const,
};

export function useRescueCases(params: ListParams) {
  return useQuery({
    queryKey: rescueCaseKeys.list(params),
    queryFn: () => rescueService.getAllRescueCases(params),
  });
}

export function useRescueCaseDetail(id?: string) {
  return useQuery({
    queryKey: rescueCaseKeys.detail(id ?? ""),
    queryFn: () => rescueService.getRescueCaseById(id as string),
    enabled: !!id,
  });
}

export function useNearbyRescueCases(params?: RescueCaseNearByParams) {
  return useQuery({
    queryKey: rescueCaseKeys.nearbyList(params as RescueCaseNearByParams),
    queryFn: () =>
      rescueService.getNearbyRescueCases(params as RescueCaseNearByParams),
    enabled: !!params,
  });
}

export function useRescueMapMarkers(params?: RescueCaseMarkers) {
  return useQuery({
    queryKey: rescueCaseKeys.markerList(params as RescueCaseMarkers),
    queryFn: () =>
      rescueService.getRescueMapMarkers(params as RescueCaseMarkers),
    enabled: !!params,
  });
}

export function useRescueCasesInBoundingBox(
  params?: RescueCaseBoundingBoxParams,
) {
  return useQuery({
    queryKey: rescueCaseKeys.boundingBox(params as RescueCaseBoundingBoxParams),
    queryFn: () =>
      rescueService.getRescueCasesInBoundingBox(
        params as RescueCaseBoundingBoxParams,
      ),
    enabled: !!params,
  });
}

export function useCreateRescueCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RescueCasePayload) =>
      rescueService.createRescueCase(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.nearbyLists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.markers(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.boundingBoxes(),
      });
    },
  });
}

export function useUpdateRescueCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<RescueCasePayload>;
    }) => rescueService.updateRescueCase(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.nearbyLists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.markers(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.boundingBoxes(),
      });
    },
  });
}

export function useUpdateRescueCaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      rescueService.updateRescueCaseStatus(id, status),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.nearbyLists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.markers(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.boundingBoxes(),
      });
    },
  });
}

export function useCompleteRescue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CompleteRescuePayload;
    }) => rescueService.completeRescue(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.nearbyLists(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.markers(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.boundingBoxes(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.completionsLists(),
      });
    },
  });
}

export function useRescueCompletions(params: RescueCompletionQueryParams) {
  return useQuery({
    queryKey: rescueCaseKeys.completionsList(params),
    queryFn: () => rescueService.getRescueCompletions(params),
  });
}

export function useRescueCompletionDetail(id?: string) {
  return useQuery({
    queryKey: rescueCaseKeys.completionDetail(id ?? ""),
    queryFn: () => rescueService.getRescueCompletionById(id as string),
    enabled: !!id,
  });
}

export function useApproveRescueCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rescueService.approveRescueCompletion(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.completionsLists(),
      });
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.completionDetail(id),
      });
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.markers(),
      });
      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.boundingBoxes(),
      });
    },
  });
}
