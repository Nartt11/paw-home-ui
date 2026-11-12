import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  RescueCaseBoundingBoxParams,
  RescueCaseMarkers,
  RescueCaseNearByParams,
  RescueCasePayload,
  CompleteRescuePayload,

  RescueCompletionQueryParams,
  RescueCaseSearchParams,
  MyRescueCasesParams,
} from "@/types/rescue-case.type";

import { ListParams } from "@/types/api.type";
import rescueService from "@/services/rescue";

export const rescueCaseKeys = {
  all: ["rescue-cases"] as const,

  lists: () => [...rescueCaseKeys.all, "list"] as const,

  list: (params: ListParams) => [...rescueCaseKeys.lists(), params] as const,

  searches: () => [...rescueCaseKeys.all, "search"] as const,

  search: (params: RescueCaseSearchParams) =>
    [...rescueCaseKeys.searches(), params] as const,

  mine: () => [...rescueCaseKeys.all, "mine"] as const,

  myReported: (params: MyRescueCasesParams) =>
    [...rescueCaseKeys.mine(), "reported", params] as const,

  myClaims: () => [...rescueCaseKeys.mine(), "claims"] as const,

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

/** Filtered case list. Pass lat and lng to get the nearest cases first. */
export function useRescueCaseSearch(
  params: RescueCaseSearchParams,
  enabled = true,
) {
  return useQuery({
    queryKey: rescueCaseKeys.search(params),
    queryFn: () => rescueService.searchRescueCases(params),
    enabled,
  });
}

/** Cases the signed-in user reported. */
export function useMyRescueCases(params: MyRescueCasesParams, enabled = true) {
  return useQuery({
    queryKey: rescueCaseKeys.myReported(params),
    queryFn: () => rescueService.getMyRescueCases(params),
    enabled,
  });
}

/** Cases the signed-in user is working on. */
export function useMyRescueClaims(enabled = true) {
  return useQuery({
    queryKey: rescueCaseKeys.myClaims(),
    queryFn: () => rescueService.getMyRescueClaims(),
    enabled,
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
        queryKey: rescueCaseKeys.searches(),
      });

      queryClient.invalidateQueries({
        queryKey: rescueCaseKeys.mine(),
      });

      // a report sent with shareAsPost also publishes a post
      queryClient.invalidateQueries({
        queryKey: ["posts"],
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

function invalidateCompletions(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: rescueCaseKeys.all });
}

export function useRejectRescueCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rescueService.rejectRescueCompletion(id, reason),
    onSuccess: () => invalidateCompletions(queryClient),
  });
}

export function useCompletionReviewQueue(
  params: RescueCompletionQueryParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...rescueCaseKeys.completionsLists(), "review-queue", params],
    queryFn: () => rescueService.getCompletionReviewQueue(params),
    enabled,
  });
}

export function useRescueCaseClaims(caseId?: string) {
  return useQuery({
    queryKey: [...rescueCaseKeys.all, "claims", caseId],
    queryFn: () => rescueService.getRescueCaseClaims(caseId as string),
    enabled: !!caseId,
  });
}
