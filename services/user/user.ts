import http from "@/lib/http";
import type { User, UserSummary } from "@/types/user.type";
import type { UserReputation } from "@/types/reputation.type";

import type { UserDto, UserSummaryDto } from "./user-dto";
import type { PageDto } from "../api-dto";

import { mapUser, mapUserSummary } from "@/mappers/user";
import { mapPage } from "../organization/organization-dto";
import type { PaginatedResponse } from "@/types/api.type";

export interface UserListConfig {
  page?: number;
  size?: number;
}

export type UpdateMyProfilePayload = {
  userName?: string;
  avatarUrl?: string;
};

const userService = {
  // GET /api/v1/users - List all users
  async getAllUsers(
    params: UserListConfig,
  ): Promise<PaginatedResponse<UserSummary>> {
    const dto = await http.get<PageDto<UserSummaryDto>>("/users", {
      params,
    });

    return mapPage(dto, mapUserSummary) as PaginatedResponse<UserSummary>;
  },

  // GET /api/v1/users/{id} - Get user by ID
  async getUserById(id: string): Promise<User> {
    const dto = await http.get<UserDto>(`/users/${id}`);
    return mapUser(dto);
  },

  // GET /api/v1/users/{id}/reputation - Get user reputation
  // async getUserReputation(id: string): Promise<UserReputation> {
  //   return http.get<UserReputation>(`/users/${id}/reputation`);
  // },

  // GET /api/v1/users/me - Get current user info
  async getCurrentUser(): Promise<User> {
    const dto = await http.get<UserDto>("/users/me");
    return mapUser(dto);
  },

  // PATCH /api/v1/users/me/profile - Update current user profile
  async updateMyProfile(payload: UpdateMyProfilePayload): Promise<User> {
    const dto = await http.patch<UserDto, UpdateMyProfilePayload>(
      "/users/me/profile",
      payload,
    );

    return mapUser(dto);
  },
};

export default userService;
