import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  let username = "there";
  let userId = null;
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode(token);
      username = decoded.username || "there";
      userId = decoded.user_id;
    }
  } catch (e) {}

  useEffect(() => {
    api.get("dashboard/").then(res => setData(res.data)).catch(console.error);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    { label: "Discover People", icon: "✦", desc: "Find new connections", to: "/discover", color: "var(--blue)" },
    { label: "Browse Events", icon: "◈", desc: "See what's happening", to: "/events", color: "var(--indigo)" },
    { label: "My Network", icon: "⬡", desc: "View connections", to: "/network", color: "var(--green)" },
    { label: "Messages", icon: "◉", desc: "Check your inbox", to: "/messages", color: "var(--amber)" },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 28px" }}>

      {/* Hero greeting */}
      <div className="animate-fadeUp" style={{ marginBottom: "40px", position: "relative" }}>
        <div style={{ position: "absolute", top: "-20px", right: "0", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="section-label">{greeting()}</div>
        <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.03em" }}>
          Hey, <span style={{ background: "linear-gradient(135deg, var(--blue), var(--indigo))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>@{username}</span> 👋
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px" }}>
          Here's what's happening in your campus network
        </p>
      </div>

      {/* Quick actions */}
      <div className="animate-fadeUp-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "32px" }}>
        {quickActions.map(({ label, icon, desc, to, color }) => (
          <div
            key={to}
            onClick={() => navigate(to)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "20px",
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "var(--border2)";
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "10px", color }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{label}</div>
            <div style={{ fontSize: "12px", color: "var(--dim)" }}>{desc}</div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.4 }} />
          </div>
        ))}
      </div>

      {!data && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[1, 2].map(i => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px", height: "260px" }}>
              <div className="skeleton" style={{ height: "14px", width: "40%", marginBottom: "20px" }} />
              {[1, 2, 3].map(j => <div key={j} className="skeleton" style={{ height: "52px", marginBottom: "10px", borderRadius: "10px" }} />)}
            </div>
          ))}
        </div>
      )}

      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Upcoming Events */}
          <div className="animate-fadeUp-2" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div className="section-label">UPCOMING</div>
                <h2 style={{ fontSize: "17px", fontWeight: 700 }}>Events</h2>
              </div>
              <button onClick={() => navigate("/events")} style={{ background: "transparent", border: "none", color: "var(--blue)", fontSize: "13px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
                View all →
              </button>
            </div>

            {data.upcoming_events?.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>◈</div>
                <p style={{ color: "var(--dim)", fontSize: "13px", marginBottom: "14px" }}>No upcoming events</p>
                <button onClick={() => navigate("/events")} className="btn btn-outline-blue" style={{ fontSize: "13px", padding: "8px 16px" }}>Browse Events</button>
              </div>
            )}

            {(data.upcoming_events || []).map((event, i) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}/lobby`)}
                style={{
                  padding: "14px 16px",
                  background: "var(--surface2)",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  borderLeft: "2px solid var(--blue)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  animationDelay: `${i * 0.05}s`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surface3)"; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.transform = "translateX(0)"; }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "3px" }}>{event.title}</div>
                  {event.event_date && <div style={{ fontSize: "12px", color: "var(--dim)" }}>📅 {new Date(event.event_date).toLocaleDateString([], { month: "short", day: "numeric" })}</div>}
                </div>
                <span style={{ fontSize: "11px", color: "var(--blue)", fontWeight: 600 }}>Lobby →</span>
              </div>
            ))}
          </div>

          {/* Connections Activity */}
          <div className="animate-fadeUp-3" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div className="section-label">NETWORK</div>
                <h2 style={{ fontSize: "17px", fontWeight: 700 }}>Activity</h2>
              </div>
              <button onClick={() => navigate("/network")} style={{ background: "transparent", border: "none", color: "var(--blue)", fontSize: "13px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
                View all →
              </button>
            </div>

            {data.connections_activity?.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>⬡</div>
                <p style={{ color: "var(--dim)", fontSize: "13px", marginBottom: "14px" }}>No activity yet</p>
                <button onClick={() => navigate("/discover")} className="btn btn-outline-blue" style={{ fontSize: "13px", padding: "8px 16px" }}>Discover People</button>
              </div>
            ) : (
              (data.connections_activity || []).map((item, i) => {
                const other = item.sender || item.receiver;
                return (
                  <div
                    key={i}
                    onClick={() => navigate(`/profile/${other?.id}`)}
                    style={{
                      padding: "12px 16px",
                      background: "var(--surface2)",
                      borderRadius: "10px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--surface3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--surface2)"; }}
                  >
                    <div className="avatar" style={{ width: "34px", height: "34px", fontSize: "13px" }}>
                      {other?.username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>@{other?.username}</span>
                      <span style={{ fontSize: "13px", color: "var(--dim)" }}> connected with you</span>
                    </div>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--green)" }} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;