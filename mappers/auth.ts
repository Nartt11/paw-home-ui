import { AuthResponseDto } from "@/services/auth";
import { Auth } from "@/types/auth.type";

export function mapAuth(dto: AuthResponseDto): Auth {
  return {
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    tokenType: dto.tokenType,
    expiresIn: dto.expiresIn,
    user: {
      userId: dto.user.userId,
      username: dto.user.username,
      email: dto.user.email,
      status: dto.user.status,
      emailVerified: dto.user.emailVerified,
      roles: dto.user.roles,
      createdAt: dto.user.createdAt,
      updatedAt: dto.user.updatedAt,
    },
  };
}
