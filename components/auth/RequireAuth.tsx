"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { tokenStorage } from "@/lib/http";
import { useCurrentUser } from "@/hooks/use-current-user";
import LoadingScreen from "@/app/loading";


export default function RequireAuth({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const router = useRouter();
  const hasToken = Boolean(tokenStorage.getAccessToken());
  const currentUserQuery = useCurrentUser();
  const effectiveRoles = React.useMemo(() => {
    const roles = currentUserQuery.data?.roles ?? [];
    const organizationRole = currentUserQuery.data?.organizationRole;

    return new Set(
      [...roles, organizationRole]
        .filter((role): role is string => Boolean(role))
        .map((role) => role.toUpperCase()),
    );
  }, [currentUserQuery.data?.organizationRole, currentUserQuery.data?.roles]);

  const hasRequiredRole =
    !allowedRoles?.length ||
    allowedRoles.some((role) => effectiveRoles.has(role.toUpperCase()));

  React.useEffect(() => {
    if (!hasToken) {
      router.replace(APP_ROUTES.LOGIN);
      return;
    }

    if (currentUserQuery.isError) {
      tokenStorage.clear();
      router.replace(APP_ROUTES.LOGIN);
      return;
    }

    if (currentUserQuery.isSuccess && !hasRequiredRole) {
      router.replace(APP_ROUTES.HOME);
    }
  }, [
    currentUserQuery.isError,
    currentUserQuery.isSuccess,
    hasRequiredRole,
    hasToken,
    router,
  ]);

  if (!hasToken || currentUserQuery.isPending) {
    return <LoadingScreen/>;
  }

  if (currentUserQuery.isError) {
    return null;
  }

  if (!hasRequiredRole) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Bạn không có quyền truy cập khu vực này.
      </div>
    );
  }

  return <>{children}</>;
}
