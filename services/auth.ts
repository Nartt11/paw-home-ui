import http from "@/lib/http";

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

export const authService = {
  // POST /api/v1/auth/login - Login with email & password
  login(data: LoginPayload) {
    return http.post("/auth/login", data);
  },

  // POST /api/v1/auth/logout - Logout — revoke all refresh tokens
  logout() {
    return http.post("/auth/logout", {});
  },

  // POST /api/v1/auth/refresh - Refresh access token (silent refresh)
  refresh() {
    return http.post("/auth/refresh", {});
  },

  // POST /api/v1/auth/register - Register a new account
  register(data: RegisterPayload) {
    return http.post("/auth/register", data);
  },

  // POST /api/v1/auth/forgot-password - Request password reset
  forgotPassword(data: ForgotPasswordPayload) {
    return http.post("/auth/forgot-password", data);
  },

  // POST /api/v1/auth/reset-password - Reset password using token
  resetPassword(data: ResetPasswordPayload) {
    return http.post("/auth/reset-password", data);
  },

  // POST /api/v1/auth/resend-verification - Resend verification email
  resendVerification(data: ResendVerificationPayload) {
    return http.post("/auth/resend-verification", data);
  },

  // GET /api/v1/auth/verify-email - Verify email via token (query param)
  verifyEmail(params: VerifyEmailParams) {
    return http.get("/auth/verify-email", { params });
  },
};

// Backward compatibility default export (optional)
export default authService;
