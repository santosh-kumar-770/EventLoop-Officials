import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    // { name: "Profile", path: `/profile/${myId}` },
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

      {/* Profile / Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Profile / Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

          {/* New Profile Button! */}
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
      
    </div>
    </nav >
  );
}

export default Navbar;