import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import roleService from "@/services/role";
import type { RoleCreatePayload, RoleListParams } from "@/types/role.type";

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (params: RoleListParams) => [...roleKeys.lists(), params] as const,
};

export function useRoles(params: RoleListParams) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleService.getAllRoles(params),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoleCreatePayload) => roleService.createRole(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roleKeys.lists() }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roleKeys.lists() }),
  });
}
