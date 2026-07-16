import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Network() {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // Helper to fetch both connections and pending requests
  const fetchData = async () => {
    try {
      const connRes = await api.get("connections/my/");
      setConnections(connRes.data);
      
      // Matches the 'connections/requests/' path in urls.py
      const reqRes = await api.get("connections/requests/"); 
      setRequests(reqRes.data);
    } catch (err) {
      console.error("Error fetching network data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      // Matches the 'connections/handle/<conn_id>/' path in urls.py
      await api.post(`connections/handle/${id}/`, { action });
      fetchData(); // Refresh both lists after action
    } catch (err) {
      console.error("Error handling connection:", err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px" }}>

      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontSize: "13px", color: "var(--blue)", marginBottom: "8px", fontWeight: 500 }}>
          NETWORK
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800 }}>My Network</h1>
      </div>

      {/* PENDING REQUESTS SECTION */}
      {requests.length > 0 && (
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Pending Requests ({requests.length})</h2>
          {requests.map(req => (
            <div key={req.id} style={{
              background: "var(--surface)", border: "1px solid var(--indigo)",
              borderRadius: "12px", padding: "16px 24px", marginBottom: "12px",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <span style={{ fontWeight: 600 }}>@{req.username}</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => handleAction(req.id, "accept")} 
                  style={{ padding: "6px 16px", borderRadius: "6px", border: "none", background: "var(--blue)", color: "white", cursor: "pointer", fontWeight: 600 }}
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleAction(req.id, "decline")} 
                  style={{ padding: "6px 16px", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", cursor: "pointer" }}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONNECTIONS LIST */}
      <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Connections ({connections.length})</h2>

      {connections.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 0", background: "var(--surface)",
          borderRadius: "16px", border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>👥</div>
          <p style={{ color: "var(--muted)", marginBottom: "16px" }}>No connections yet</p>
          <button
            onClick={() => navigate("/discover")}
            style={{
              padding: "10px 24px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, var(--blue), var(--indigo))",
              color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer"
            }}
          >
            Discover People
          </button>
        </div>
      )}

      {connections.map(user => (
        <div
          key={user.id}
          style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "20px 24px", marginBottom: "12px",
            display: "flex", alignItems: "center", gap: "16px"
          }}
        >
          <div
            onClick={() => navigate(`/profile/${user.id}`)}
            style={{
              width: "42px", height: "42px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--blue), var(--indigo))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "16px", color: "white", flexShrink: 0, cursor: "pointer"
            }}
          >
            {user.username[0].toUpperCase()}
          </div>

          <div
            onClick={() => navigate(`/profile/${user.id}`)}
            style={{ flex: 1, cursor: "pointer" }}
          >
            <div style={{ fontWeight: 600, fontSize: "15px" }}>@{user.username}</div>
            <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "2px" }}>View profile →</div>
          </div>

          <button
            onClick={() => navigate(`/messages/${user.id}`)}
            style={{
              padding: "8px 18px", borderRadius: "8px", border: "1px solid var(--blue)",
              background: "rgba(59,130,246,0.1)", color: "var(--blue)",
              fontSize: "13px", fontWeight: 600, cursor: "pointer"
            }}
          >
            💬 Message
          </button>
        </div>
      ))}
    </div>
  );
}

export default Network;