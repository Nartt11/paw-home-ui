"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { APP_ROUTES } from "@/constants/routes";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * For actions a guest can see but not do (like, comment, post). Returns a function that says
 * whether the visitor is signed in, and sends them to sign in when they are not.
 */
export function useRequireLogin() {
  const router = useRouter();
  const currentUserQuery = useCurrentUser();
  const signedIn = !!currentUserQuery.data;

  const requireLogin = useCallback(
    (reason: string) => {
      if (signedIn) return true;
      toast.info(reason);
      router.push(APP_ROUTES.LOGIN);
      return false;
    },
    [router, signedIn],
  );

  return { signedIn, currentUser: currentUserQuery.data, requireLogin };
}
