import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor merupakan fungsi yang dijalankan sebelum request dikirim atau setelah response diterima. Dalam kasus ini, kita menggunakan interceptor untuk menambahkan CSRF token ke header setiap kali melakukan request yang bukan GET, HEAD, atau OPTIONS. Selain itu, kita juga menggunakan interceptor untuk menangani error 401 (Unauthorized) dengan mencoba melakukan refresh token secara otomatis. Jika refresh token berhasil, maka request yang gagal akan diulang dengan token yang baru. Jika refresh token gagal, pengguna akan diarahkan ke halaman login.

// Interceptor untuk membaca CSRF Token dari cookie dan memasukkannya ke Header
api.interceptors.request.use(async (config) => {
  const safeMethods = ["get", "head", "options"];
  const method = config.method?.toLowerCase() || "";

  if (!safeMethods.includes(method)) {
    const { data } = await api.get("/auth/csrf");

    const csrfToken = data.data.csrfToken;

    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
  }

  return config;
});

// Interceptor untuk auto-refresh token jika terkena error 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);
