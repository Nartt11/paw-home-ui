import { UserDto, UserSummaryDto } from "@/services/user/user-dto";
import { User, UserSummary } from "@/types/user.type";

export function mapUserSummary(dto: UserSummaryDto): UserSummary {
  return {
    userId: dto.userId,
    username: dto.username,
    email: dto.email,
    status: dto.status,
  };
}

export function mapUser(dto: UserDto): User {
  return {
    userId: dto.userId,
    username: dto.username,
    email: dto.email,
    status: dto.status,
    emailVerified: dto.emailVerified,
    roles: dto.roles,
    organizationId: dto.organizationId,
    organizationName: dto.organizationName,
    organizationRole: dto.organizationRole,
    fullName: dto.fullName,
    phone: dto.phone,
    gender: dto.gender,
    streetAddress: dto.streetAddress,
    wardName: dto.wardName,
    provinceName: dto.provinceName,
  };
}
