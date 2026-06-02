export const SYSTEM_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  MEMBERSHIP: "MEMBERSHIP",
  STAFF: "STAFF",
  OWNER: "OWNER",
  VET: "VET",
} as const;

export const ORGANIZATION_ROLES = {
  OWNER: "OWNER",
  STAFF: "STAFF",
  MEMBER: "MEMBER",
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[keyof typeof ORGANIZATION_ROLES];
