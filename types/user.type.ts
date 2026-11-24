export type UserStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "LOCKED"
  | "INACTIVE"
  | "BANNED";
export interface UserSummary {
  userId: string;
  userCode: string;
  username: string;
  /** Display name. Older backends leave it out. */
  fullName?: string;
  email: string;
  status: UserStatus;
}

export interface User extends UserSummary {
  organizationId: string;
  organizationName: string;
  organizationRole: string;
  fullName: string;
  avatarUrl: string;
  phone: string;
  gender: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  emailVerified: boolean;
  reputation: Reputation;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}
export interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
export interface Reputation {
  userId: string;
  score: number;
  level: string;
  updatedAt: string;
}

export interface CreateAccountPayload {
  username: string;
  email: string;
  password: string;
  systemRole?: string;
  fullName?: string;
  phone?: string;
}

/** PUT /users/me/profile. A field left out stays as it is; "" clears it (except the display name). */
export interface ProfileUpdatePayload {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "UNKNOWN";
  streetAddress?: string;
  wardCode?: string;
  wardName?: string;
  provinceCode?: string;
  provinceName?: string;
}
