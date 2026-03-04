import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Only admin can see this page.</p>
      <button onClick={() => navigate("/profile")}>Go to Profile</button>
    </div>
  );
}
