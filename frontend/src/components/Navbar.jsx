import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const path = window.location.pathname;

  let userId = null;
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      userId = jwtDecode(token).user_id;
    } catch (e) {}
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/discover", label: "Discover" },
    { to: "/events", label: "Events" },
    { to: "/network", label: "Network" },
    { to: "/requests", label: "Requests" },
    { to: `/profile/${userId}`, label: "Profile" },
    { to: "/messages", label: "Messages" },
  ];

  return (
    <nav style={{
      background: "rgba(13,13,15,0.95)",
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 32px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "20px",
            color: "var(--text)",
            letterSpacing: "0.5px",
          }}>
            Event<span style={{ color: "var(--blue)" }}>Loop</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {navLinks.map(({ to, label }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--blue)" : "var(--muted)",
                  background: active ? "rgba(59,130,246,0.08)" : "transparent",
                  transition: "all 0.15s",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            style={{
              marginLeft: "12px",
              padding: "6px 16px",
              borderRadius: "8px",
              border: "1px solid var(--red)",
              background: "transparent",
              color: "var(--red)",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.target.style.background = "var(--red)";
              e.target.style.color = "white";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
              e.target.style.color = "var(--red)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;