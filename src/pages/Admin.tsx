import { useEffect, useState, useMemo } from "react";
import { fetchDataApi, createDataApi } from "../api/data";
import { fetchUsersApi, deleteUserApi } from "../api/users";
import type { DataItem } from "../api/data";
import { getUserFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"admin" | "user" | "both">(
    "both",
  );
  const [users, setUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useMemo(() => getUserFromToken(), []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/profile");
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allData = await fetchDataApi();
      const allUsers = await fetchUsersApi();
      // Admin sees everything
      setItems(allData);
      setUsers(allUsers.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) {
      return;
    }

    try {
      await deleteUserApi(id);
      alert("User deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    setIsSubmitting(true);
    try {
      await createDataApi(
        { name, content, visibility },
        user.name || user.email,
      );
      setName("");
      setContent("");
      setVisibility("both");
      await loadData();
    } catch (error) {
      alert("Failed to create data item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && items.length === 0) return <div>Loading Admin Panel...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/profile")}
        style={{ marginBottom: "20px" }}
      >
        Back to Profile
      </button>

      <h1>Admin Dashboard</h1>
      <p>
        Manage all system data. Logged in as:{" "}
        <strong>{user?.name || user?.email}</strong>
      </p>

      <section
        style={{
          marginBottom: "40px",
          padding: "20px",
          border: "2px solid #b30000",
          borderRadius: "8px",
          background: "rgba(179, 0, 0, 0.05)",
        }}
      >
        <h2>System-Wide: Add New Data</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "8px" }}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ padding: "8px", minHeight: "100px" }}
          />
          <div>
            <label style={{ marginRight: "10px" }}>Visibility Level:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              style={{ padding: "8px" }}
            >
              <option value="both">Both (Public)</option>
              <option value="user">User Only</option>
              <option value="admin">Admin Only (Private)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ background: "#b30000", color: "white" }}
          >
            {isSubmitting ? "Adding..." : "Add System Item"}
          </button>
        </form>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>User Management</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "10px",
              background: "#1a1a1a",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  borderBottom: "1px solid #333",
                }}
              >
                <div>
                  <strong>{u.name || "No Name"}</strong> ({u.email}) -{" "}
                  <span style={{ color: "#888" }}>{u.role}</span>
                </div>
                {u.id !== user.sub && (
                  <button
                    onClick={() => handleDeleteUser(u.id, u.email)}
                    style={{
                      background: "#ff4d4d",
                      color: "white",
                      padding: "5px 10px",
                      fontSize: "0.8em",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>All System Data Items</h2>
        {items.length === 0 ? (
          <p>No data available in the system.</p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "15px",
                  border: "1px solid #666",
                  borderRadius: "8px",
                  background:
                    item.visibility === "admin"
                      ? "rgba(255, 0, 0, 0.1)"
                      : "transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <span
                    style={{
                      fontSize: "0.8em",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "#333",
                      color:
                        item.visibility === "admin"
                          ? "#ff4d4d"
                          : item.visibility === "user"
                            ? "#4dff88"
                            : "#8888ff",
                    }}
                  >
                    {item.visibility.toUpperCase()}
                  </span>
                </div>
                <p>{item.content}</p>
                <div
                  style={{
                    fontSize: "0.8em",
                    color: "#888",
                    marginTop: "10px",
                  }}
                >
                  By {item.createdBy} on{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
