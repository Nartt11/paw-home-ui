// src/lib/http.ts
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp?: string;
  correlationId?: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  status?: number;
  message?: string;
  /** Machine-readable code of a business error, e.g. POST_RESCUE_CASE_CLOSED. */
  errorCode?: string;
  errors?: Record<string, string[]>;
}

export class HttpError extends Error {
  status?: number;
  errorCode?: string;
  errors?: Record<string, string[]>;

  constructor(payload: ApiErrorResponse) {
    super(payload.message || "Something went wrong");
    this.name = "HttpError";
    this.status = payload.status;
    this.errorCode = payload.errorCode;
    this.errors = payload.errors;
  }
}

/**
 * ===============================
 * ENV
 * ===============================
 * Next.js => NEXT_PUBLIC_API_URL
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing in .env");
}

/**
 * ===============================
 * TOKEN STORAGE
 * ===============================
 */
const tokenStorage = {
  getAccessToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
  },

  getRefreshToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },

  setRefreshToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("refreshToken", token);
  },

  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      // Spring binds repeated keys (status=A&status=B), not axios' default status[]=A.
      paramsSerializer: { indexes: null },
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  private setupResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,

      async (error: AxiosError<ApiErrorResponse>) => {
        const original = error.config as
          | (InternalAxiosRequestConfig & { _retried?: boolean })
          | undefined;

        // Silent refresh: retry the request once with a new access token.
        if (
          error.response?.status === 401 &&
          original &&
          !original._retried &&
          !original.url?.startsWith("/auth/")
        ) {
          original._retried = true;
          const token = await this.refreshAccessToken();
          if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            return this.instance(original);
          }
        }

        const data = error.response?.data;

        const customError = new HttpError({
          status: error.response?.status,
          message: data?.message || error.message,
          errorCode: data?.errorCode,
          errors: data?.errors,
        });

        if (error.response?.status === 401) {
          tokenStorage.clear();
        }

        return Promise.reject(customError);
      },
    );
  }

  // Shared so parallel 401s trigger one refresh call (BE rotates refresh tokens).
  private refreshing: Promise<string | null> | null = null;

  private refreshAccessToken(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return Promise.resolve(null);

    this.refreshing ??= axios
      .post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
        `${BASE_URL}/auth/refresh`,
        { refreshToken },
      )
      .then((res) => {
        const { accessToken, refreshToken: next } = res.data.data;
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(next);
        return accessToken;
      })
      .catch(() => null)
      .finally(() => {
        this.refreshing = null;
      });

    return this.refreshing;
  }

  async get<T>(url: string, params?: object): Promise<T> {
    const res = await this.instance.get<ApiResponse<T>>(url, params);
    return res.data.data;
  }

  async post<T, Body = unknown>(
    url: string,
    body?: Body,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.instance.post<ApiResponse<T>>(url, body, config);

    return res.data.data;
  }

  async put<T, Body = unknown>(url: string, body?: Body): Promise<T> {
    const res = await this.instance.put<ApiResponse<T>>(url, body);
    return res.data.data;
  }

  async patch<T, Body = unknown>(url: string, body?: Body): Promise<T> {
    const res = await this.instance.patch<ApiResponse<T>>(url, body);
    return res.data.data;
  }

  async delete<T>(url: string): Promise<T> {
    const res = await this.instance.delete<ApiResponse<T>>(url);
    return res.data.data;
  }
}

const http = new Http();

export default http;
export { tokenStorage };
