export const queryKeys = {
  auth: {
    currentUser: ["auth", "current-user"] as const,
    verifyEmail: (token: string) => ["auth", "verify-email", token] as const,
  },
  banners: {
    active: ["banners", "active"] as const,
  },
};
