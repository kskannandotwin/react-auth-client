import { useEffect, useState } from "react";
import { getProfile } from "../api/users";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const decodedUser = getUserFromToken();

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);
  return (
    <>
      <LogoutButton />
      <br />
      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/data")}>Manage Data</button>

        {decodedUser?.role === "admin" && (
          <button onClick={() => navigate("/admin")}>Go to admin panel</button>
        )}

        {decodedUser?.role === "user" && (
          <button disabled>Normal user action</button>
        )}
      </div>
    </>
  );
}
