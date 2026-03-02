import axios from "axios";
import { refreshTokenApi } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
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

    if (error.res?.status === 401 && !originalRequest._retry) {
      originalRequest.retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      const res = await refreshTokenApi(refreshToken!);

      localStorage.setItem("access_token", res.data.access_token);

      originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default api;
