import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch events from our new backend endpoint!
    api.get("events/")
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load events", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 32px" }}>
      {/* Header Section with Host Button */}
      <div className="animate-fadeUp" style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="section-label">DISCOVER</div>
          <h1 style={{ fontSize: "32px", fontWeight: 800 }}>Upcoming Events</h1>
          <p style={{ color: "var(--dim)", fontSize: "15px", marginTop: "8px" }}>
            Find events and start networking before they begin.
          </p>
        </div>
        <button 
          onClick={() => navigate("/events/create")} 
          style={{ 
            padding: "12px 24px", 
            borderRadius: "10px", 
            border: "none", 
            background: "var(--blue)", 
            color: "white", 
            fontWeight: 600, 
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          + Host an Event
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <div className="spinner" />
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", background: "var(--surface)", borderRadius: "20px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
          <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>No events found</h3>
          <p style={{ color: "var(--dim)", fontSize: "14px" }}>Check back later or be the first to host one!</p>
        </div>
      ) : (
        <div className="animate-fadeUp-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {events.map((event) => (
            <div key={event.id} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "16px", padding: "24px", transition: "all 0.2s",
              cursor: "pointer", display: "flex", flexDirection: "column"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--blue)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            onClick={() => navigate(`/events/${event.id}/lobby`)}>
              
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{event.title}</h2>
              
              <div style={{ fontSize: "13px", color: "var(--dim)", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span>📅 {new Date(event.event_date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                <span>📍 {event.location || "TBA"}</span>
                <span>👤 Organized by @{event.organizer_username || "Admin"}</span>
              </div>
              
              <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px", flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {event.description}
              </p>
              
              <button style={{
                width: "100%", padding: "10px", background: "var(--surface2)",
                color: "var(--blue)", border: "none", borderRadius: "8px",
                fontWeight: 600, fontSize: "13px", transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface3)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--surface2)"}>
                Enter Lobby →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;