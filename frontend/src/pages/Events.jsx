import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [joined, setJoined] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("events/")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const joinEvent = async (eventId) => {
    try {
      await api.post("events/register/", { event: eventId });
      setJoined(prev => ({ ...prev, [eventId]: true }));
    } catch (err) {
      const msg = err.response?.data?.error || "";
      if (msg.toLowerCase().includes("already")) {
        setJoined(prev => ({ ...prev, [eventId]: true }));
      }
      console.error(err.response?.data);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

      <div style={{ marginBottom: "36px" }}>
        <div style={{ fontSize: "13px", color: "var(--blue)", marginBottom: "8px", fontWeight: 500 }}>
          CAMPUS
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800 }}>Events</h1>
        <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: "15px" }}>
          Discover and join events happening around campus
        </p>
      </div>

      {events.length === 0 && (
        <p style={{ color: "var(--dim)" }}>No events available</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {events.map(event => (
          <div
            key={event.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#2a3040";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(59,130,246,0.1)",
              borderRadius: "20px",
              fontSize: "11px",
              color: "var(--blue)",
              fontWeight: 600,
              letterSpacing: "0.5px",
              width: "fit-content",
            }}>
              EVENT
            </div>

            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{event.title}</h2>

            <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6" }}>
              {event.description}
            </p>

            {event.date && (
              <div style={{ fontSize: "13px", color: "var(--dim)" }}>
                📅 {event.date}
              </div>
            )}

            <button
              onClick={() => joinEvent(event.id)}
              disabled={joined[event.id]}
              style={{
                marginTop: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: joined[event.id] ? "1px solid var(--border)" : "none",
                background: joined[event.id]
                  ? "transparent"
                  : "linear-gradient(135deg, var(--blue), var(--indigo))",
                color: joined[event.id] ? "var(--green)" : "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: joined[event.id] ? "default" : "pointer",
                fontFamily: "DM Sans, sans-serif",
                transition: "opacity 0.2s",
              }}
            >
              {joined[event.id] ? "Joined ✓" : "Join Event"}
            </button>

            <button
              onClick={() => navigate(`/events/${event.id}/lobby`)}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--muted)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              👥 View Lobby
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;