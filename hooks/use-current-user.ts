"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { tokenStorage } from "@/lib/http";
import userService from "@/services/user/user";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: () => userService.getCurrentUser(),
    enabled: !!tokenStorage.getAccessToken(),
    staleTime: 5 * 60 * 1000,
  });
}
