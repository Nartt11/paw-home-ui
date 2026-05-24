import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileUpdatePayload, UserListParams } from "@/types/user.type";
import userService from "@/services/user";

export const userKeys = {
  all: ["users"] as const,

  lists: () => [...userKeys.all, "list"] as const,

  list: (params: UserListParams) => [...userKeys.lists(), params] as const,

  details: () => [...userKeys.all, "detail"] as const,

  detail: (id: string) => [...userKeys.details(), id] as const,

  me: () => [...userKeys.all, "me"] as const,

  reputations: () => [...userKeys.all, "reputation"] as const,

  reputation: (id: string) => [...userKeys.reputations(), id] as const,
};

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAllUsers(params),
  });
}

export function useUserDetail(id?: string) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => userService.getUserById(id as string),
    enabled: !!id,
  });
}

export function useUserReputation(id?: string) {
  return useQuery({
    queryKey: userKeys.reputation(id ?? ""),
    queryFn: () => userService.getUserReputation(id as string),
    enabled: !!id,
  });
}

export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userService.getMe(),
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) =>
      userService.updateMyProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me(),
      });

      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
