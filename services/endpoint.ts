import { create } from "domain";

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
  },
  organizations: {
    root: "/organizations",
    byId: (id: string) => byId("/organizations", id),
    me: "/organizations/me",
    status: (id: string) => `/organizations/${id}/status`,
    members: (id: string) => `/organizations/${id}/members`,
    memberByUser: (id: string, userId: string) =>
      `/organizations/${id}/members/${userId}`,
    pending: "/organizations/pending",
    inactive: "/organizations/inactive",
    active: "/organizations/active",
    map: {
      boundingBox: "/organizations/map/bounding-box",
      markers: "/organizations/map/markers",
    },
  },
  pets: {
    root: "/pets",
    createByShelter: "/pets/shelter",
    byId: (id: string) => byId("/pets", id),
    available: "/pets/available",
    byOrganization: (organizationId: string) =>
      `/pets/by-organization/${organizationId}`,
    byUser: (userId: string) => `/pets/by-user/${userId}`,
    shelter: "/pets/shelter",
    status: (id: string) => `/pets/${id}/status`,
    transferOwnership: (id: string) => `/pets/${id}/transfer-ownership`,
    medicalRecords: (petId: string) => `/pets/${petId}/medical-records`,
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
    nearby: "/rescue-cases/nearby",
    status: (id: string) => `/rescue-cases/${id}/status`,
    complete: (id: string) => `/rescue-cases/${id}/complete`,
    map: {
      markers: "/rescue-cases/map/markers",
      boundingBox: "/rescue-cases/map/bounding-box",
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
    approve: (id: string) => `/adoptions/${id}/approve`,
    reject: (id: string) => `/adoptions/${id}/reject`,
    cancel: (id: string) => `/adoptions/${id}/cancel`,
    complete: (id: string) => `/adoptions/${id}/complete`,
  },
  posts: {
    root: "/posts",
    byId: (id: string) => byId("/posts", id),
    feed: "/posts/feed",
    comments: (postId: string) => `/posts/${postId}/comments`,
    like: (postId: string) => `/posts/${postId}/like`,
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
    permissions: (id: string | number) => `/roles/${id}/permissions`,
  },
  media: {
    byId: (id: string) => `/media/${id}`,
    uploadTemp: "/media/upload/temp",
    confirm: (id: string) => `/media/${id}/confirm`,
  },
  geo: {
    nearby: "/geo/nearby",
    me: {
      location: "/geo/me/location",
    },
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
      userPets: (organizationId: string, userId: string) =>
        `/admin/organizations/${organizationId}/users/${userId}/pets`,
    },
  },
} as const;

export default apiEndpoints;
