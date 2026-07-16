import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EventLobby() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [actionState, setActionState] = useState({}); 

  const fetchLobby = () => {
    api.get(`events/${eventId}/attendees/`)
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching lobby:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLobby();
  }, [eventId]);

  const handleConnect = async (userId) => {
    // Optimistic UI update: change button to "Request Sent" immediately
    setActionState(prev => ({ ...prev, [userId]: "pending" }));
    try {
      await api.post("connections/send/", { receiver: userId });
    } catch (err) {
      console.error(err);
      // Revert if it fails
      setActionState(prev => ({ ...prev, [userId]: undefined }));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getConnectionStatus = (attendee) => {
    if (actionState[attendee.id]) return actionState[attendee.id];
    return attendee.connection?.status || "none";
  };

  if (loading) return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 32px", textAlign: "center", color: "var(--dim)" }}>
      Loading lobby...
    </div>
  );

  if (!data) return null;

  const { event } = data;
  const filteredAttendees = (data.attendees || []).filter(a => {
    if (a.connection?.status === "self") return false;
    const status = getConnectionStatus(a);
    if (filter === "connected") return status === "accepted";
    if (filter === "unknown") return status === "none";
    return true;
  });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px" }}>
      <button onClick={() => navigate("/events")} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "14px", marginBottom: "24px", padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
        ← Back to Events
      </button>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", color: "var(--blue)", fontWeight: 600, letterSpacing: "1px", marginBottom: "10px" }}>PRE-EVENT LOBBY</div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "10px" }}>{event.title}</h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>{event.description}</p>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {event.location && <div style={{ fontSize: "13px", color: "var(--dim)" }}>📍 {event.location}</div>}
          {event.event_date && <div style={{ fontSize: "13px", color: "var(--dim)" }}>📅 {formatDate(event.event_date)}</div>}
          <div style={{ fontSize: "13px", color: "var(--dim)" }}>👥 {data.total_attendees} attending</div>
        </div>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Who's Coming</h2>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "connected", "unknown"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: filter === f ? "var(--blue)" : "transparent", color: filter === f ? "white" : "var(--muted)", fontSize: "12px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
              {f === "all" ? `All (${(data.attendees || []).filter(a => a.connection?.status !== "self").length})` : f === "connected" ? "Connected" : "New People"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filteredAttendees.map(attendee => {
          const connStatus = getConnectionStatus(attendee);
          const isConnected = connStatus === "accepted";
          const isPending = connStatus === "pending";

          return (
            <div key={attendee.id} style={{ background: "var(--surface)", border: `1px solid ${isConnected ? "rgba(59,130,246,0.3)" : "var(--border)"}`, borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div onClick={() => navigate(`/profile/${attendee.id}`)} style={{ width: "44px", height: "44px", borderRadius: "50%", background: isConnected ? "var(--blue)" : "#2a3040", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", cursor: "pointer" }}>
                  {attendee.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div onClick={() => navigate(`/profile/${attendee.id}`)} style={{ fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>@{attendee.username}</div>
                  {attendee.profile?.college && <div style={{ fontSize: "12px", color: "var(--dim)" }}>{attendee.profile.college}</div>}
                </div>
              </div>

              {attendee.profile?.bio && <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>{attendee.profile.bio.slice(0, 60)}...</p>}

              <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                {isConnected ? (
                  <button onClick={() => navigate(`/messages/${attendee.id}`)} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "none", background: "var(--blue)", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>💬 Message</button>
                ) : isPending ? (
                  <button disabled style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "13px" }}>Request Sent</button>
                ) : (
                  <button onClick={() => handleConnect(attendee.id)} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid var(--blue)", background: "rgba(59,130,246,0.1)", color: "var(--blue)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Connect</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventLobby;