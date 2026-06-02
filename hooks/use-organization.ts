import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  OrganizationBoundingBoxParams,
  OrganizationCreatePayload,
  OrganizationListParams,
  OrganizationMarkerParams,
  OrganizationStatus,
  OrganizationUpdatePayload,
  MyOrganizationResponse,
} from "@/types/organization.type";
import organizationService from "@/services/organization";

export const organizationKeys = {
  all: ["organizations"] as const,

  lists: () => [...organizationKeys.all, "list"] as const,
  list: (params: OrganizationListParams) =>
    [...organizationKeys.lists(), params] as const,

  details: () => [...organizationKeys.all, "detail"] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,

  me: () => [...organizationKeys.all, "me"] as const,

  members: () => [...organizationKeys.all, "members"] as const,
  memberList: (id: string, params: OrganizationListParams) =>
    [...organizationKeys.members(), id, params] as const,

  boundingBoxes: () => [...organizationKeys.all, "bounding-box"] as const,
  boundingBox: (params: OrganizationBoundingBoxParams) =>
    [...organizationKeys.boundingBoxes(), params] as const,

  markers: () => [...organizationKeys.all, "markers"] as const,
  markerList: (params: OrganizationMarkerParams) =>
    [...organizationKeys.markers(), params] as const,
};

export function useOrganizations(params: OrganizationListParams) {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => organizationService.getAllOrganizations(params),
  });
}

export function useOrganizationDetail(id?: string) {
  return useQuery({
    queryKey: organizationKeys.detail(id ?? ""),
    queryFn: () => organizationService.getOrganizationById(id as string),
    enabled: !!id,
  });
}

export function useOrganizationMembers(
  id?: string,
  params?: OrganizationListParams,
) {
  return useQuery({
    queryKey: organizationKeys.memberList(
      id ?? "",
      params as OrganizationListParams,
    ),
    queryFn: () =>
      organizationService.getOrganizationMembers(
        id as string,
        params as OrganizationListParams,
      ),
    enabled: !!id && !!params,
  });
}

export function useOrganizationsInBoundingBox(
  params?: OrganizationBoundingBoxParams,
) {
  return useQuery({
    queryKey: organizationKeys.boundingBox(
      params as OrganizationBoundingBoxParams,
    ),
    queryFn: () =>
      organizationService.getOrganizationsInBoundingBox(
        params as OrganizationBoundingBoxParams,
      ),
    enabled: !!params,
  });
}

export function useOrganizationMapMarkers(params?: OrganizationMarkerParams) {
  return useQuery({
    queryKey: organizationKeys.markerList(params as OrganizationMarkerParams),
    queryFn: () =>
      organizationService.getOrganizationMapMarkers(
        params as OrganizationMarkerParams,
      ),
    enabled: !!params,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrganizationCreatePayload) =>
      organizationService.createOrganization(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.boundingBoxes(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.markers(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.me(),
      });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: OrganizationUpdatePayload;
    }) => organizationService.updateOrganization(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.boundingBoxes(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.markers(),
      });
    },
  });
}

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrganizationStatus }) =>
      organizationService.updateOrganizationStatus(id, status),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.boundingBoxes(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.markers(),
      });
    },
  });
}

export function useRemoveOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      organizationService.removeMember(id, userId),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });
    },
  });
}

export function useAddOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { email: string; role: string } }) =>
      organizationService.addMember(id, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });
    },
  });
}

export function useUpdateOrganizationMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId, payload }: { id: string; userId: string; payload: { role: string } }) =>
      organizationService.updateMemberRole(id, userId, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.members(),
      });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(variables.id),
      });
    },
  });
}

export function useDeactivateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationService.deactivateOrganization(id),

    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.boundingBoxes(),
      });

      queryClient.invalidateQueries({
        queryKey: organizationKeys.markers(),
      });
    },
  });
}

export function useMyOrganization() {
  return useQuery({
    queryKey: organizationKeys.me(),
    queryFn: () => organizationService.getMyOrganization(),
  });
}

