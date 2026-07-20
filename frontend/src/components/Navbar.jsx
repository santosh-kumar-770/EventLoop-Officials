import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

// Notification Bell Sub-component
function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleNotificationClick = async (id, targetUrl) => {
    try {
      await api.post(`notifications/${id}/read/`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          background: "var(--surface2)", border: "1px solid var(--border)", 
          padding: "8px 12px", borderRadius: "8px", cursor: "pointer", 
          fontSize: "16px", display: "flex", alignItems: "center", position: "relative" 
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{ 
            position: "absolute", top: "-5px", right: "-5px", 
            background: "#ef4444", color: "white", borderRadius: "50%", 
            padding: "2px 6px", fontSize: "10px", fontWeight: "bold" 
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: "absolute", right: 0, marginTop: "8px", width: "320px", 
          background: "var(--surface)", border: "1px solid var(--border)", 
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)", borderRadius: "12px", 
          padding: "16px", zIndex: 1000, maxHeight: "400px", overflowY: "auto" 
        }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", color: "white", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
            Notifications
          </h4>
          {notifications.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--dim)", textAlign: "center", margin: "20px 0" }}>No notifications yet.</p>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => handleNotificationClick(n.id, n.target_url)}
                style={{ 
                  padding: "10px", marginBottom: "8px", borderRadius: "8px", 
                  fontSize: "13px", cursor: "pointer", transition: "background 0.2s",
                  background: n.is_read ? "transparent" : "var(--surface2)",
                  color: n.is_read ? "var(--dim)" : "white",
                  border: "1px solid var(--border)"
                }}
              >
                <div>{n.verb}</div>
                <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: "4px" }}>
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  let myId = null;
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      myId = jwtDecode(token).user_id;
    }
  } catch (e) { }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Discover", path: "/discover" },
    { name: "Events", path: "/events" },
    { name: "Network", path: "/network" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "16px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px",
          borderRadius: "8px", background: "linear-gradient(135deg, var(--blue), var(--indigo))",
          color: "white", fontWeight: "bold", fontSize: "16px"
        }}>
          ⟳
        </div>
        <span style={{ fontSize: "20px", fontWeight: 800, color: "white" }}>
          Event<span style={{ color: "var(--blue)" }}>Loop</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "32px" }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.name} to={link.path} style={{
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--blue)" : "var(--dim)",
              transition: "color 0.2s",
              position: "relative"
            }}>
              {link.name}
              {isActive && (
                <div style={{
                  position: "absolute", bottom: "-22px", left: 0, right: 0,
                  height: "3px", background: "var(--blue)", borderRadius: "3px 3px 0 0"
                }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Side Actions: Notification Bell + Profile + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Notification Bell Component */}
        <NotificationBell />

        {myId && (
          <button onClick={() => navigate(`/profile/${myId}`)} style={{
            background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--blue)",
            padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--surface3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface2)"; }}>
            My Profile
          </button>
        )}

        <button onClick={handleLogout} style={{
          background: "transparent", border: "1px solid var(--border)", color: "var(--dim)",
          padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          cursor: "pointer", transition: "all 0.2s"
        }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--red)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;