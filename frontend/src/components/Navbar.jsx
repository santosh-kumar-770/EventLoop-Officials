import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();

  // Get logged-in user's ID from token
  let userId = null;
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user_id;
    } catch (e) {
      userId = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div style={{ background: "#000", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px"
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h2 style={{ margin: 0 }}>EventLoop</h2>
        </Link>

        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <Link to="/">Dashboard</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/events">Events</Link>
          <Link to="/network">Network</Link>
          <Link to="/requests">Requests</Link>
          <Link to={`/profile/${userId}`}>Profile</Link>

          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid #ff4d4d",
              color: "#ff4d4d",
              padding: "6px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;