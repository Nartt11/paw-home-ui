import http from "@/lib/http";

export const login = (data: { emailOrUsername: string; password: string }) =>
  http.post("/auth/login", data);
