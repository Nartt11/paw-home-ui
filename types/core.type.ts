export type Theme = "light" | "dark" | "system";
export type SortOrder = "asc" | "desc";
export type UserRole = "admin" | "user" | "organization";

export interface baseEntity {
  created_at: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
}
