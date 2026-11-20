import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "@/hooks/use-user";
import { organizationKeys } from "@/hooks/use-organization";
import adminService, {
  adminDashboardService,
  type AdminOrganizationAccountPayload,
} from "@/services/admin/admin";
import type { DashboardPeriodParams } from "@/types/dashboard.type";
import type { CreateAccountPayload } from "@/types/user.type";

const TOP_ORGANIZATIONS_LIMIT = 5;

export const adminDashboardKeys = {
  all: ["admin-dashboard"] as const,

  overview: (params: DashboardPeriodParams) =>
    [...adminDashboardKeys.all, "overview", params] as const,

  adoptionTrend: (year: number) =>
    [...adminDashboardKeys.all, "adoption-trend", year] as const,

  rescueSummary: (params: DashboardPeriodParams) =>
    [...adminDashboardKeys.all, "rescue-summary", params] as const,

  topOrganizations: (params: DashboardPeriodParams) =>
    [...adminDashboardKeys.all, "top-organizations", params] as const,

  pendingTasks: (params: DashboardPeriodParams) =>
    [...adminDashboardKeys.all, "pending-tasks", params] as const,
};

export function useDashboardOverview(
  params: DashboardPeriodParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: adminDashboardKeys.overview(params),
    queryFn: () => adminDashboardService.getOverview(params),
    enabled,
  });
}

export function useDashboardAdoptionTrend(year: number, enabled: boolean) {
  return useQuery({
    queryKey: adminDashboardKeys.adoptionTrend(year),
    queryFn: () => adminDashboardService.getAdoptionTrend(year),
    enabled,
  });
}

export function useDashboardRescueSummary(
  params: DashboardPeriodParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: adminDashboardKeys.rescueSummary(params),
    queryFn: () => adminDashboardService.getRescueSummary(params),
    enabled,
  });
}

export function useDashboardTopOrganizations(
  params: DashboardPeriodParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: adminDashboardKeys.topOrganizations(params),
    queryFn: () =>
      adminDashboardService.getTopOrganizations({
        ...params,
        limit: TOP_ORGANIZATIONS_LIMIT,
      }),
    enabled,
  });
}

export function useDashboardPendingTasks(
  params: DashboardPeriodParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: adminDashboardKeys.pendingTasks(params),
    queryFn: () => adminDashboardService.getPendingTasks(params),
    enabled,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountPayload) =>
      adminService.createAccount(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useCreateOrganizationAccount(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminOrganizationAccountPayload) =>
      adminService.createOrganizationAccount(organizationId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.members() });
    },
  });
}

export function useSetUserLocked() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, locked }: { userId: string; locked: boolean }) =>
      locked ? adminService.lockUser(userId) : adminService.unlockUser(userId),

    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
}
