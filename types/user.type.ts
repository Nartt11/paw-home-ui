export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "DISABLED";
export interface UserSummary {
  userId: string;
  username: string;
  email: string;
  status: UserStatus;
}

export interface User extends UserSummary {
  emailVerified: boolean;
  roles: string[];
  organizationId: string;
  organizationName: string;
  organizationRole: string;
  fullName: string;
  phone: string;
  gender: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;

}
