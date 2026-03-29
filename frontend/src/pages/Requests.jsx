import { useEffect, useState } from "react";
import api from "../api/axios";
import { acceptConnection, rejectConnection } from "../api/connections";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("connections/pending/")
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAccept = async (connectionId) => {
    try {
      await acceptConnection(connectionId);
      setRequests(prev => prev.filter(req => req.connection_id !== connectionId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await rejectConnection(connectionId);
      setRequests(prev => prev.filter(req => req.connection_id !== connectionId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px" }}>

      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontSize: "13px", color: "var(--blue)", marginBottom: "8px", fontWeight: 500 }}>
          INBOX
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800 }}>Connection Requests</h1>
        <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "15px" }}>
          {requests.length} pending request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {requests.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "60px 0",
          background: "var(--surface)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
          <p style={{ color: "var(--muted)" }}>No pending requests</p>
        </div>
      )}

      {requests.map(req => (
        <div
          key={req.connection_id}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
            }}>
              {req.username[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>@{req.username}</div>
              <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "2px" }}>wants to connect</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleAccept(req.connection_id)}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, var(--blue), var(--indigo))",
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(req.connection_id)}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--muted)",
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Requests;