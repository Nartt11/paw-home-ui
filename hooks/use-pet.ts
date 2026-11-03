import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  PetCreatePayload,
  PetDetailParams,
  PetListParams,
  PetMediaCreatePayload,
  PetMedicalRecordCreatePayload,
  PetStatus,
  PetTransferOwnershipPayload,
  PetUpdatePayload,
} from "@/types/pet.type";
import petService, { petDetailsService } from "@/services/pet";

export const petKeys = {
  all: ["pets"] as const,

  lists: () => [...petKeys.all, "list"] as const,
  list: (params: PetListParams) => [...petKeys.lists(), params] as const,

  taxonomy: () => [...petKeys.all, "taxonomy"] as const,
  availableLists: () => [...petKeys.all, "available"] as const,
  availableList: (params: PetListParams) =>
    [...petKeys.availableLists(), params] as const,

  byOrganizationLists: () => [...petKeys.all, "by-organization"] as const,
  byOrganizationList: (organizationId: string, params: PetListParams) =>
    [...petKeys.byOrganizationLists(), organizationId, params] as const,

  byUserLists: () => [...petKeys.all, "by-user"] as const,
  byUserList: (userId: string, params: PetListParams) =>
    [...petKeys.byUserLists(), userId, params] as const,

  details: () => [...petKeys.all, "detail"] as const,
  detail: (petId: string) => [...petKeys.details(), petId] as const,

  medicalRecords: (petId: string) =>
    [...petKeys.detail(petId), "medical-records"] as const,
  medicalRecordList: (petId: string, params: PetDetailParams) =>
    [...petKeys.medicalRecords(petId), params] as const,

  ownerships: (petId: string) =>
    [...petKeys.detail(petId), "ownerships"] as const,
  ownershipList: (petId: string, params: PetDetailParams) =>
    [...petKeys.ownerships(petId), params] as const,

  media: (petId: string) => [...petKeys.detail(petId), "media"] as const,
  mediaList: (petId: string, params?: PetDetailParams) =>
    [...petKeys.media(petId), params] as const,
};

export function usePets(params: PetListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: petKeys.list(params),
    queryFn: () => petService.getAllPets(params),
    enabled: options?.enabled,
  });
}

export function usePetDetail(petId?: string) {
  return useQuery({
    queryKey: petKeys.detail(petId ?? ""),
    queryFn: () => petService.getPetById(petId as string),
    enabled: !!petId,
  });
}

export function usePetTaxonomy() {
  return useQuery({
    queryKey: petKeys.taxonomy(),
    queryFn: () => petService.getTaxonomy(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useAvailablePets(params: PetListParams) {
  return useQuery({
    queryKey: petKeys.availableList(params),
    queryFn: () => petService.getAvailablePets(params),
  });
}

export function usePetsByOrganization(
  organizationId?: string,
  params?: PetListParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: petKeys.byOrganizationList(
      organizationId ?? "",
      params as PetListParams,
    ),
    queryFn: () =>
      petService.getPetsByOrganization(
        organizationId as string,
        params as PetListParams,
      ),
    enabled: (options?.enabled !== false) && !!organizationId && !!params,
  });
}

export function usePetsByUser(userId?: string, params?: PetListParams) {
  return useQuery({
    queryKey: petKeys.byUserList(userId ?? "", params as PetListParams),
    queryFn: () =>
      petService.getPetsByUser(userId as string, params as PetListParams),
    enabled: !!userId && !!params,
  });
}

export function usePetMedicalRecords(petId?: string, params?: PetDetailParams) {
  return useQuery({
    queryKey: petKeys.medicalRecordList(petId ?? "", params as PetDetailParams),
    queryFn: () =>
      petDetailsService.getMedicalRecords(
        petId as string,
        params as PetDetailParams,
      ),
    enabled: !!petId && !!params,
  });
}

export function usePetOwnerships(petId?: string, params?: PetDetailParams) {
  return useQuery({
    queryKey: petKeys.ownershipList(petId ?? "", params as PetDetailParams),
    queryFn: () =>
      petDetailsService.getOwnerships(
        petId as string,
        params as PetDetailParams,
      ),
    enabled: !!petId && !!params,
  });
}

export function usePetMedia(petId?: string, params?: PetDetailParams) {
  return useQuery({
    queryKey: petKeys.mediaList(petId ?? "", params),
    queryFn: () => petDetailsService.getMedia(petId as string, params),
    enabled: !!petId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<PetCreatePayload>) =>
      petService.createPet(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.availableLists() });
      queryClient.invalidateQueries({ queryKey: petKeys.byUserLists() });
      queryClient.invalidateQueries({
        queryKey: petKeys.byOrganizationLists(),
      });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      payload,
    }: {
      petId: string;
      payload: Partial<PetUpdatePayload>;
    }) => petService.updatePet(petId, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.availableLists() });
      queryClient.invalidateQueries({ queryKey: petKeys.byUserLists() });
      queryClient.invalidateQueries({
        queryKey: petKeys.byOrganizationLists(),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.detail(variables.petId),
      });
    },
  });
}

export function useUpdatePetStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, status }: { petId: string; status: PetStatus }) =>
      petService.updatePetStatus(petId, status),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.availableLists() });
      queryClient.invalidateQueries({ queryKey: petKeys.byUserLists() });
      queryClient.invalidateQueries({
        queryKey: petKeys.byOrganizationLists(),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.detail(variables.petId),
      });
    },
  });
}

export function useTransferPetOwnership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      payload,
    }: {
      petId: string;
      payload: PetTransferOwnershipPayload;
    }) => petService.transferOwnership(petId, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.byUserLists() });
      queryClient.invalidateQueries({
        queryKey: petKeys.byOrganizationLists(),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.detail(variables.petId),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.ownerships(variables.petId),
      });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: string) => petService.deletePet(petId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.availableLists() });
      queryClient.invalidateQueries({ queryKey: petKeys.byUserLists() });
      queryClient.invalidateQueries({
        queryKey: petKeys.byOrganizationLists(),
      });
    },
  });
}

export function useCreatePetMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      payload,
    }: {
      petId: string;
      payload: PetMedicalRecordCreatePayload;
    }) => petDetailsService.createMedicalRecord(petId, payload),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: petKeys.medicalRecords(variables.petId),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.detail(variables.petId),
      });
    },
  });
}

export function useCreatePetMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      payload,
      primary = false,
    }: {
      petId: string;
      payload: PetMediaCreatePayload;
      primary?: boolean;
    }) => petDetailsService.createMedia(petId, payload, primary),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: petKeys.media(variables.petId),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.detail(variables.petId),
      });
    },
  });
}

export function useUpdatePetMediaPrimary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, mediaId }: { petId: string; mediaId: string }) =>
      petDetailsService.updateMediaPrimary(petId, mediaId),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: petKeys.media(variables.petId),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.detail(variables.petId),
      });
    },
  });
}

export function useDeletePetMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, mediaId }: { petId: string; mediaId: string }) =>
      petDetailsService.deleteMedia(petId, mediaId),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: petKeys.media(variables.petId),
      });
      queryClient.invalidateQueries({
        queryKey: petKeys.detail(variables.petId),
      });
    },
  });
}
