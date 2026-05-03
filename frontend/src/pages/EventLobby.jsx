import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EventLobby() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | connected | unknown
  const [actionState, setActionState] = useState({}); // userId -> "pending" | "accepted"

  const fetchLobby = () => {
    api.get(`events/${eventId}/attendees/`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLobby();
  }, [eventId]);

  const handleConnect = async (userId) => {
    try {
      await api.post("connections/send/", { receiver: userId });
      setActionState(prev => ({ ...prev, [userId]: "pending" }));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getConnectionStatus = (attendee) => {
    if (actionState[attendee.id]) return actionState[attendee.id];
    return attendee.connection?.status || "none";
  };

  const filteredAttendees = (data?.attendees || []).filter(a => {
    if (a.connection?.status === "self") return false;
    const status = getConnectionStatus(a);
    if (filter === "connected") return status === "accepted";
    if (filter === "unknown") return status === "none";
    return true;
  });

  if (loading) return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 32px", color: "var(--dim)" }}>
      Loading lobby...
    </div>
  );

  if (!data) return null;

  const { event } = data;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px" }}>

      {/* Back */}
      <button
        onClick={() => navigate("/events")}
        style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "14px", marginBottom: "24px", padding: 0, display: "flex", alignItems: "center", gap: "6px" }}
      >
        ← Back to Events
      </button>

      {/* Event header */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", color: "var(--blue)", fontWeight: 600, letterSpacing: "1px", marginBottom: "10px" }}>
          PRE-EVENT LOBBY
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "10px" }}>{event.title}</h1>
        <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>{event.description}</p>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {event.location && (
            <div style={{ fontSize: "13px", color: "var(--dim)", display: "flex", alignItems: "center", gap: "6px" }}>
              📍 {event.location}
            </div>
          )}
          {event.event_date && (
            <div style={{ fontSize: "13px", color: "var(--dim)", display: "flex", alignItems: "center", gap: "6px" }}>
              📅 {formatDate(event.event_date)}
            </div>
          )}
          <div style={{ fontSize: "13px", color: "var(--dim)", display: "flex", alignItems: "center", gap: "6px" }}>
            👥 {data.total_attendees} attending
          </div>
        </div>
      </div>

      {/* Attendees section */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Who's Coming</h2>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>
            Connect with attendees before the event starts
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["all", "connected", "unknown"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: filter === f ? "var(--blue)" : "transparent",
                color: filter === f ? "white" : "var(--muted)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? `All (${(data.attendees || []).filter(a => a.connection?.status !== "self").length})` : f === "connected" ? "Connected" : "New People"}
            </button>
          ))}
        </div>
      </div>

      {filteredAttendees.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🎉</div>
          <p style={{ color: "var(--muted)" }}>
            {filter === "connected" ? "None of your connections are attending yet" : "No new people to connect with yet"}
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filteredAttendees.map(attendee => {
          const connStatus = getConnectionStatus(attendee);
          const isConnected = connStatus === "accepted";
          const isPending = connStatus === "pending";

          return (
            <div
              key={attendee.id}
              style={{
                background: "var(--surface)",
                border: `1px solid ${isConnected ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "transform 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  onClick={() => navigate(`/profile/${attendee.id}`)}
                  style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: isConnected
                      ? "linear-gradient(135deg, var(--blue), var(--indigo))"
                      : "linear-gradient(135deg, #2a3040, #1a2030)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "16px", color: "white",
                    flexShrink: 0, cursor: "pointer", fontFamily: "Syne, sans-serif",
                  }}
                >
                  {attendee.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    onClick={() => navigate(`/profile/${attendee.id}`)}
                    style={{ fontWeight: 700, fontSize: "15px", cursor: "pointer" }}
                  >
                    @{attendee.username}
                  </div>
                  {attendee.profile?.college && (
                    <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {attendee.profile.college}
                    </div>
                  )}
                </div>
                {isConnected && (
                  <div style={{ fontSize: "10px", background: "rgba(59,130,246,0.15)", color: "var(--blue)", padding: "3px 8px", borderRadius: "20px", fontWeight: 600, flexShrink: 0 }}>
                    Connected
                  </div>
                )}
              </div>

              {/* Bio */}
              {attendee.profile?.bio && (
                <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.5", margin: 0 }}>
                  {attendee.profile.bio.length > 80 ? attendee.profile.bio.slice(0, 80) + "..." : attendee.profile.bio}
                </p>
              )}

              {/* Skills */}
              {attendee.profile?.skills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {attendee.profile.skills.split(",").slice(0, 3).map((skill, i) => (
                    <span key={i} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "rgba(99,102,241,0.1)", color: "#818cf8", fontWeight: 500 }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                {isConnected ? (
                  <button
                    onClick={() => navigate(`/messages/${attendee.id}`)}
                    style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, var(--blue), var(--indigo))", color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                  >
                    💬 Message
                  </button>
                ) : isPending ? (
                  <button disabled style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--dim)", fontSize: "13px", fontFamily: "DM Sans, sans-serif" }}>
                    Request Sent
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(attendee.id)}
                    style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1px solid var(--blue)", background: "rgba(59,130,246,0.1)", color: "var(--blue)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                  >
                    + Connect
                  </button>
                )}
                <button
                  onClick={() => navigate(`/profile/${attendee.id}`)}
                  style={{ padding: "9px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: "13px", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
                >
                  Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventLobby;