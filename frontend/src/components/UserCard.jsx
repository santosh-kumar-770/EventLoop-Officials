import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendConnectionRequest } from "../api/connections";

function UserCard({ user }) {
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const sendRequest = async () => {
    try {
      await sendConnectionRequest(user.id);
      setSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "20px 24px",
      marginBottom: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#2a3040"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <div>
        <div
          onClick={() => navigate(`/profile/${user.id}`)}
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            color: "var(--blue)",
            cursor: "pointer",
            marginBottom: "4px",
          }}
        >
          @{user.username}
        </div>
        {user.mutual_connections > 0 && (
          <div style={{ fontSize: "12px", color: "var(--dim)" }}>
            {user.mutual_connections} mutual connection{user.mutual_connections !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <button
        onClick={sendRequest}
        disabled={sent}
        style={{
          padding: "8px 20px",
          borderRadius: "8px",
          border: sent ? "1px solid var(--border)" : "1px solid var(--blue)",
          background: sent ? "transparent" : "rgba(59,130,246,0.1)",
          color: sent ? "var(--dim)" : "var(--blue)",
          fontSize: "13px",
          fontWeight: 500,
          cursor: sent ? "default" : "pointer",
          fontFamily: "DM Sans, sans-serif",
          transition: "all 0.15s",
        }}
      >
        {sent ? "Request Sent ✓" : "Connect"}
      </button>
    </div>
  );
}

export default UserCard;