import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInbox } from "../api/messaging";

function Messages() {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getInbox().then(res => setInbox(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const diff = Date.now() - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 32px" }}>
      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontSize: "13px", color: "var(--blue)", marginBottom: "8px", fontWeight: 500 }}>MESSAGES</div>
        <h1 style={{ fontSize: "32px", fontWeight: 800 }}>Inbox</h1>
        <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "15px" }}>Your conversations with connections</p>
      </div>

      {loading && <div style={{ color: "var(--dim)", fontSize: "14px" }}>Loading...</div>}

      {!loading && inbox.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>💬</div>
          <p style={{ color: "var(--muted)", marginBottom: "16px" }}>No messages yet</p>
          <button onClick={() => navigate("/network")} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--blue), var(--indigo))", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            Message a Connection
          </button>
        </div>
      )}

      {inbox.map(convo => (
        <div key={convo.user_id} onClick={() => navigate(`/messages/${convo.user_id}`)}
          style={{ background: "var(--surface)", border: `1px solid ${convo.unread_count > 0 ? "var(--blue)" : "var(--border)"}`, borderRadius: "12px", padding: "18px 22px", marginBottom: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "transform 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
        >
          <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--indigo))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "17px", color: "white", flexShrink: 0, fontFamily: "Syne, sans-serif" }}>
            {convo.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: convo.unread_count > 0 ? 700 : 600, fontSize: "15px" }}>@{convo.username}</span>
              <span style={{ fontSize: "12px", color: "var(--dim)" }}>{formatTime(convo.last_message_time)}</span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--dim)", marginTop: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: convo.unread_count > 0 ? 500 : 400 }}>
              {convo.is_mine ? "You: " : ""}{convo.last_message}
            </div>
          </div>
          {convo.unread_count > 0 && (
            <div style={{ background: "var(--blue)", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
              {convo.unread_count}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Messages;