import { baseEntity } from "./core.type";

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
