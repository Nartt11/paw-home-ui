import { baseEntity } from "./core.type";

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  status: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Auth {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}
export interface EmailVerificationToken extends baseEntity {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
}

export interface PasswordResetToken extends baseEntity {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
}

export interface RefreshToken extends baseEntity {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  revoked: boolean;
}
