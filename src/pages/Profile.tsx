import { useEffect, useState } from "react";
import { getProfile } from "../api/users";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [showToken, setShowToken] = useState(false);
  const navigate = useNavigate();
  const decodedUser = getUserFromToken();

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);

  const accessToken = localStorage.getItem("access_token");

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <LogoutButton />
      <br />
      <h2>User Profile</h2>
      {user ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <p>
            <strong>Name:</strong> {user.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowToken(!showToken)}>
          {showToken ? "Hide Access Token" : "View Current Access Token"}
        </button>
        {showToken && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "#eee",
              wordBreak: "break-all",
              fontSize: "12px",
              borderRadius: "4px",
            }}
          >
            <strong>Token:</strong> {accessToken}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/data")}>Manage Data</button>

        {decodedUser?.role === "admin" && (
          <button onClick={() => navigate("/admin")}>Go to admin panel</button>
        )}

        {decodedUser?.role === "user" && (
          <button disabled>Normal user action</button>
        )}
      </div>
    </div>
  );
}
