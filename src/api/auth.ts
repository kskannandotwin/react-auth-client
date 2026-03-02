import api from "./axios";

export const loginApi = (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};

export const refreshTokenApi = (refreshToken: string) => {
  return api.post("/auth/refresh", { refreshToken });
};
