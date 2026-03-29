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
      alert("Could not send request. Maybe already sent.");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h3
        style={{ margin: 0, cursor: "pointer", color: "#6fa3ff" }}
        onClick={() => navigate(`/profile/${user.id}`)}
      >
        @{user.username}
      </h3>

      <button
        onClick={sendRequest}
        disabled={sent}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: sent ? "1px solid #555" : "1px solid #6fa3ff",
          background: "transparent",
          color: sent ? "#555" : "#6fa3ff",
          cursor: sent ? "default" : "pointer",
        }}
      >
        {sent ? "Request Sent ✓" : "Connect"}
      </button>

    </div>
  );
}

export default UserCard;