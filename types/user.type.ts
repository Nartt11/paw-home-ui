export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "DISABLED";
export interface UserSummary {
  userId: string;
  userCode: string;
  username: string;
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

export interface ProfileUpdatePayload {
  username: string;
  avatarUrl: string;
}
