import http from "@/lib/http";
import type {
  User,
  UserSummary,
  UserListParams,
  ProfileUpdatePayload,
} from "@/types/user.type";
import type { UserReputation } from "@/types/reputation.type";
import apiEndpoints from "../endpoint";
import type { PaginatedResponse } from "@/types/api.type";

const userService = {
  // GET /api/v1/users - List all users
  async getAllUsers(
    params: UserListParams,
  ): Promise<PaginatedResponse<UserSummary>> {
    return await http.get<PaginatedResponse<UserSummary>>(
      apiEndpoints.users.root,
      {
        params,
      },
    );
  },

  // GET /api/v1/users/{id} - Get user by ID
  async getUserById(id: string): Promise<User> {
    return await http.get<User>(apiEndpoints.users.byId(id));
  },

  // GET /api/v1/users/{id}/reputation - Get user reputation
  async getUserReputation(id: string): Promise<UserReputation> {
    return http.get<UserReputation>(apiEndpoints.users.reputation(id));
  },

  // GET /api/v1/users/me - Get current user info
  async getMe(): Promise<User> {
    return await http.get<User>(apiEndpoints.users.me);
  },

  // PATCH /api/v1/users/me/profile - Update current user profile
  async updateMyProfile(payload: ProfileUpdatePayload): Promise<User> {
    return await http.patch<User, ProfileUpdatePayload>(
      apiEndpoints.users.profile,
      payload,
    );
  },
};

export default userService;
