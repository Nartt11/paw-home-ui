"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { tokenStorage } from "@/lib/http";
import { useCurrentUser } from "@/hooks/use-current-user";
import LoadingScreen from "@/app/loading";
import { canAccessByRoles } from "@/lib/permission";


export type RequireAuthProps = {
  children: React.ReactNode;
  /** @deprecated Use allowedSystemRoles instead */
  allowedRoles?: string[];
  allowedSystemRoles?: string[];
  allowedOrganizationRoles?: string[];
  fallback?: React.ReactNode;
};

export default function RequireAuth({
  children,
  allowedRoles,
  allowedSystemRoles,
  allowedOrganizationRoles,
  fallback,
}: RequireAuthProps) {
  const router = useRouter();
  const hasToken = Boolean(tokenStorage.getAccessToken());
  const currentUserQuery = useCurrentUser();

  const systemRoles = currentUserQuery.data?.roles ?? [];
  const organizationRole = currentUserQuery.data?.organizationRole;

  // Backward compatibility mapping
  const effectiveSystemRoles = React.useMemo(() => {
    return allowedSystemRoles ?? allowedRoles ?? [];
  }, [allowedSystemRoles, allowedRoles]);

  const hasRequiredRole = React.useMemo(() => {
    // If no roles specified, default to true or fallback to canAccessByRoles logic
    if (effectiveSystemRoles.length === 0 && (!allowedOrganizationRoles || allowedOrganizationRoles.length === 0)) {
      return true;
    }
    return canAccessByRoles({
      userSystemRoles: systemRoles,
      userOrganizationRole: organizationRole,
      allowedSystemRoles: effectiveSystemRoles,
      allowedOrganizationRoles: allowedOrganizationRoles,
    });
  }, [systemRoles, organizationRole, effectiveSystemRoles, allowedOrganizationRoles]);

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
    return <LoadingScreen />;
  }

  if (currentUserQuery.isError) {
    return null;
  }

  if (!hasRequiredRole) {
    return (
      fallback ?? (
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Bạn không có quyền truy cập khu vực này.
        </div>
      )
    );
  }

  return <>{children}</>;
}
