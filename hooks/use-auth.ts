"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { HttpError, tokenStorage } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import authService, {
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResendVerificationPayload,
  type ResetPasswordPayload,
} from "@/services/auth";
import userService from "@/services/user/user";
import type { Auth } from "@/types/auth.type";
import type { User } from "@/types/user.type";
import { APP_ROUTES } from "@/constants/routes";

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function getPostLoginRedirectPath(auth: Auth) : string {
  
  const normalizedRoles = auth.user.roles.map((role) => role.toUpperCase());
  const hasDashboardAccess = normalizedRoles.some((role) =>
    ["ADMIN", "STAFF", "OWNER", "VET", "SHELTER", "CENTER"].includes(role),
  );  

  return hasDashboardAccess ? APP_ROUTES.DASHBOARD : APP_ROUTES.HOME;
}

export function getPostAuthRedirectPath(user: Pick<User, "roles" | "organizationRole">) {
  const normalizedRoles = [
    ...user.roles,
    user.organizationRole,
  ]
    .filter((role): role is string => Boolean(role))
    .map((role) => role.toUpperCase());

  const hasDashboardAccess = normalizedRoles.some((role) =>
    ["ADMIN", "STAFF", "OWNER", "VET", "SHELTER", "CENTER"].includes(role),
  );

  return hasDashboardAccess ? APP_ROUTES.DASHBOARD : APP_ROUTES.HOME;
}

async function hydrateCurrentUser(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.fetchQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: () => userService.getMe(),
    staleTime: 5 * 60 * 1000,
  });
}

async function establishSession(
  queryClient: ReturnType<typeof useQueryClient>,
  auth: Auth,
) {
  tokenStorage.setAccessToken(auth.accessToken);
  tokenStorage.setRefreshToken(auth.refreshToken);

  try {
    await hydrateCurrentUser(queryClient);
  } catch (error) {
    tokenStorage.clear();
    queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
    throw error;
  }
}

function clearSession(queryClient: ReturnType<typeof useQueryClient>) {
  tokenStorage.clear();
  queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (auth) => {
      await establishSession(queryClient, auth);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearSession(queryClient);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationPayload) =>
      authService.resendVerification(payload),
  });
}

export function useVerifyEmail(token: string | null) {
  return useQuery({
    queryKey: queryKeys.auth.verifyEmail(token ?? ""),
    queryFn: () => authService.verifyEmail({ token: token as string }),
    enabled: Boolean(token),
    staleTime: Infinity,
    retry: false,
  });
}
