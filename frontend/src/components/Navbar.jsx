import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  let userId = null;
  const token = localStorage.getItem("access_token");
  if (token) {
    try { userId = jwtDecode(token).user_id; } catch (e) {}
  }

  useEffect(() => {
    const fetchCounts = () => {
      api.get("messaging/unread/").then(res => setUnread(res.data.unread_count)).catch(() => {});
      api.get("connections/pending/").then(res => setPendingRequests(res.data.length)).catch(() => {});
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: "⌂" },
    { to: "/discover", label: "Discover", icon: "✦" },
    { to: "/events", label: "Events", icon: "◈" },
    { to: "/network", label: "Network", icon: "⬡" },
    { to: "/messages", label: "Messages", icon: "◉", badge: unread },
    { to: "/requests", label: "Requests", icon: "⊕", badge: pendingRequests },
    { to: `/profile/${userId}`, label: "Profile", icon: "◎" },
  ];

  return (
    <nav style={{
      background: "rgba(8,10,15,0.85)",
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 28px",
        height: "58px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "linear-gradient(135deg, var(--blue), var(--indigo))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", boxShadow: "0 0 16px rgba(79,142,247,0.3)",
          }}>⟳</div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--text)", letterSpacing: "-0.02em" }}>
            Event<span style={{ background: "linear-gradient(135deg, var(--blue), var(--indigo))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Loop</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {navLinks.map(({ to, label, badge }) => {
            const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                style={{
                  position: "relative",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--text)" : "var(--muted)",
                  background: active ? "var(--surface2)" : "transparent",
                  border: active ? "1px solid var(--border2)" : "1px solid transparent",
                  transition: "all 0.15s",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}}
              >
                {label}
                {badge > 0 && (
                  <span style={{
                    background: "var(--blue)",
                    color: "white",
                    borderRadius: "99px",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    minWidth: "18px",
                    textAlign: "center",
                    animation: "pulse-glow 2s infinite",
                  }}>
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 8px" }} />

          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(247,95,95,0.3)",
              background: "transparent",
              color: "var(--red)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(247,95,95,0.1)"; e.currentTarget.style.borderColor = "var(--red)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(247,95,95,0.3)"; }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;