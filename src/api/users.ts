import api from "./axios";

export const getProfile = () => {
  return api.get("/users/profile");
};

export const fetchUsersApi = () => {
  return api.get("/users");
};

export const deleteUserApi = (id: number) => {
  return api.delete(`/users/${id}`);
};
