import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  let username = "there";
  try {
    const token = localStorage.getItem("access_token");
    if (token) username = jwtDecode(token).username || "there";
  } catch (e) { }

  useEffect(() => {
    api.get("dashboard/")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "13px", color: "var(--blue)", marginBottom: "8px", fontWeight: 500 }}>
          WELCOME BACK
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
          EventLoop Dashboard
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          Stay connected with your campus community
        </p>
      </div>

      {!data && (
        <div style={{ color: "var(--dim)", fontSize: "14px" }}>Loading...</div>
      )}

      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Upcoming Events */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "28px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Upcoming Events</h2>
              <button
                onClick={() => navigate("/events")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--blue)",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                View all →
              </button>
            </div>

            {data.upcoming_events.length === 0 && (
              <p style={{ color: "var(--dim)", fontSize: "14px" }}>No upcoming events</p>
            )}

            {data.upcoming_events.map(event => (
              <div
                key={event.id}
                style={{
                  padding: "14px 16px",
                  background: "var(--surface2)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  borderLeft: "3px solid var(--blue)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{event.title}</div>
              </div>
            ))}
          </div>

          {/* Connections Activity */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "28px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Connections Activity</h2>
              <button
                onClick={() => navigate("/network")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--blue)",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                View all →
              </button>
            </div>

            {data.connections_activity.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>👥</div>
                <p style={{ color: "var(--dim)", fontSize: "14px" }}>No activity yet</p>
                <button
                  onClick={() => navigate("/discover")}
                  style={{
                    marginTop: "12px",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    border: "1px solid var(--blue)",
                    background: "rgba(59,130,246,0.1)",
                    color: "var(--blue)",
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Discover People
                </button>
              </div>
            ) : (
              data.connections_activity.map((item, i) => (
                <div key={i} style={{
                  padding: "14px 16px",
                  background: "var(--surface2)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "var(--muted)",
                }}>
                  @{item.sender?.username || item.receiver?.username || "Unknown"} connected
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;