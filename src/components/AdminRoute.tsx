import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <h2>403 - You are not an admin</h2>;
  }
  return <>{children}</>;
}
