import http from "@/lib/http";
import { BaseResponse, PaginatedResponse } from "@/types/api.type";
import { User } from "@/types/user.type";
import { UserReputation } from "@/types/reputation.type";

export interface UserListConfig {
  page?: number;
  size?: number;
}

export type UpdateMyProfilePayload = Partial<
  Pick<
    User,
    | "full_name"
    | "avatar_url"
    | "phone"
    | "gender"
    | "street_address"
    | "ward_code"
    | "province_code"
  >
>;

const userService = {
  // GET /api/v1/users - List all users
  getAllUsers(params: UserListConfig) {
    return http.get<BaseResponse<PaginatedResponse<User>>>("/users", {
      params,
    });
  },

  // GET /api/v1/users/{id} - Get user by ID
  getUserById(id: string) {
    return http.get<BaseResponse<User>>(`/users/${id}`);
  },

  // GET /api/v1/users/{id}/reputation - Get user reputation
  getUserReputation(id: string) {
    return http.get<BaseResponse<UserReputation>>(`/users/${id}/reputation`);
  },

  // GET /api/v1/users/me - Get current user info
  getCurrentUser() {
    return http.get<BaseResponse<User>>("/users/me");
  },

  // PATCH /api/v1/users/me/profile - Update current user profile
  updateMyProfile(payload: UpdateMyProfilePayload) {
    return http.patch<BaseResponse<User>>("/users/me/profile", payload);
  },
};

export default userService;
