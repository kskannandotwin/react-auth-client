import api from "./axios";

export const registerApi = (data: {
  email: string;
  password: string;
  name?: string;
}) => {
  return api.post("/users", data);
};

export const loginApi = (data: { email: string; password: string }) => {
  return api.post("/auth/login", data);
};

export const refreshTokenApi = (refresh_token: string) => {
  return api.post("/auth/refresh", { refresh_token });
};
