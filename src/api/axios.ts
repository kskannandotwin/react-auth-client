import axios from "axios";
import { refreshTokenApi } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  // Don't add token to specific auth requests (login, registration)
  const isPublicAuthRequest =
    (config.url === "/auth/login" || config.url === "/users") &&
    config.method === "post";

  if (isPublicAuthRequest) {
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop: if the request to refresh fails, or if it's already a retry
    // Also don't try to refresh if the failed request was a login request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const res = await refreshTokenApi(refreshToken);
        localStorage.setItem("access_token", res.data.access_token);
        api.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
