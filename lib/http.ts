// src/lib/http.ts
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
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
  errors?: Record<string, string[]>;
}

export class HttpError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(payload: ApiErrorResponse) {
    super(payload.message || "Something went wrong");
    this.name = "HttpError";
    this.status = payload.status;
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

  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
  },
};

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
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

      (error: AxiosError<ApiErrorResponse>) => {
        const data = error.response?.data;

        const customError = new HttpError({
          status: error.response?.status,
          message: data?.message || error.message,
          errors: data?.errors,
        });

        if (error.response?.status === 401) {
          tokenStorage.clear();
        }

        return Promise.reject(customError);
      },
    );
  }

  async get<T>(url: string, params?: object): Promise<T> {
    const res = await this.instance.get<ApiResponse<T>>(url, { params });
    return res.data.data;
  }

  async post<T, Body = unknown>(url: string, body?: Body): Promise<T> {
    const res = await this.instance.post<ApiResponse<T>>(url, body);
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
