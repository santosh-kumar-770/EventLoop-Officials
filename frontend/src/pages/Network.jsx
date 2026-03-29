import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Network() {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("connections/my/")
      .then(res => setConnections(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px" }}>

      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontSize: "13px", color: "var(--blue)", marginBottom: "8px", fontWeight: 500 }}>
          NETWORK
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800 }}>My Connections</h1>
        <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "15px" }}>
          {connections.length} connection{connections.length !== 1 ? "s" : ""}
        </p>
      </div>

      {connections.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 0",
          background: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>👥</div>
          <p style={{ color: "var(--muted)", marginBottom: "16px" }}>No connections yet</p>
          <button
            onClick={() => navigate("/discover")}
            style={{
              padding: "10px 24px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, var(--blue), var(--indigo))",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Discover People
          </button>
        </div>
      )}

      {connections.map(user => (
        <div
          key={user.id}
          onClick={() => navigate(`/profile/${user.id}`)}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            transition: "border-color 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#2a3040";
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--blue), var(--indigo))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "white",
            flexShrink: 0,
          }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>@{user.username}</div>
            <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "2px" }}>View profile →</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Network;