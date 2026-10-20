import axios, { type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "../type/api";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const API_BASE_URL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let csrfTokenRequest: Promise<string> | null = null;
let refreshRequest: Promise<void> | null = null;

async function getCsrfToken(): Promise<string> {
  if (!csrfTokenRequest) {
    csrfTokenRequest = api
      .get<ApiResponse<{ csrfToken: string }>>("/auth/csrf")
      .then(({ data }) => data.data.csrfToken)
      .finally(() => {
        csrfTokenRequest = null;
      });
  }

  return csrfTokenRequest;
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const safeMethods = ["get", "head", "options"];
  const method = config.method?.toLowerCase() ?? "get";

  if (!safeMethods.includes(method)) {
    const csrfToken = await getCsrfToken();
    config.headers.set("x-csrf-token", csrfToken);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const originalRequest = error.config;
    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";
    const shouldSkipRefresh = [
      "/auth/login",
      "/auth/refresh",
      "/auth/csrf",
    ].some((path) => requestUrl.endsWith(path));
    if (shouldSkipRefresh) return Promise.reject(error);

    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshRequest = null;
          });
      }

      await refreshRequest;
      return api(originalRequest);
    } catch (refreshError) {
      csrfTokenRequest = null;
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.assign("/login");
      }
      return Promise.reject(refreshError);
    }
  },
);
