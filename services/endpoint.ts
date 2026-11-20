type Id = string | number;

const byId = (basePath: string, id: Id) => `${basePath}/${id}`;

export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    resendVerification: "/auth/resend-verification",
    verifyEmail: "/auth/verify-email",
  },
  users: {
    root: "/users",
    byId: (id: string) => byId("/users", id),
    me: "/users/me",
    profile: "/users/me/profile",
    reputation: (id: string) => `/users/${id}/reputation`,
    myRescueCases: "/users/me/rescue-cases",
    myRescueClaims: "/users/me/rescue-claims",
    myPets: "/users/me/pets",
  },
  organizations: {
    root: "/organizations",
    byId: (id: string) => byId("/organizations", id),
    me: "/organizations/me",
    myRescueQueue: "/organizations/me/rescue-queue",
    myFollowupAlerts: "/organizations/me/followup-alerts",
    status: (id: string) => `/organizations/${id}/status`,
    members: (id: string) => `/organizations/${id}/members`,
    memberByUser: (id: string, userId: string) =>
      `/organizations/${id}/members/${userId}`,
    map: {
      boundingBox: "/organizations/map/bounding-box",
      markers: "/organizations/map/markers",
    },
  },
  pets: {
    root: "/pets",
    byId: (id: string) => byId("/pets", id),
    taxonomy: "/pets/taxonomy",
    status: (id: string) => `/pets/${id}/status`,
    transferOwnership: (id: string) => `/pets/${id}/transfer-ownership`,
    medicalRecords: (petId: string) => `/pets/${petId}/medical-records`,
    traits: (petId: string) => `/pets/${petId}/traits`,
    ownerships: (petId: string) => `/pets/${petId}/ownerships`,
    media: (petId: string) => `/pets/${petId}/media`,
    deleteMedia: (petId: string, mediaId: string) =>
      `/pets/${petId}/media/${mediaId}`,
    createMedia: (petId: string, primary?: boolean) => `/pets/${petId}/media`,
    createMedicalRecord: (petId: string, primary?: boolean) =>
      `/pets/${petId}/medical-records${primary ? "?primary=true" : ""}`,
    updateMediaPrimary: (petId: string, mediaId: string) =>
      `/pets/${petId}/media/${mediaId}/primary`,
  },
  rescueCases: {
    root: "/rescue-cases",
    byId: (id: string) => byId("/rescue-cases", id),
    status: (id: string) => `/rescue-cases/${id}/status`,
    complete: (id: string) => `/rescue-cases/${id}/complete`,
    completions: "/rescue-cases/completions",
    completionById: (id: string) => byId("/rescue-cases/completions", id),
    approveCompletion: (id: string) => `/rescue-cases/completions/${id}/approve`,
    confirmCompletion: (id: string) => `/rescue-cases/completions/${id}/confirm`,
    disputeCompletion: (id: string) => `/rescue-cases/completions/${id}/dispute`,
    rejectCompletion: (id: string) => `/rescue-cases/completions/${id}/reject`,
    completionReviewQueue: "/rescue-cases/completions/review-queue",
    claim: (id: string) => `/rescue-cases/${id}/claim`,
    extendClaim: (id: string) => `/rescue-cases/${id}/claim/extend`,
    releaseClaim: (id: string) => `/rescue-cases/${id}/claim/release`,
    claims: (id: string) => `/rescue-cases/${id}/claims`,
    updates: (id: string) => `/rescue-cases/${id}/updates`,
    intake: (id: string) => `/rescue-cases/${id}/intake`,
    keepPet: (id: string) => `/rescue-cases/${id}/keep-pet`,
    possibleDuplicates: "/rescue-cases/possible-duplicates",
    firstAid: "/rescue-cases/first-aid",
    map: {
      markers: "/rescue-cases/map/markers",
    },
  },
  banners: {
    root: "/banners",
    byId: (id: string) => byId("/banners", id),
    active: "/banners/active",
    toggleActive: (id: string) => `/banners/${id}/toggle-active`,
    displayOrder: (id: string) => `/banners/${id}/display-order`,
  },
  adoptions: {
    root: "/adoptions",
    byId: (id: string) => byId("/adoptions", id),
    byUser: (userId: string) => `/adoptions/user/${userId}`,
    byOrganization: (orgId: string) => `/adoptions/organization/${orgId}`,
    approve: (id: string) => `/adoptions/${id}/approve`,
    reject: (id: string) => `/adoptions/${id}/reject`,
    cancel: (id: string) => `/adoptions/${id}/cancel`,
    complete: (id: string) => `/adoptions/${id}/complete`,
    supportRequest: (id: string) => `/adoptions/${id}/support-request`,
    returnRequest: (id: string) => `/adoptions/${id}/return-request`,
    outcome: (id: string) => `/adoptions/${id}/outcome`,
    followups: (id: string) => `/adoptions/${id}/followups`,
    reclaims: "/adoptions/reclaims",
  },
  followups: {
    respond: "/followups/respond",
    alertById: (id: string) => `/followup-alerts/${id}`,
  },
  notifications: {
    root: "/notifications",
    unreadCount: "/notifications/unread-count",
    read: (id: string) => `/notifications/${id}/read`,
    readAll: "/notifications/read-all",
  },
  posts: {
    root: "/posts",
    byId: (id: string) => byId("/posts", id),
    feed: "/posts/feed",
    comments: (postId: string) => `/posts/${postId}/comments`,
    like: (postId: string) => `/posts/${postId}/like`,
    analysis: (postId: string) => `/posts/${postId}/analysis`,
  },
  comments: {
    byId: (id: string) => `/comments/${id}`,
    replies: (id: string) => `/comments/${id}/replies`,
    like: (commentId: string) => `/comments/${commentId}/like`,
  },
  tags: {
    root: "/tags",
    byId: (id: string | number) => byId("/tags", id),
  },
  roles: {
    root: "/roles",
    byId: (id: string | number) => byId("/roles", id),
  },
  media: {
    byId: (id: string) => `/media/${id}`,
    uploadTemp: "/media/upload/temp",
    confirm: (id: string) => `/media/${id}/confirm`,
  },
  locations: {
    provinces: "/locations/p",
    provinceByCode: (code: string | number) => `/locations/p/${code}`,
  },
  admin: {
    users: {
      lock: (userId: string) => `/admin/users/${userId}/lock`,
      unlock: (userId: string) => `/admin/users/${userId}/unlock`,
    },
    accounts: "/admin/accounts",
    organizations: {
      accounts: (organizationId: string) =>
        `/admin/organizations/${organizationId}/accounts`,
      members: (organizationId: string) =>
        `/admin/organizations/${organizationId}/members`,
      pets: (organizationId: string) =>
        `/admin/organizations/${organizationId}/pets`,
    },
    ai: {
      metrics: "/admin/ai/post-analysis/metrics",
      model: "/admin/ai/post-analysis/model",
    },
    dashboard: {
      overview: "/admin/dashboard/overview",
      adoptionTrend: "/admin/dashboard/adoption-trend",
      rescueSummary: "/admin/dashboard/rescue-summary",
      topOrganizations: "/admin/dashboard/top-organizations",
      pendingTasks: "/admin/dashboard/pending-tasks",
    },
  },
} as const;

export default apiEndpoints;
