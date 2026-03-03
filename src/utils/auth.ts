import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    return jwtDecode<any>(token);
  } catch {
    return null;
  }
}
