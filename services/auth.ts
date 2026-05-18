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
  logout(): Promise<unknown> {
    return http.post<unknown>(apiEndpoints.auth.logout, {});
  },

  // POST /api/v1/auth/refresh - Refresh access token (silent refresh)
  async refresh(): Promise<Auth> {
    const res = await http.post<AuthResponseDto>(apiEndpoints.auth.refresh, {});
    return mapAuth(res);
  },

  // POST /api/v1/auth/register - Register a new account
  register(data: RegisterPayload): Promise<unknown> {
    return http.post<unknown, RegisterPayload>(apiEndpoints.auth.register, data);
  },

  // POST /api/v1/auth/forgot-password - Request password reset
  forgotPassword(data: ForgotPasswordPayload): Promise<unknown> {
    return http.post<unknown, ForgotPasswordPayload>(
      apiEndpoints.auth.forgotPassword,
      data,
    );
  },

  // POST /api/v1/auth/reset-password - Reset password using token
  resetPassword(data: ResetPasswordPayload): Promise<unknown> {
    return http.post<unknown, ResetPasswordPayload>(
      apiEndpoints.auth.resetPassword,
      data,
    );
  },

  // POST /api/v1/auth/resend-verification - Resend verification email
  resendVerification(data: ResendVerificationPayload): Promise<unknown> {
    return http.post<unknown, ResendVerificationPayload>(
      apiEndpoints.auth.resendVerification,
      data,
    );
  },

  // GET /api/v1/auth/verify-email - Verify email via token (query param)
  verifyEmail(params: VerifyEmailParams): Promise<unknown> {
    return http.get<unknown>(apiEndpoints.auth.verifyEmail, { params });
  },
};

// Backward compatibility default export (optional)
export default authService;
