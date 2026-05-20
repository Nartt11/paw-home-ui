"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { tokenStorage } from "@/lib/http";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getPostAuthRedirectPath } from "@/hooks/use-auth";

export default function RequireGuest({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasToken = Boolean(tokenStorage.getAccessToken());
  const currentUserQuery = useCurrentUser();
  const redirectPath = React.useMemo(() => {
    if (!currentUserQuery.data) return null;
    return getPostAuthRedirectPath(currentUserQuery.data);
  }, [currentUserQuery.data]);

  React.useEffect(() => {
    if (currentUserQuery.isSuccess && redirectPath) {
      router.replace(redirectPath);
      return;
    }

    if (currentUserQuery.isError) {
      tokenStorage.clear();
    }
  }, [currentUserQuery.isError, currentUserQuery.isSuccess, redirectPath, router]);

  if (hasToken && currentUserQuery.isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Dang kiem tra phien dang nhap...
      </div>
    );
  }

  if (currentUserQuery.isSuccess) {
    return null;
  }

  return <>{children}</>;
}
