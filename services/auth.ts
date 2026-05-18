import http from "@/lib/http";
import { mapAuth } from "@/mappers/auth";
import apiEndpoints from "@/services/endpoint";
import { Auth } from "@/types/auth.type";

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface VerifyEmailParams {
  token: string;
}

// res dto
export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDto;
}

export interface UserDto {
  userId: string;
  username: string;
  email: string;
  status: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  // done
  async login(data: LoginPayload): Promise<Auth> {
    const res = await http.post<AuthResponseDto>(apiEndpoints.auth.login, data);
    return mapAuth(res);
  },

  // POST /api/v1/auth/logout - Logout — revoke all refresh tokens
  logout() {
    return http.post(apiEndpoints.auth.logout, {});
  },

  // POST /api/v1/auth/refresh - Refresh access token (silent refresh)
  refresh() {
    return http.post(apiEndpoints.auth.refresh, {});
  },

  // POST /api/v1/auth/register - Register a new account
  register(data: RegisterPayload) {
    return http.post(apiEndpoints.auth.register, data);
  },

  // POST /api/v1/auth/forgot-password - Request password reset
  forgotPassword(data: ForgotPasswordPayload) {
    return http.post(apiEndpoints.auth.forgotPassword, data);
  },

  // POST /api/v1/auth/reset-password - Reset password using token
  resetPassword(data: ResetPasswordPayload) {
    return http.post(apiEndpoints.auth.resetPassword, data);
  },

  // POST /api/v1/auth/resend-verification - Resend verification email
  resendVerification(data: ResendVerificationPayload) {
    return http.post(apiEndpoints.auth.resendVerification, data);
  },

  // GET /api/v1/auth/verify-email - Verify email via token (query param)
  verifyEmail(params: VerifyEmailParams) {
    return http.get(apiEndpoints.auth.verifyEmail, { params });
  },
};

// Backward compatibility default export (optional)
export default authService;
