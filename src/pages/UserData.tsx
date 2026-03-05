import { useEffect, useState, useMemo } from "react";
import { fetchDataApi, createDataApi } from "../api/data";
import type { DataItem } from "../api/data";
import { getUserFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function UserData() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"user" | "both">("both");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useMemo(() => getUserFromToken(), []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/profile");
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allData = await fetchDataApi();
      const filtered = allData.filter(
        (item) => item.visibility === "user" || item.visibility === "both",
      );
      setItems(filtered);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    setIsSubmitting(true);
    try {
      await createDataApi(
        { name, content, visibility: visibility as any },
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

  if (loading && items.length === 0) return <div>Loading your data...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/profile")}
        style={{ marginBottom: "20px" }}
      >
        Back to Profile
      </button>

      <h1>My Data</h1>
      <p>
        Logged in as: <strong>{user?.name || user?.email}</strong>
      </p>

      <section
        style={{
          marginBottom: "40px",
          padding: "20px",
          border: "1px solid #444",
          borderRadius: "8px",
        }}
      >
        <h2>Add New Item</h2>
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
            <label style={{ marginRight: "10px" }}>Visibility:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              style={{ padding: "8px" }}
            >
              <option value="both">Public (Both)</option>
              <option value="user">Private (User Only)</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Item"}
          </button>
        </form>
      </section>

      <section>
        <h2>My Items</h2>
        {items.length === 0 ? (
          <p>No data available yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "15px",
                  border: "1px solid #666",
                  borderRadius: "8px",
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
                      background: "#444",
                      color: "#4dff88",
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
                  Created on {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
