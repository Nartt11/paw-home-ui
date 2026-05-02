import { UserStatus } from "@/types/user.type";

export interface UserSummaryDto {
  userId: string;
  username: string;
  email: string;
  status: UserStatus;
}

export interface UserDto extends UserSummaryDto {
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
