import { AuthResponseDto } from "@/services/auth";
import { Auth } from "@/types/auth.type";

export function mapAuth(dto: AuthResponseDto): Auth {
  return {
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    tokenType: dto.tokenType,
    expiresIn: dto.expiresIn,
  };
}
